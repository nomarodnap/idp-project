import { NextResponse } from "next/server";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createBetterAuthSession } from "@/actions/auth";
import { decryptPassword } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const THAID_CLIENT_ID = process.env.THAID_CLIENT_ID || "";
  const THAID_CLIENT_SECRET = process.env.THAID_CLIENT_SECRET || "";
  const THAID_REDIRECT_URI = process.env.THAID_REDIRECT_URI || "";
  const DPIS_DOMAIN = process.env.DPIS_DOMAIN || "";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=MissingCode", request.url));
  }

  try {
    // 1. Get Token from ThaID
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", THAID_REDIRECT_URI);
    params.append("client_id", THAID_CLIENT_ID);
    params.append("client_secret", THAID_CLIENT_SECRET);

    const thaidResponse = await axios.post("https://imauth.bora.dopa.go.th/api/v2/oauth2/token/", params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const tokenData = thaidResponse.data;
    const decoded = jwt.decode(tokenData.id_token) as { pid?: string };

    const pid = decoded?.pid;
    if (!pid) throw new Error("ไม่พบ pid ใน id_token");

    // 2. Fetch encrypted password from DB
    const [userRecord] = await db.select().from(users).where(eq(users.citizenId, pid));

    if (!userRecord || !userRecord.dpisPassword) {
      // User hasn't logged in with DPIS before
      return NextResponse.redirect(new URL("/login?error=FirstTimeDPISLoginRequired", request.url));
    }

    const decryptedPassword = decryptPassword(userRecord.dpisPassword);

    // 3. Request token from DPIS
    const USER_API = process.env.DPIS_API_USER;
    const PASSWORD_API = process.env.DPIS_API_PASS;
    const dpisAuthRes = await axios.post(`${DPIS_DOMAIN}oapi/login`, {
      username: USER_API,
      password: PASSWORD_API,
    });
    
    if (!dpisAuthRes.data || !dpisAuthRes.data.accessToken) {
       throw new Error("ไม่สามารถเชื่อมต่อกับ DPIS ได้ (Token Error)");
    }
    const dpisToken = dpisAuthRes.data.accessToken;

    // 4. Login to DPIS with user credentials
    const dpisUserRes = await axios.post(
      `${DPIS_DOMAIN}api/authuser/authcheck`,
      new URLSearchParams({
        authen_user: pid,
        authen_password: decryptedPassword,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: dpisToken,
        },
      }
    );

    if (!dpisUserRes.data?.data) {
      throw new Error("รหัสประจำตัวประชาชนหรือรหัสผ่านจากระบบ DPIS ไม่ถูกต้อง");
    }

    let userData;
    try {
      userData = typeof dpisUserRes.data.data === "string" ? JSON.parse(dpisUserRes.data.data) : dpisUserRes.data.data;
    } catch (e) {
      throw new Error("รูปแบบข้อมูลจากระบบ DPIS ไม่ถูกต้อง");
    }

    if (!userData.per_cardno) {
       throw new Error("ไม่พบข้อมูลของคุณในระบบ DPIS");
    }

    // 5. Update user info in DB
    const pseudoEmail = `${userData.per_cardno}@dpis.local`;
    const fullName = `${userData.pn_name}${userData.per_name} ${userData.per_surname}`;

    const [updatedUser] = await db
      .insert(users)
      .values({
        citizenId: userData.per_cardno,
        email: pseudoEmail,
        name: fullName,
        emailVerified: true,
        title: userData.pn_name,
        firstName: userData.per_name,
        lastName: userData.per_surname,
        employeeType: userData.pertype_name,
        position: userData.pl_name,
        level: userData.per_level_name,
        department: userData.org_name,
        division: userData.org_name1,
        dpisPassword: userRecord.dpisPassword, // keep the same
      })
      .onConflictDoUpdate({
        target: users.citizenId,
        set: {
          name: fullName,
          title: userData.pn_name,
          firstName: userData.per_name,
          lastName: userData.per_surname,
          employeeType: userData.pertype_name,
          position: userData.pl_name,
          level: userData.per_level_name,
          department: userData.org_name,
          division: userData.org_name1,
          updatedAt: new Date(),
        },
      })
      .returning({ id: users.id });

    // 6. Create Better Auth session
    await createBetterAuthSession(updatedUser.id);

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error: any) {
    console.error("ThaID Login Error:", error);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message || "ThaIDLoginFailed")}`, request.url));
  }
}
