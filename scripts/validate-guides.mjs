import { readFileSync } from "fs";

const src = readFileSync("src/data/guides.ts", "utf8");
const reliabilitySrc = readFileSync("src/data/guide-reliability.ts", "utf8");
const economicsSrc = readFileSync("src/data/guide-economics.ts", "utf8");
const loadoutsSrc = readFileSync("src/data/guide-loadouts.ts", "utf8");
const laborerSrc = readFileSync("src/data/laborer-specialties.ts", "utf8");
const houseCostSrc = readFileSync("src/data/t8-house-cost.ts", "utf8");
const blocks = src.split(/slug: "/).slice(1);

const requiredFields = [
  "title",
  "description",
  "category",
  "difficulty",
  "zoneType",
  "silverPerHour",
  "requirements",
  "steps",
  "tips",
  "profitBuild",
];

let failed = 0;

for (const block of blocks) {
  const slug = block.slice(0, block.indexOf('"'));

  for (const field of requiredFields) {
    if (!block.includes(`${field}:`)) {
      console.log(`FAIL ${slug} missing ${field}`);
      failed++;
    }
  }

  const gearSection = block.split("profitBuild:")[1] ?? "";
  if (!gearSection.includes("slots:") && !gearSection.includes("inventory:")) {
    console.log(`FAIL ${slug} profitBuild has no slots or inventory`);
    failed++;
  }
}

const itemIdPattern = /^T\d+_/;

const itemIds = [
  ...src.matchAll(/id: "([^"]+)"/g),
  ...economicsSrc.matchAll(/id: "([^"]+)"/g),
  ...loadoutsSrc.matchAll(/id: "([^"]+)"/g),
  ...laborerSrc.matchAll(/id: "([^"]+)"/g),
  ...houseCostSrc.matchAll(/id: "([^"]+)"/g),
]
  .map((m) => m[1])
  .filter((id) => itemIdPattern.test(id));
const uniqueIds = [...new Set(itemIds)];

for (const slug of blocks.map((b) => b.slice(0, b.indexOf('"')))) {
  if (!economicsSrc.includes(`"${slug}"`)) {
    console.log(`WARN ${slug} has no hourly economics config`);
  }
  if (!reliabilitySrc.includes(`"${slug}"`)) {
    console.log(`FAIL ${slug} missing reliability label`);
    failed++;
  }
}

for (const id of uniqueIds) {
  const encoded = id.includes(" ") ? encodeURIComponent(id) : id;
  const res = await fetch(
    `https://render.albiononline.com/v1/item/${encoded}.png?size=16`,
  );
  if (res.status !== 200) {
    console.log(`FAIL item icon ${id} (${res.status})`);
    failed++;
  }
}

if (failed === 0) {
  console.log(
    `All ${blocks.length} guides validated (${uniqueIds.length} item icons).`,
  );
} else {
  console.log(`${failed} validation error(s).`);
  process.exit(1);
}
