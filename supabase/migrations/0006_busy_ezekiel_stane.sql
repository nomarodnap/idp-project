CREATE TABLE "competency_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"employee_type" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "competency_categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "training_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"provider" varchar(255),
	"duration" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
