CREATE TABLE "messages" (
  "id" SERIAL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);