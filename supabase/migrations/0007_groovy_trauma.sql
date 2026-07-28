ALTER TABLE "idp_plans" ADD COLUMN "supervisor_position" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "idp_plans" ADD COLUMN "self_evaluation_result" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "system_role" varchar(50) DEFAULT 'User' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "supervisor_id" uuid;