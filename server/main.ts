// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";

import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsights from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);
await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Initialising server");
const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = "OK";
});

router.get("/insights", (ctx) => {
  try {
    const result = listInsights({ db });
    ctx.response.status = 200;
    ctx.response.body = result;
  } catch (err) {
    console.error("Error listing insights:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to list insights" };
  }
});

router.get("/insights/:id", (ctx) => {
  const rawId = ctx.params.id;
  const id = Number(rawId);

  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid insight ID" };
    return;
  }

  const result = lookupInsight({ db, id });

  if (!result) {
    ctx.response.status = 404;
    ctx.response.body = { error: `Insight with id ${id} not found` };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = result;
});

router.post("/insights", async (ctx) => {
  if (ctx.request.method !== "POST") return;

  const body = ctx.request.body;
  const { brand, text } = await body.json();

  if (typeof brand !== "number" || typeof text !== "string") {
    ctx.response.status = 400;
    ctx.response.body = {
      error:
        "Invalid payload. 'brand' must be a number and 'text' must be a string.",
    };
    return;
  }

  try {
    const created = createInsights({ db, brand, text });
    ctx.response.status = 201;
    ctx.response.body = created;
  } catch (err) {
    console.error("Error creating insight:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to create insight" };
  }
});

router.delete("/insights/:id", (ctx) => {
  const rawId = ctx.params.id;
  const id = Number(rawId);

  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid insight ID" };
    return;
  }

  const deleted = deleteInsight({ db, id });

  if (!deleted) {
    ctx.response.status = 404;
    ctx.response.body = { error: `Insight with id ${id} not found` };
    return;
  }

  ctx.response.status = 204; // Successfully deleted, no content to return
});

const app = new oak.Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
