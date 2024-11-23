CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "post_id" INTEGER NOT NULL REFERENCES "blog_posts"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);