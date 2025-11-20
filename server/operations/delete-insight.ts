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
    console.log(`Deleting insight id=${id}`);

    db.sql`DELETE FROM insights WHERE id = ${id}`;

    // Confirm deletion
    const [row] = db.sql`SELECT id FROM insights WHERE id = ${id} LIMIT 1`;
    const success = !row;

    console.log(`Delete successful: ${success}`);
    return success;
  } catch (err) {
    console.error(`Error deleting insight id=${id}:`, err);
    return false;
  }
};
