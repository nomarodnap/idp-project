ALTER TABLE "competency_categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "training_courses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "competency_categories" CASCADE;--> statement-breakpoint
DROP TABLE "training_courses" CASCADE;--> statement-breakpoint
ALTER TABLE "idp_plans" ADD COLUMN "plan_code" varchar(50) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "idp_plans" ADD CONSTRAINT "idp_plans_plan_code_unique" UNIQUE("plan_code");