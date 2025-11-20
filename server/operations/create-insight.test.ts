import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import createInsights from "./create-insight.ts";

describe("creating insights in the database", () => {
  describe("valid creation", () => {
    withDB((fixture) => {
      let created: Insight | null;

      beforeAll(() => {
        created = createInsights({
          db: fixture.db,
          brand: 1,
          text: "Test insight",
        });
      });

      it("returns a valid insight", () => {
        expect(created).not.toBeNull();
        expect(created?.id).toBeGreaterThan(0);
        expect(created?.brand).toBe(1);
        expect(created?.text).toBe("Test insight");
      });

      it("actually inserts the insight into the DB", () => {
        const row = fixture.db.sql<{ id: number; brand: number; text: string }>`
          SELECT * FROM insights WHERE id = ${created?.id} LIMIT 1
        `;
        expect(row.length).toBe(1);
        expect(row[0].brand).toBe(1);
        expect(row[0].text).toBe("Test insight");
      });
    });
  });

  describe("invalid creation", () => {
    withDB((fixture) => {
      let created: Insight | null;

      beforeAll(() => {
        // brand is negative, text empty
        created = createInsights({ db: fixture.db, brand: -1, text: "" });
      });

      it("returns null", () => {
        expect(created).toBeNull();
      });
    });
  });
});
