CREATE TABLE "profiles" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL UNIQUE,
  "full_name" TEXT,
  "username" TEXT,
  "phone_number" TEXT,
  "gender" TEXT,
  "country" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);