/**
 * Verifies src/data/potion-economics.ts recipes against ao-bin-dumps items.xml.
 * Run: node scripts/audit-potion-recipes.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const itemsPath = join(__dirname, ".albion-items.xml");
const recipesPath = join(__dirname, "../src/data/potion-economics.ts");

if (!existsSync(itemsPath)) {
  console.error(
    "Missing scripts/.albion-items.xml — download ao-bin-dumps items.xml first.",
  );
  process.exit(1);
}

const xml = readFileSync(itemsPath, "utf8");
const recipesSource = readFileSync(recipesPath, "utf8");

/** Parse outputId, focusCost, outputQuantity, and materials from potion-economics.ts */
function parseOurRecipes(source) {
  const recipes = [];
  const blocks = source.matchAll(
    /\{\s*id:\s*"([^"]+)"[\s\S]*?outputId:\s*"([^"]+)"[\s\S]*?outputQuantity:\s*(\d+)[\s\S]*?focusCost:\s*(\d+)[\s\S]*?materials:\s*\[([\s\S]*?)\],\s*\}/g,
  );
  for (const block of blocks) {
    const [, id, outputId, outputQuantity, focusCost, materialsBlock] = block;
    const materials = {};
    for (const m of materialsBlock.matchAll(
      /\{\s*id:\s*"([^"]+)"[\s\S]*?quantity:\s*(\d+)/g,
    )) {
      materials[m[1]] = Number(m[2]);
    }
    recipes.push({
      id,
      outputId,
      outputQuantity: Number(outputQuantity),
      focusCost: Number(focusCost),
      materials,
    });
  }
  return recipes;
}

function parseGameRecipe(outputId) {
  const block = new RegExp(
    `uniquename="${outputId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?<craftingrequirements([^>]*)>([\\s\\S]*?)</craftingrequirements>`,
  ).exec(xml);
  if (!block) return null;

  const [, attrs, body] = block;
  const focus = /craftingfocus="(\d+)"/.exec(attrs)?.[1];
  const amount = /amountcrafted="(\d+)"/.exec(attrs)?.[1] ?? "5";
  const materials = {};
  for (const m of body.matchAll(/uniquename="([^"]+)" count="(\d+)"/g)) {
    materials[m[1]] = Number(m[2]);
  }
  return {
    focus: Number(focus ?? 0),
    amount: Number(amount),
    materials,
  };
}

const recipes = parseOurRecipes(recipesSource);
let failed = false;

for (const recipe of recipes) {
  const game = parseGameRecipe(recipe.outputId);
  if (!game) {
    console.error(`FAIL ${recipe.outputId}: not found in items.xml`);
    failed = true;
    continue;
  }

  const issues = [];
  const warnings = [];
  if (recipe.focusCost !== game.focus) {
    warnings.push(`focus ours=${recipe.focusCost} game=${game.focus}`);
  }
  if (recipe.outputQuantity !== game.amount) {
    issues.push(`output qty ours=${recipe.outputQuantity} game=${game.amount}`);
  }

  for (const id of new Set([
    ...Object.keys(recipe.materials),
    ...Object.keys(game.materials),
  ])) {
    if (recipe.materials[id] !== game.materials[id]) {
      issues.push(
        `material ${id}: ours=${recipe.materials[id] ?? "missing"} game=${game.materials[id] ?? "missing"}`,
      );
    }
  }

  if (issues.length) {
    console.error(`FAIL ${recipe.outputId} (${recipe.id}):`);
    for (const issue of issues) console.error(`  - ${issue}`);
    failed = true;
  } else {
    console.log(`OK   ${recipe.outputId} (${recipe.id})`);
    for (const warning of warnings) console.warn(`  warn: ${warning}`);
  }
}

if (failed) process.exit(1);
console.log(`\nAll ${recipes.length} recipes match items.xml.`);
