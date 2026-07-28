CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"citizen_id" varchar(13) NOT NULL,
	"title" varchar(50),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"employee_type" varchar(100),
	"position" varchar(150),
	"level" varchar(100),
	"department" varchar(255),
	"division" varchar(255),
	"avatar_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_citizen_id_unique" UNIQUE("citizen_id")
);
