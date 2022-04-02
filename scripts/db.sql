CREATE TABLE links (
  "id" SERIAL PRIMARY KEY,
  "url" TEXT NOT NULL,
  "title" TEXT,
  "text" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "viewed_at" TIMESTAMP(3)
);
