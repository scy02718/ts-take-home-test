import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
};

export default (input: Input): Insight | null => {
  const { db, brand, text } = input;

  if (typeof brand !== "number" || brand < 0 || !text) {
    console.warn("Invalid input to createInsight:", input);
    return null;
  }

  try {
    console.log("Creating insight", { brand, text });

    const createdAt = new Date().toISOString();

    db.sql`INSERT INTO insights (brand, createdAt, text) VALUES (${brand}, ${createdAt}, ${text})`;

    const rowId = db.lastInsertRowId;

    const result: Insight = {
      id: Number(rowId),
      brand,
      createdAt: new Date(createdAt),
      text,
    };

    console.log("Insight created:", result);
    return result;
  } catch (err) {
    console.error("Error creating insight:", err);
    return null;
  }
};
