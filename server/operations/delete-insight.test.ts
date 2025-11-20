// deno-lint-ignore-file no-import-prefix no-unversioned-import
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import deleteInsight from "./delete-insight.ts";
import createInsights from "./create-insight.ts";

describe("deleting insights in the database", () => {
  describe("delete existing insight", () => {
    withDB((fixture) => {
      let created: Insight | null;
      let deleted: boolean;

      beforeAll(() => {
        created = createInsights({
          db: fixture.db,
          brand: 1,
          text: "To delete",
        });
        deleted = deleteInsight({ db: fixture.db, id: created!.id });
      });

      it("returns true on successful deletion", () => {
        expect(deleted).toBe(true);
      });

      it("removes the insight from the DB", () => {
        const row = fixture.db.sql<{ id: number }>`
          SELECT * FROM insights WHERE id = ${created!.id} LIMIT 1
        `;
        expect(row.length).toBe(0);
      });
    });
  });

  describe("delete non-existent insight", () => {
    withDB((fixture) => {
      let deleted: boolean;

      beforeAll(() => {
        deleted = deleteInsight({ db: fixture.db, id: 9999 });
      });

      it("returns false when insight does not exist", () => {
        expect(deleted).toBe(false);
      });
    });
  });
});
