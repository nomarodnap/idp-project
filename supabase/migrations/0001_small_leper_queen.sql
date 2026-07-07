CREATE TABLE "idp_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idp_id" uuid NOT NULL,
	"approver_id" uuid NOT NULL,
	"status" varchar(50) NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idp_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idp_id" uuid NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"completion_date" date,
	"certificate_url" varchar(255),
	"report_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idp_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"fiscal_year" integer NOT NULL,
	"dev_category" varchar(255) NOT NULL,
	"dev_topic" varchar(255) NOT NULL,
	"course_title" varchar(255) NOT NULL,
	"dev_70" text NOT NULL,
	"dev_20" text NOT NULL,
	"dev_10" text NOT NULL,
	"supervisor_name" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "idp_approvals" ADD CONSTRAINT "idp_approvals_idp_id_idp_plans_id_fk" FOREIGN KEY ("idp_id") REFERENCES "public"."idp_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_approvals" ADD CONSTRAINT "idp_approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_evaluations" ADD CONSTRAINT "idp_evaluations_idp_id_idp_plans_id_fk" FOREIGN KEY ("idp_id") REFERENCES "public"."idp_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_plans" ADD CONSTRAINT "idp_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;