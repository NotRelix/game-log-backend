import { sql } from "drizzle-orm";
import { db } from "./drizzle.js";
import { postsTable, rolesTable, usersTable } from "./schema.js";

const roles = [{ role: "admin" }, { role: "user" }, { role: "author" }];

async function main() {
  try {
    console.log("resetting...");
    await db.execute(sql`
      TRUNCATE TABLE ${usersTable}, ${postsTable}, ${rolesTable} 
      RESTART IDENTITY CASCADE
    `);
    await db.insert(rolesTable).values(roles);
    console.log("done");
  } catch (err) {
    console.error("Failed to reset", err);
  } finally {
    await db.$client.end();
  }
}

main();
