import { pgTable, uuid, varchar, timestamp, text, integer, date, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // UUID (Primary Key)
  
  // Better Auth required fields
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),

  // DPIS fields
  citizenId: varchar("citizen_id", { length: 13 }).notNull().unique(), // รหัสบัตรประจำตัวประชาชน
  title: varchar("title", { length: 50 }), // คำนำหน้าชื่อ
  firstName: varchar("first_name", { length: 100 }).notNull(), // ชื่อจริง
  lastName: varchar("last_name", { length: 100 }).notNull(), // นามสกุล
  employeeType: varchar("employee_type", { length: 100 }), // ประเภท
  position: varchar("position", { length: 150 }), // ตำแหน่ง
  level: varchar("level", { length: 100 }), // ระดับ
  department: varchar("department", { length: 255 }), // กอง/สำนักงาน
  division: varchar("division", { length: 255 }), // กลุ่ม/ฝ่าย
  avatarUrl: text("avatar_url"), // ลิงก์รูปภาพ หรือ Base64 Image
  
  systemRole: varchar("system_role", { length: 50 }).notNull().default('User'), // User, Supervisor, Admin
  supervisorId: uuid("supervisor_id"), // อ้างอิง ID ของหัวหน้างาน

  createdAt: timestamp("created_at").defaultNow().notNull(), // created_at
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // updated_at
});

// Better Auth Tables
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt")
});

// IDP Tables
export const idpPlans = pgTable("idp_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  planCode: varchar("plan_code", { length: 50 }).notNull().unique().default(''), // IDP-YY-XXXXXX
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  fiscalYear: integer("fiscal_year").notNull(),
  devCategory: varchar("dev_category", { length: 255 }).notNull(),
  devTopic: varchar("dev_topic", { length: 255 }).notNull(),
  courseTitle: varchar("course_title", { length: 255 }).notNull(),
  dev70: text("dev_70").notNull(),
  dev20: text("dev_20").notNull(),
  dev10: text("dev_10").notNull(),
  supervisorName: varchar("supervisor_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('Draft'), // Draft, Pending, Approved, Rejected, Completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const idpEvaluations = pgTable("idp_evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  idpId: uuid("idp_id").notNull().references(() => idpPlans.id, { onDelete: 'cascade' }),
  progressPercent: integer("progress_percent").notNull().default(0),
  completionDate: date("completion_date"),
  certificateUrl: varchar("certificate_url", { length: 255 }),
  reportText: text("report_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const idpApprovals = pgTable("idp_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  idpId: uuid("idp_id").notNull().references(() => idpPlans.id, { onDelete: 'cascade' }),
  approverId: uuid("approver_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar("status", { length: 50 }).notNull(), // Approved, Rejected
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const competencyCategories = pgTable("competency_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  employeeType: varchar("employee_type", { length: 100 }), // null = all
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trainingCourses = pgTable("training_courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }),
  duration: varchar("duration", { length: 100 }), // e.g. "12 ชม."
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
