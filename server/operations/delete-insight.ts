import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): boolean => {
  const { db, id } = input;

  if (id < 0) {
    console.warn(`Attempted to delete invalid insight id=${id}`);
    return false;
  }

  try {
    console.log(`Deleting insight id=${input.id}`);

    // Check if the row exists first
    const [existing] = db
      .sql`SELECT id FROM insights WHERE id = ${input.id} LIMIT 1`;

    if (!existing) {
      console.log("Delete failed: insight does not exist");
      return false; // nothing to delete
    }

    input.db.exec(`DELETE FROM insights WHERE id = ${input.id}`);
    console.log("Delete successful");
    return true;
  } catch (err) {
    console.error(`Error deleting insight id=${id}:`, err);
    return false;
  }
};
