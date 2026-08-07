-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deletedAt" TIMESTAMP(3);

ALTER TABLE "products" ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce("name", '') || ' ' || coalesce("description", ''))
  ) STORED;

CREATE INDEX "products_search_idx" ON "products" USING GIN("search_vector");