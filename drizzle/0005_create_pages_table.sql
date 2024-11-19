CREATE TABLE "pages" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);