/**
 * Regenerate profit snapshot fixture after intentional calculator changes.
 * Run: npm run test:snapshots:write
 */
import { writeFileSync } from "node:fs";
import {
  buildProfitSnapshots,
  PROFIT_SNAPSHOT_FIXTURE_PATH,
} from "../tests/e2e/profit-snapshot-helpers";

async function main() {
  const snapshots = await buildProfitSnapshots();
  writeFileSync(
    PROFIT_SNAPSHOT_FIXTURE_PATH,
    `${JSON.stringify(snapshots, null, 2)}\n`,
    "utf8",
  );
  console.log(
    `Wrote ${Object.keys(snapshots).length} profit snapshots to ${PROFIT_SNAPSHOT_FIXTURE_PATH}`,
  );
}

main();
