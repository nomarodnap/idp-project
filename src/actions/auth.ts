"use server";

import axios from "axios";
import { db } from "@/db";
import { users, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const DOMAIN_SERVER = process.env.DPIS_DOMAIN;
const USER_API = process.env.DPIS_API_USER;
const PASSWORD_API = process.env.DPIS_API_PASS;

async function getToken() {
  try {
    const response = await axios.post(`${DOMAIN_SERVER}oapi/login`, {
      username: USER_API,
      password: PASSWORD_API,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching DPIS token:", error);
    throw new Error("Failed to get API token");
  }
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function loginWithDPIS(formData: FormData) {
  const citizenId = formData.get("citizenId") as string;
  const password = formData.get("password") as string;

  if (!citizenId || !password) {
    return { error: "กรุณากรอกรหัสประจำตัวประชาชนและรหัสผ่าน" };
  }

  try {
    const tokenData = await getToken();
    if (!tokenData || !tokenData.accessToken) {
      return { error: "ระบบยืนยันตัวตนขัดข้อง (Token Error)" };
    }

    const apiResponse = await axios.post(
      `${DOMAIN_SERVER}api/authuser/authcheck`,
      new URLSearchParams({
        authen_user: citizenId,
        authen_password: password,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: tokenData.accessToken,
        },
      }
    );

    if (!apiResponse.data?.data) {
      return { error: "รหัสประจำตัวประชาชนหรือรหัสผ่านไม่ถูกต้อง" };
    }

    let userData;
    try {
      userData =
        typeof apiResponse.data.data === "string"
          ? JSON.parse(apiResponse.data.data)
          : apiResponse.data.data;
    } catch (error) {
      return { error: "รูปแบบข้อมูลจากระบบ DPIS ไม่ถูกต้อง" };
    }

    if (!userData.per_cardno) {
      return { error: "ไม่พบข้อมูลของคุณในระบบ DPIS" };
    }

    const pseudoEmail = `${userData.per_cardno}@dpis.local`;
    const fullName = `${userData.pn_name}${userData.per_name} ${userData.per_surname}`;

    // Upsert User
    const [user] = await db
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
        division: userData.org_name1, // or org_name2 depending on DPIS mapping
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

    // Manually create Better-Auth session in Database
    const sessionToken = generateSessionToken();
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8); // 8 hours

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    // Note: IP might be tricky depending on proxy, fallback to generic
    const ipAddress = headersList.get("x-forwarded-for") || "127.0.0.1"; 

    await db.insert(sessionTable).values({
      id: sessionId,
      token: sessionToken,
      userId: user.id,
      expiresAt,
      userAgent,
      ipAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set Cookie for Better Auth
    const cookieStore = await cookies();
    cookieStore.set("better-auth.session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return { success: true };
  } catch (error) {
    console.error("DPIS Login Error:", error);
    return { error: "เครือข่ายของระบบ DPIS มีปัญหา โปรดลองเข้าใหม่ในภายหลัง" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("better-auth.session_token");
}
