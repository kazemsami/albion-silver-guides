import type { Guide } from "@/types/guide";
import { attachGuideReliability } from "@/data/guide-reliability";

const rawGuides: Omit<Guide, "reliability">[] = [
  {
    slug: "t4-ore-mining-yellow-zone",
    title: "T4 Ore Mining in Yellow Zones",
    description:
      "Farm ~2,000 iron ore per hour in Martlock highland yellow zones, sell raw ore on the Martlock market, and fill a prospector journal for bonus silver. Knockdown-only PvP keeps this viable from day one.",
    category: "gathering",
    difficulty: "beginner",
    zoneType: "safe",
    silverPerHour: { min: 150_000, max: 350_000 },
    requirements: [
      "T4 pickaxe + T4 miner gear (cap, garb, workboots)",
      "Riding horse or giant stag for node-to-node travel",
      "Empty Adept Prospector's Journal in inventory",
      "Pork Pie (+15% yield, +30% carry weight), budget ~1 pie per hour",
    ],
    steps: [
      "Start in Martlock. Run the Haytor → Pennine Forest → Slimehag loop (T4-T5 yellow highland), only mine T4 Iron Ore nodes your pick can hit in one swing.",
      "Carry an empty T4 prospector journal; it fills passively while you mine. One full journal per hour is a realistic target at mid-tier gathering.",
      "Bank when carry weight hits ~80% (~2,000 ore per trip with pork pie). Do not refine. Sell raw T4 Iron Ore on the Martlock market (list 1 silver under the lowest sell order).",
      "After depositing, buy another Pork Pie and repeat the loop. Upgrade to T5 pick only when you can one-shot T5 Titanium nodes without slowing the route.",
      "Track profit as: (ore sold × price) + (full journal sold × price) - pork pie cost. Ignore refining unless steel bars are 20%+ more profitable after the 6.5% market tax.",
    ],
    tips: [
      "Iron ore is the money maker here, skip copper (T2) and tin (T3) nodes entirely; they waste time per silver.",
      "Martlock has the best local buy volume for raw ore; only haul to Caerleon if the price gap exceeds ~8% after transport time.",
      "Mine during EU off-peak if your zone is crowded, contested nodes cut ore/hour directly.",
      "If you die, you only lose your pork pie and partial stack. Yellow zones knock down; they do not loot your ore.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "T4 miner set for the Martlock highland loop. Pork Pie boosts yield and extends each trip to ~2,000 ore before banking.",
      slots: {
        head: {
          id: "T4_HEAD_GATHERER_ORE",
          name: "Adept's Miner Cap",
          hint: "Mining yield passive bonus",
        },
        armor: {
          id: "T4_ARMOR_GATHERER_ORE",
          name: "Adept's Miner Garb",
          hint: "Mining yield passive bonus",
        },
        shoes: {
          id: "T4_SHOES_GATHERER_ORE",
          name: "Adept's Miner Workboots",
          hint: "Yield bonus + reduced ore weight",
        },
        mainhand: {
          id: "T4_2H_TOOL_PICK",
          name: "Adept's Pickaxe",
          hint: "T4 pick mines up to iron (T4) ore",
        },
        mount: {
          id: "T4_MOUNT_HORSE",
          name: "Adept's Riding Horse",
          hint: "Fast travel between ore clusters",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          hint: "+15% gathering yield, +30% carry weight",
        },
      },
      inventory: [
        {
          id: "T4_JOURNAL_ORE_EMPTY",
          name: "Adept Prospector's Journal (Empty)",
          hint: "Optional: fill while mining for bonus silver",
        },
      ],
    },
    featured: true,
    readTime: 5,
  },
  {
    slug: "fiber-farming-solo",
    title: "Solo Fiber Farming Route",
    description:
      "Run a Thetford swamp loop for ~900 T5 skyflower and ~400 T4 hemp per hour with pork pie, sell raw fiber in Thetford, and fill cropper journals. This is one of the highest safe gathering silver/hour routes for solo players.",
    category: "gathering",
    difficulty: "beginner",
    zoneType: "safe",
    silverPerHour: { min: 200_000, max: 500_000 },
    requirements: [
      "T5 sickle + T5 harvester gear (cap, garb, workboots)",
      "Avalonian gathering cape (+gathering yield)",
      "Pork Pie (+15% yield, +30% carry weight) (~1 per hour",
      "Two empty Adept Cropper's Journals in inventory",
    ],
    steps: [
      "Base out of Thetford. Run Willowsigh Marsh → Dewleaf Fen → Meltwater Bog as a clockwise circle, swamp biomes respawn fiber fastest in this cluster.",
      "Harvest every T5 Skyflower node first, then T4 Hemp on the return leg. Skip lower tiers unless they sit directly on your path.",
      "Eat Pork Pie before starting; with cape + pie you should bank ~1,300 fiber per hour split between T4/T5.",
      "Fill two cropper journals per hour while gathering, sell full journals on the Thetford market alongside your fiber.",
      "Sell raw Skyflower and Hemp in Thetford (do not weave to cloth unless Sunflax Cloth sells for 15%+ more than raw fiber after tax and focus cost).",
      "Relist every 30 minutes during peak hours or undercut by 1 silver to move stacks before the next loop.",
    ],
    tips: [
      "Skyflower (T5) is ~70% of your silver, prioritize T5 nodes even if it means skipping a T4 cluster.",
      "Thetford is the fiber city; local sell orders move faster than hauling to Caerleon unless the spread exceeds 10%.",
      "Two journals = double the journal profit per hour for zero extra travel. Always carry two empties.",
      "Stay in yellow zones for knockdown safety, blue zones are not more profitable, just less punishing on death than red.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "T5 harvester set + Avalonian cape + Pork Pie for the Thetford swamp loop. Carry two cropper journals.",
      slots: {
        head: {
          id: "T5_HEAD_GATHERER_FIBER",
          name: "Expert's Harvester Cap",
          hint: "Fiber yield passive bonus",
        },
        armor: {
          id: "T5_ARMOR_GATHERER_FIBER",
          name: "Expert's Harvester Garb",
          hint: "Fiber yield passive bonus",
        },
        shoes: {
          id: "T5_SHOES_GATHERER_FIBER",
          name: "Expert's Harvester Workboots",
          hint: "Yield bonus + reduced fiber weight",
        },
        mainhand: {
          id: "T5_2H_TOOL_SICKLE",
          name: "Expert's Sickle",
          hint: "T5 sickle for hemp (T4) and skyflower (T5)",
        },
        cape: {
          id: "T4_CAPEITEM_AVALON",
          name: "Adept's Avalonian Cape",
          hint: "Gathering yield bonus",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "Fast mount with good carry weight",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          hint: "+15% gathering yield, +30% carry weight",
        },
      },
      inventory: [
        {
          id: "T4_JOURNAL_FIBER_EMPTY",
          name: "Adept Cropper's Journal (Empty)",
          hint: "Carry two: fill while gathering for extra income",
          quantity: 2,
        },
      ],
    },
    featured: true,
    readTime: 6,
  },
  {
    slug: "solo-dungeon-farming",
    title: "Solo Randomized Dungeon Farming",
    description:
      "Farm red-zone solo dungeons near Martlock for ~400 Master's Runes, ~120 souls, and leather per hour. Sell runes and souls on Caerleon; yellow zones are for learning, red zones are where the silver is.",
    category: "dungeons",
    difficulty: "intermediate",
    zoneType: "dangerous",
    silverPerHour: { min: 150_000, max: 800_000 },
    requirements: [
      "T6 Bloodletter + Scholar Cowl clear build (see gear below)",
      "Mutton Stew + healing/energy potions, budget 2 stew and 3 pots per hour",
      "Red-zone access near Martlock (e.g. Redtree Enclave, T6 red)",
      "No keys, solo entrances are free hidden world spawns",
    ],
    steps: [
      "Roam T6 red zones around Martlock for green-glowing solo entrances. Yellow T5 zones work for practice but pay roughly half the loot.",
      "Enter, clear trash in a circle back to the entrance, pull mobs into corridors so you never fight more than 3 at once.",
      "Activate Small Combat Shrines when you find them, each gives a random 1-minute buff (damage, sustain, or cooldown reduction) to the first player who clicks it.",
      "Loot every chest: Master's Runes and Souls are the main silver (sell on Caerleon). Grab silver bags and tomes but do not slow the run for green loot.",
      "Exit after the boss chest, aim for 4-5 full clears per hour. Bank in Martlock every 2 runs so a death does not wipe your stack.",
      "Sell runes in stacks of 100+ on Caerleon during EU prime. Souls can be sold raw or saved for your own crafting; check which pays more today.",
    ],
    tips: [
      "Bloodletter E → Q → W rotation with Scholar Cowl energy refund is the standard speed-clear, practice the rotation until trash dies in under 8 seconds.",
      "Red zone deaths are full loot. Never carry more than 2 runs of loot on you. Bank is free insurance.",
      "Dungeon tier = zone tier. T6 red near Martlock is the sweet spot for T6 rune income without black-zone risk.",
      "Skip dungeons with other players inside, shared loot cuts your runes/hour in half.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "T6 Bloodletter + Scholar Cowl for 4-5 red-zone solo clears per hour. Budget stew and pots per run.",
      slots: {
        head: {
          id: "T4_HEAD_CLOTH_SET1",
          name: "Adept's Scholar Cowl",
          hint: "Energy regeneration on every spell cast",
        },
        armor: {
          id: "T6_ARMOR_LEATHER_SET1",
          name: "Master's Mercenary Jacket",
          hint: "Strong damage and defensive option",
        },
        shoes: {
          id: "T6_SHOES_PLATE_SET1",
          name: "Master's Soldier Boots",
          hint: "Gap close or defensive boot skill",
        },
        mainhand: {
          id: "T6_MAIN_RAPIER_MORGANA",
          name: "Master's Bloodletter",
          hint: "Lifesteal sustain + mobility dashes",
        },
        cape: {
          id: "T4_CAPEITEM_FW_THETFORD",
          name: "Adept's Thetford Cape",
          hint: "Vanisher: emergency invis when taking burst damage",
        },
        food: {
          id: "T6_MEAL_STEW",
          name: "Mutton Stew",
          hint: "+damage to speed up clears",
        },
        potion: {
          id: "T6_POTION_HEAL",
          name: "Major Healing Potion",
          hint: "Emergency heal between pulls",
        },
      },
      inventory: [
        {
          id: "T6_POTION_ENERGY",
          name: "Major Energy Potion",
          hint: "Restore ability energy during long clears",
        },
      ],
    },
    featured: false,
    readTime: 7,
  },
  {
    slug: "corrupted-dungeons-pvpve",
    title: "Corrupted Dungeons for PvPvE Profit",
    description:
      "Run Stalker corrupted dungeons in red zones for Grandmaster's Souls, Elder's Souls, and runes worth 1M-3M/hr at a 60%+ win rate. Hunter in yellow to learn; Stalker in red for real profit.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 1_000_000, max: 3_000_000 },
    requirements: [
      "T6 Claymore burst build or equivalent 1v1 PvP setup",
      "Hunter (yellow/blue, knockdown) to learn; Stalker (red/black, full loot) for profit; Slayer needs 100k+ infamy",
      "Mutton Stew, healing pots, invisibility pots, budget per hour in calculator",
      "Know invasion rules: fight, banish via shards, or reset with invis, you cannot fast-extract until the final boss is dead",
    ],
    steps: [
      "Find a Corrupted Dungeon entrance in the open world (sinister solo portal) or use a corrupted map from the market.",
      "At the entrance, choose Hunter (yellow/blue), Stalker (red/black), or Slayer (red/black, 100k+ infamy). Learn in Hunter until you clear reliably.",
      "Optional: click the Demonic Shrine within 45 seconds if you want to sign up as an invader. Skipping it slightly lowers invasion odds.",
      "Clear mobs for infamy until the final boss spawns. Loot Grandmaster's Souls and Elder's Souls from the chest; they are most of the run's value.",
      "When invaded before the boss: duel if you have the advantage, or destroy three Demonic Shards (they appear on your minimap) to banish the invader for free. Killing the invader also ends further invasions for that run.",
      "After the final boss dies, invasions stop. Exit normally or chain through the post-boss portal. Bank after each chest. Stalker deaths are full loot.",
      "Sell souls and runes on Caerleon. List 1 silver under the lowest sell order during prime hours.",
    ],
    tips: [
      "Stalker pays much more than Hunter but is full-loot PvP, only run it when your invasion win rate is solid.",
      "Demonic Shards are breakable objects that spawn on invasion. Destroy three to eject the invader. They cost no silver; that is the intended banish mechanic.",
      "You can be invaded even if you skip the entrance shrine. Signing the contract only affects your chance to become the invader.",
      "Healing is reduced 40% in Corrupted Dungeons, burst and shard-banish plays often beat trying to out-heal a geared invader.",
      "Slayer is for high-infamy veterans; higher IP cap and T8 mobs, but death risk dwarfs the extra loot for most farmers.",
      "Never chain runs with a full inventory. One death loses the chest and your kit on Stalker/Slayer.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "T6 Claymore burst for Stalker corrupted 1v1s. Invis pot to disengage and save the boss chest.",
      slots: {
        head: {
          id: "T6_HEAD_PLATE_SET1",
          name: "Master's Soldier Helmet",
          hint: "Emergency shield or defensive option",
        },
        armor: {
          id: "T6_ARMOR_LEATHER_SET1",
          name: "Master's Mercenary Jacket",
          hint: "Strong damage + defensive cooldown",
        },
        shoes: {
          id: "T6_SHOES_PLATE_SET1",
          name: "Master's Soldier Boots",
          hint: "Gap close to finish or escape fights",
        },
        mainhand: {
          id: "T6_2H_CLAYMORE",
          name: "Master's Claymore",
          hint: "High burst for 1v1 corrupted fights",
        },
        cape: {
          id: "T4_CAPEITEM_FW_THETFORD",
          name: "Adept's Thetford Cape",
          hint: "Failsafe invis when HP drops low",
        },
        food: {
          id: "T6_MEAL_STEW",
          name: "Mutton Stew",
          hint: "+damage for faster mob clears",
        },
        potion: {
          id: "T6_POTION_HEAL",
          name: "Major Healing Potion",
          hint: "Sustain during PvP exchanges",
        },
      },
      inventory: [
        {
          id: "T6_POTION_ENERGY",
          name: "Major Energy Potion",
          hint: "Restore ability energy during fights",
        },
        {
          id: "T8_POTION_CLEANSE",
          name: "Invisibility Potion",
          hint: "Disengage and reset bad fights",
        },
      ],
    },
    featured: false,
    readTime: 9,
  },
  {
    slug: "t2-blackzone-roaming",
    title: "T2 Black Zone Roaming for Silver",
    description:
      "Roam lethal zones in a dirt-cheap T2 kit: fish schools between fights, fill fisher and trophy journals, grab luxury treasures, clear camps, and gank when it is free. Community verified at ~750k–1.2M/hr (11.5M over ~10–15 hr of play).",
    category: "dungeons",
    difficulty: "intermediate",
    zoneType: "dangerous",
    silverPerHour: { min: 500_000, max: 1_200_000 },
    requirements: [
      "T2 Soldier plate + Fire Staff & Shield (~540 IP) plus T4 fishing rod and bait — deaths cost almost nothing",
      "Empty Adept Fisherman's Journal and a generalist trophy journal in your bag",
      "Basic 1v1 PvP and when to skip a fight; invis pots for banking and escapes",
      "Goat Stew or regen soup, Minor Resistance Potions, and fancy fish bait for fishing stretches",
      "Empty inventory before entering; bank filled journals, treasures, and kill loot often",
    ],
    steps: [
      "Travel to a black zone, red zone, or Mists portal from royals. Leave with an empty bag, T2 combat kit, T4 rod, bait, and empty journals.",
      "Default loop: fish schools while moving between camps and chest timers. Swap to the rod only at the school; keep Fire Staff, shield, and mule equipped while traveling.",
      "Filled fisher journals and generalist trophy journals are a large share of the payout — bank stacks whenever you extract, not just at session end.",
      "Between casts, check the map for medium/large chests, faction camps, and solo gatherers. T2 gear looks harmless — take free ganks when IP is in your favor.",
      "Luxury treasures (crowns, masks, harps, candelabras) come from fishing treasure rolls and chests — sell on Caerleon, they add up fast over a multi-day haul.",
      "Clear open-world camps for silver bags, runes, souls, and relics. Chain camps when the zone is quiet and PvP is dry.",
      "Use invisibility pots to disengage bad fights or extract with a full journal stack. A cheap T2 death is fine; losing a bag of filled journals is not.",
      "Rotate zones when population spikes. Steady ~5 hr/day sessions over 2–3 days matched the verified 11.5M sample better than one marathon binge.",
      "Sell tradable loot on Caerleon. Open silver bags immediately; list gear, runes, souls, and treasures in sensible stack sizes.",
    ],
    tips: [
      "Verified haul breakdown (~11.5M over ~10–15 hr): huge stacks of filled fisher + trophy journals, luxury fishing treasures, runes/souls/relics, mixed PvP gear, and tomes — not pure gank silver.",
      "T2 roaming works because gear loss is negligible. Fish and fill journals during downtime; gank only when the fight is clearly yours.",
      "Community-checked average: ~750k–1.2M/hr (11.5M ÷ 10–15 hr). Bad days and deaths pull that down; treasure-heavy fishing sessions can beat it.",
      "Generalist trophy journals fill from any fame — fishing, camps, and even gank kills all progress them passively.",
      "Bank after every good kill or when journals are full. One gank can be 500k–2M+ in gear; a full journal tab can be millions over several days.",
      "Popularized by Stalker313's T2 black zone series — low IP bait, mixed open-world income, not a single-trick gank build.",
    ],
    references: [
      {
        title: "Stalker313 — A Profitable Way to Get Silver Using T2 Gear",
        url: "https://www.youtube.com/watch?v=nf9mvEbVqsI",
      },
    ],
    profitBuild: {
      title: "T2 Roam + Fish Kit",
      description:
        "Novice Soldier plate + Fire Staff & Shield for fights (~540 IP). T4 rod, bait, and empty journals for the fishing loop.",
      slots: {
        head: {
          id: "T2_HEAD_PLATE_SET1",
          name: "Novice's Soldier Helmet",
          hint: "Cheap plate, minimal IP",
        },
        armor: {
          id: "T2_ARMOR_PLATE_SET1",
          name: "Novice's Soldier Armor",
          hint: "Tankier than leather on a budget",
        },
        shoes: {
          id: "T2_SHOES_PLATE_SET1",
          name: "Novice's Soldier Boots",
          hint: "Mobility + basic defense",
        },
        mainhand: {
          id: "T2_MAIN_FIRESTAFF",
          name: "Novice's Fire Staff",
          hint: "1H fire for opportunistic ganks",
        },
        offhand: {
          id: "T2_OFF_SHIELD",
          name: "Novice's Shield",
          hint: "Extra survivability in open world",
        },
        cape: {
          id: "T2_CAPE",
          name: "Novice's Cape",
          hint: "Cheap cape slot",
        },
        bag: {
          id: "T2_BAG",
          name: "Novice's Bag",
          hint: "Carry journals and loot",
        },
        mount: {
          id: "T2_MOUNT_MULE",
          name: "Novice's Mule",
          hint: "Cheap carry weight for extracts",
        },
        potion: {
          id: "T3_POTION_STONESKIN",
          name: "Minor Resistance Potion",
          hint: "CC resist + defense in fights",
          quantity: 2,
        },
      },
      inventory: [
        {
          id: "T4_MEAL_STEW",
          name: "Goat Stew",
          hint: "Food buff between fights",
          quantity: 2,
        },
        {
          id: "T4_2H_TOOL_FISHINGROD",
          name: "Adept's Fishing Rod",
          hint: "Swap in at schools only",
        },
        {
          id: "T3_FISHINGBAIT",
          name: "Fancy Fish Bait",
          hint: "Fish between camps and chests",
        },
        {
          id: "T4_JOURNAL_FISHING_EMPTY",
          name: "Adept Fisherman's Journal (Empty)",
          hint: "Fills while fishing — major income",
        },
        {
          id: "T4_JOURNAL_TROPHY_GENERAL_EMPTY",
          name: "Adept Generalist Trophy Journal (Empty)",
          hint: "Fills on any fame (fish, camps, kills)",
        },
        {
          id: "T8_POTION_CLEANSE",
          name: "Invisibility Potion",
          hint: "Extract with journal stacks",
        },
        {
          id: "T4_POTION_ENERGY",
          name: "Energy Potion",
          hint: "Extra ability uptime in PvP",
        },
      ],
    },
    featured: false,
    readTime: 8,
  },
  {
    slug: "abyssal-depths-farming",
    title: "Abyssal Depths Silver Farming",
    description:
      "Run The Depths from any royal city's Antiquarian's Den — orange-zone PvE/PvP with collapsing floors, souls, and stacking buffs. Duo or trio is best for consistent wins; solo PvE floor-2 extracts still pay ~800k–1.5M/hr. Gear stays equipped on death; only bag loot is at risk.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 800_000, max: 2_500_000 },
    requirements: [
      "Antiquarian's Den in any royal city or Caerleon — enter unflagged, bank everything in the shared Den bank",
      "Queue duo or trio with a full team when possible; solo works for PvE but is handicapped in PvP",
      "~1200 Item Power softcap (only 20% of stats above 1200 count; Fame Bonus is not reduced)",
      "Empty inventory before entry — equipped gear locks inside; only consumables can technically be swapped mid-run",
      "PvP ability builds ready before entry; swap spells between fights when you have time to inspect enemies",
      "Cheap mount with strong carry weight (riding boar, ox, or stag) for extract loot",
      "Food, healing pots, and extra consumables for ~45 min runs",
    ],
    steps: [
      "Enter the Antiquarian's Den from the map portal, bank all items, and queue at The Depths gateway. Match your queue size to your group — duo in duo, trio in trio.",
      "Orange zone rules apply: death drops inventory only, not equipped gear. Enter with an empty bag and the loadout you will fight with.",
      "Floor 1 uses T6 mobs. Clear statue rooms to spawn a loot chest or one of three buffs: Dominion (slow), Cruelty (resistance shred), or Wrath (burst damage + healing when dealing direct damage below 40% HP).",
      "Each buff your team picks up adds one stack of Demonic Ferocity party-wide (+2% PvP damage and +1% PvP defense per stack, max 15). Aim for 15 stacks on floor 1 before descending — low stacks mean reset and extract instead of pushing.",
      "Souls drop from player deaths always, and rarely from mobs. Red = enemy, blue = ally, white = mob or a player who released. Blue souls revive teammates at the Altar of Awakening; any soul works at an upward exit or the Altar of Greed.",
      "Sacrifice enemy red souls at the Altar of Greed when they are still downed — that removes them from the run and pays a chest. Kidnap red souls mid-fight so enemies cannot revive. Fully loot greed chests immediately so you can chain soul turn-ins.",
      "After ~10–15 minutes, floor 1 collapses — hellfire damage ramps if you linger. Upward exits to the Den and downward stairs to floor 2 spawn across the map. Hover exit icons to read the timer.",
      "If buff stacks are low, a teammate is down, or your bag already holds good loot — take an exit and secure profit. Floor 2 (T7 mobs, better rewards) repeats the same loop.",
      "Floor 3 (T8 mobs) spawns contested vault keys (3 in duo, 5 in trio) and a central Treasure Vault. Opening the vault spawns a channeled escape portal. When floor 3 collapses there are no Den exits — leave via soul exit or the vault portal.",
      "Player kills and altar souls are a major loot source — take PvP fights when stacked and geared. Sell tradable chest loot on Caerleon; open silver bags in your bag (they do not drop on death).",
    ],
    tips: [
      "1200 IP is the efficient sweet spot — do not overspend on 8.4 for marginal gains. A .4 weapon keeps full Fame Bonus if you are leveling specs safely here.",
      "Run PvP abilities even while clearing mobs. If you get jumped mid-pull, there is no time to respec.",
      "Never fight without an active room buff if the enemy has one — buffs only proc below 40% HP but are the main edge beyond gear.",
      "Solo PvE: Astral Staff + Cleric Robe or Great Axe for AoE room clears; extract floor 2 for ~1M/hr from silver bags + chests even with bad RNG (see reference video).",
      "Reset early when stacks are below ~10, inventory is full, or you are outnumbered. The Depths pays well enough that safe extracts beat greedy floor-3 throws.",
      "Floor 3 is stacked and sweaty — only push when your team hit 15 stacks early and you are ready for key fights. Vault loot is high variance.",
      "Optional: empty T8 mercenary journals on floor 3 T8 mobs (~300k per 15 filled) — inventory risk only.",
    ],
    references: [
      {
        title: "Leyvi — The Depths Explained (PvP, Buffs & Souls)",
        url: "https://www.youtube.com/watch?v=DT-SNiJZemI",
      },
      {
        title: "Swole Benji — Solo Abyssal Depths Guide",
        url: "https://www.youtube.com/watch?v=Wc9b9Yv0DQc",
      },
    ],
    profitBuild: {
      title: "1200 IP Duo / Solo Farm",
      description:
        "~1200 IP kit under the softcap. Astral Staff for solo AoE clears; swap to your duo PvP comp when grouped. Empty bag, cheap carry mount.",
      slots: {
        head: {
          id: "T6_HEAD_LEATHER_SET3",
          name: "Master's Assassin Hood",
          hint: "Burst / defense near 1200 IP",
        },
        armor: {
          id: "T6_ARMOR_CLOTH_SET2",
          name: "Master's Cleric Robe",
          hint: "Armor ability for big pulls",
        },
        shoes: {
          id: "T6_SHOES_PLATE_SET2",
          name: "Master's Royal Sandals",
          hint: "Mobility between rooms",
        },
        mainhand: {
          id: "T6_2H_HOLYSTAFF@4",
          name: "Master's Astral Staff (.4)",
          hint: "AoE clear + full Fame Bonus on .4",
        },
        cape: {
          id: "T4_CAPEITEM_FW_CAERLEON",
          name: "Adept's Caerleon Cape",
          hint: "Defense without overshooting softcap",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "Cheap high carry weight for extracts",
        },
        bag: {
          id: "T5_BAG",
          name: "Expert's Bag",
          hint: "Empty at entry — fill with extract loot only",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          hint: "Bring extra for 45-min runs",
        },
        potion: {
          id: "T6_POTION_HEAL",
          name: "Major Healing Potion",
          hint: "Sustain between pulls and PvP",
        },
      },
      inventory: [
        {
          id: "T7_POTION_REVIVE",
          name: "Major Gigantify Potion",
          hint: "Burst tough rooms",
        },
        {
          id: "T8_JOURNAL_MERCENARY_EMPTY",
          name: "Elder's Mercenary Journal (Empty)",
          hint: "Optional floor-3 fill (~300k per 15)",
        },
      ],
    },
    featured: true,
    readTime: 13,
  },
  {
    slug: "high-tier-group-tracking",
    title: "High-Tier Group Tracking for Silver",
    description:
      "Run 5-man veteran tracking in red zones or Roads of Avalon for T7 Golem and T8 Dawnbird hunts. Shapeshifter artifacts, potion essences, and Rare Animal Remains sell for ~2M-5M/hr per player at a steady group pace.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 2_000_000, max: 5_000_000 },
    requirements: [
      "Party of 4-8 for veteran targets (5 players is the sweet spot)",
      "One tracker with a T7 Tracking Toolkit, tracks T7 Golem and T8 Dawnbird (toolkit tier +1)",
      "Tracking Mastery + target specialization (Golem before pushing Dawnbird veteran tracks)",
      "Tank, healer, and 2-3 DPS, full-loot PvP gear for red/black zones or Roads",
      "Beef Sandwich. Major Healing Potions, Major Gigantify, budget per hour in calculator",
    ],
    steps: [
      "Form a fixed 5-man group: 1 tracker (starts hunts), 1 tank (Incubus Mace + Guardian), 1 healer (Fallen Staff), 2 DPS (Wildfire Staff or Crystal Reaper). Share voice comms, track study and engage timing matter.",
      "Base in a red-zone royal city or Roads hub. The tracker equips a T7 Tracking Toolkit and uses it in a lethal zone to reveal tracks in a large radius.",
      "Study tracks with the toolkit in inventory. Clear any guard mobs before studying. Party members can study together to shorten the timer, veteran tracks require 4-8 players in party.",
      "Follow the highlighted region on the map through each hunt step. Deal enough damage before the hidden flee timer or the target escapes to the next zone. HP carries between steps.",
      "Farm T7 Runestone Golem veteran hunts as your baseline (~4-6 kills/hr when routes are clean). Each kill drops Grandmaster's Golem Remnant, Rare Animal Remains, and a chance of Grandmaster's Essence.",
      "When the group clears Golems reliably, study T8 Dawnbird tracks instead, same T7 toolkit (tier +1 rule). Each Dawnbird kill drops Elder's Dawnbird Remnant and Elder's Essence; it is a separate hunt, not loot from Golem.",
      "Bank after every successful kill, artifacts and essences are your payout. In red zones, loot is protected for your party only if you engaged the target in combat; PvP-flagged players can still contest drops.",
      "Sell Shapeshifter remnants and essences on Caerleon. List Rare Animal Remains in stacks of 100, crafters buy them for Arcane Extracts and war pots.",
    ],
    tips: [
      "Veteran targets (T7 Golem, T8 Dawnbird) need a 4-8 player party. Solo or duo tracking is for learning T4-T6 targets only.",
      "A T7 toolkit covers both your main farm targets: T7 Golem natively and T8 Dawnbird via the tier +1 rule. You do not need a T8 toolkit for Dawnbird.",
      "Too many players near the engagement zone, even outside it, can spook the target. Keep scouts minimal during the fight.",
      "De-aggroing resets the target's HP for the current hunt step, don't reset progress with bad pulls.",
      "Rare Quarries (Earthdaughter. Harvester of Souls, Shadowmask) drop Black Market loot and faction mount upgrades, worth a detour when tracks appear.",
      "Dawnbird pays more per kill but hunts run longer, budget 2-3M/hr on Golem, 3.5-5M/hr when the group pivots to Dawnbird.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "Standard 5-man DPS slot (Wildfire Staff). Tracker carries the toolkit in inventory; tank and healer use the tier loadouts below.",
      slots: {
        head: {
          id: "T7_HEAD_LEATHER_SET1",
          name: "Grandmaster's Mercenary Hood",
          hint: "Burst DPS for Golem/Dawnbird phases",
        },
        armor: {
          id: "T7_ARMOR_LEATHER_SET1",
          name: "Grandmaster's Mercenary Jacket",
          hint: "Damage + defensive cooldown",
        },
        shoes: {
          id: "T7_SHOES_LEATHER_SET3",
          name: "Grandmaster's Stalker Shoes",
          hint: "Reposition during hunt steps",
        },
        mainhand: {
          id: "T7_2H_FIRESTAFF",
          name: "Grandmaster's Wildfire Staff",
          hint: "Sustained AoE on veteran targets",
        },
        cape: {
          id: "T4_CAPEITEM_FW_FORTSTERLING",
          name: "Adept's Fort Sterling Cape",
          hint: "CC reduction for long fights",
        },
        food: {
          id: "T6_MEAL_SANDWICH",
          name: "Beef Sandwich",
          hint: "+defense and sustain for red-zone hunts",
        },
        potion: {
          id: "T6_POTION_HEAL",
          name: "Major Healing Potion",
          hint: "Sustain through multi-step hunts",
        },
      },
      inventory: [
        {
          id: "T7_2H_TOOL_TRACKING",
          name: "Grandmaster's Tracking Toolkit",
          hint: "Tracker only: starts T7/T8 veteran hunts",
        },
        {
          id: "T7_POTION_REVIVE",
          name: "Major Gigantify Potion",
          hint: "Burst damage on engage windows",
        },
        {
          id: "T8_POTION_CLEANSE",
          name: "Invisibility Potion",
          hint: "Disengage gankers while banking loot",
        },
      ],
    },
    featured: true,
    readTime: 10,
  },
  {
    slug: "shoreline-fishing-guide",
    title: "Shoreline Fishing for Passive Silver",
    description:
      "Fish schools along the Bridgewatch east coast with T3 bait, chop catches into fish at the butcher, and sell ~280 chopped fish per hour on the Bridgewatch market. Low gear cost, ideal for alts.",
    category: "fishing",
    difficulty: "beginner",
    zoneType: "safe",
    silverPerHour: { min: 80_000, max: 250_000 },
    requirements: [
      "T3+ fishing rod (T4 rod at fishing level 20+)",
      "T3 Fancy Fish Bait (~12 per hour",
      "Goat Stew for carry weight",
      "Butcher station access in Bridgewatch",
    ],
    steps: [
      "Start in Bridgewatch. Ride east to Eswold Inlet and the southern coastline, fish schools respawn along this shore every few minutes.",
      "Equip T3 bait before every cast. Only cast on visible fish schools (bubbles in the water), open-water casting wastes bait.",
      "Keep a weapon, cape, bag, and mount equipped while riding between spots, store the fishing rod in your bag and swap to it only at the school.",
      "Play the minigame for perfect catches; each perfect adds ~10% more fish per hour.",
      "When inventory is full (~280 fish worth of catches), return to Bridgewatch butcher. Chop all fish into Chopped Fish, this almost always sells better than raw fish for shoreline tiers.",
      "List chopped fish on the Bridgewatch market in stacks of 100. Sell seaweed too (byproduct, ~90/hr); it adds 5-10% extra silver.",
      "Buy more bait and stew, repeat. At fishing level 40+, upgrade rod to T4 and move toward Mists fishing for 3× income.",
    ],
    tips: [
      "Chopped fish is the product you sell, not raw fish. Always butcher before listing.",
      "Bridgewatch has the best local demand for low-tier fish products; hauling to Caerleon rarely beats the travel time.",
      "Schools are contested during peak hours, fish 06:00-10:00 UTC for empty shores.",
      "Never ride with the rod equipped. Bloodletter. Thetford cape, bag, and riding horse let you fight back or flee if someone dives you.",
      "This is a stepping stone: at fishing 10+ switch to yellow Mists for 600k+/hr.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "Rod in bag: equip Bloodletter. Thetford cape, bag, and a riding horse while traveling. Swap to the rod only at a school.",
      slots: {
        mainhand: {
          id: "T4_MAIN_RAPIER_MORGANA",
          name: "Adept's Bloodletter",
          hint: "Fight back or escape if dismounted",
        },
        cape: {
          id: "T4_CAPEITEM_FW_THETFORD",
          name: "Adept's Thetford Cape",
          hint: "Vanisher invis when HP drops low",
        },
        bag: {
          id: "T4_BAG",
          name: "Adept's Bag",
          hint: "Carry fish: rod stays in bag until you cast",
        },
        mount: {
          id: "T4_MOUNT_HORSE",
          name: "Adept's Riding Horse",
          hint: "Travel between shoreline spots",
        },
        food: {
          id: "T4_MEAL_STEW",
          name: "Goat Stew",
          hint: "+carry weight for more fish per trip",
        },
      },
      inventory: [
        {
          id: "T3_2H_TOOL_FISHINGROD",
          name: "Journeyman's Fishing Rod",
          hint: "Equip at the school only: upgrade to T4+ as level grows",
        },
        {
          id: "T3_FISHINGBAIT",
          name: "Fancy Fish Bait",
          hint: "T3 bait: best silver-to-bite ratio",
        },
        {
          id: "T4_JOURNAL_FISHING_EMPTY",
          name: "Adept Fisherman's Journal (Empty)",
          hint: "Optional bonus silver when filled",
        },
      ],
    },
    featured: false,
    readTime: 5,
  },
  {
    slug: "mists-fishing",
    title: "Yellow Zone Mists Fishing",
    description:
      "Fish in yellow-zone Mists for some of the best fishing income in Albion. Knockdown-only PvP keeps risk low while earnings scale heavily with your fishing level; level 60+ anglers can pull in around 1M silver per hour.",
    category: "fishing",
    difficulty: "intermediate",
    zoneType: "safe",
    silverPerHour: { min: 600_000, max: 1_000_000 },
    silverByLevel: [
      { label: "Fishing Level 10-30", amount: 600_000 },
      { label: "Fishing Level 30-60", amount: 900_000 },
      { label: "Fishing Level 60+", amount: 1_000_000 },
    ],
    requirements: [
      "Fishing level 10+ (higher levels earn significantly more)",
      "Your best fisherman gear for your level — yellow Mists are knockdown-only, so wear top-tier kit",
      "Best fishing rod in your bag — you can cast without equipping it",
      "T3 Fancy Fish Bait at schools for faster bites",
      "Grandmaster fisherman's journal for bonus silver while fishing",
      "Pork Pie ×2 per hour (+15% yield, +30% carry weight) at fishing level 60+",
      "Best bag and mount you have — no need to bring cheap escape gear",
      "Comfortable navigating Mist portals and exit timers",
    ],
    steps: [
      "Enter the Mists through a portal in a royal city or outpost.",
      "Locate active fish schools near water. Use T3 Fancy Fish Bait at schools, bait is optional but strongly recommended for faster bites and more casts per hour.",
      "Wear your best fisherman set, cape, bag, and mount. Keep the fishing rod in your bag — cast at schools without equipping it.",
      "At fishing level 30+, seek T7 yellow Mist zones for a chance at rare Puremist Snapper.",
      "Fish schools matching your rod tier for the best catch rate.",
      "Sell raw fish, chopped fish, or rare catches on the market. Check Caerleon for premium prices.",
    ],
    tips: [
      "Income scales sharply with fishing level: ~600k/hr at 10-30, ~900k/hr at 30-60, and ~1M/hr at 60+.",
      "From fishing level 30+, T7 yellow Mist zones can spawn Puremist Snapper, a valuable rare fish worth hunting.",
      "Fish during off-peak hours to avoid competition for schools and portal camps.",
      "Yellow-zone Mists are knockdown-only — bring your best gear for max yield, not a budget PvP setup.",
      "An Avalonian gathering cape and pork pie (+15% yield) stack well with high-level fishing for extra throughput.",
      "The rod can stay in your bag the whole run — Albion lets you fish without equipping it.",
    ],
    references: [
      {
        title: "GremmyAngler — Beginner's Fishing Guide (Zero to Hero, Part 1)",
        url: "https://www.youtube.com/watch?v=oTcuphnd1io",
      },
      {
        title: "Reddit — Mists fishing tips (r/albiononline)",
        url: "https://www.reddit.com/r/albiononline/comments/1qgyrag/comment/o0iiku1/",
      },
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "Best fisherman set for your level plus top bag, mount, and Avalonian cape. Safe yellow Mists — no cheap kit needed.",
      slots: {
        head: {
          id: "T8_HEAD_GATHERER_FISH",
          name: "Elder's Fisherman Cap",
          hint: "Best fisherman head for max yield",
        },
        armor: {
          id: "T8_ARMOR_GATHERER_FISH",
          name: "Elder's Fisherman Garb",
          hint: "Best fishing yield",
        },
        shoes: {
          id: "T8_SHOES_GATHERER_FISH",
          name: "Elder's Fisherman Workboots",
          hint: "Max yield + lowest fish weight",
        },
        cape: {
          id: "T4_CAPEITEM_AVALON",
          name: "Adept's Avalonian Cape",
          hint: "Gathering yield bonus",
        },
        bag: {
          id: "T8_BAG",
          name: "Elder's Bag",
          hint: "Best bag — more fish per trip",
        },
        mount: {
          id: "T8_MOUNT_OX",
          name: "Elder's Transport Ox",
          hint: "Best carry weight mount",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          quantity: 2,
          hint: "+15% fishing yield, +30% carry weight: eat 2 per hour",
        },
      },
      inventory: [
        {
          id: "T8_2H_TOOL_FISHINGROD",
          name: "Elder's Fishing Rod",
          hint: "Stays in bag — cast without equipping",
        },
        {
          id: "T3_FISHINGBAIT",
          name: "Fancy Fish Bait",
          hint: "Use at every school for faster bites",
        },
        {
          id: "T7_JOURNAL_FISHING_EMPTY",
          name: "Grandmaster Fisherman's Journal (Empty)",
          hint: "Fills while fishing: sell full journal for bonus silver",
        },
        {
          id: "T1_MEAL_SEAWEEDSALAD",
          name: "Seaweed Salad",
          hint: "Optional (+fishing speed for fame grinding",
        },
      ],
    },
    featured: true,
    readTime: 7,
  },
  {
    slug: "ava-roads-fishing",
    title: "Avalonian Roads Fishing (T8)",
    description:
      "Fish T8 schools on Avalonian Roads for top-tier silver income. Expect ~2M+/hr with T7 gear on a T8 road map, ~2.5-3.5M with full T8 fisherman gear, and 4-5M+ at max specs when Puremist Snapper pools show up. Use the profit calculator tabs to compare setups.",
    category: "fishing",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 2_000_000, max: 5_000_000 },
    silverByLevel: [
      { label: "Safe escape build", amount: 1_450_000 },
      { label: "T7 gear + pork pie (middle spec)", min: 1_800_000, max: 3_500_000 },
      { label: "T8 gear + pork pie", min: 2_500_000, max: 4_000_000 },
      { label: "T8 max spec (deep roads)", min: 3_800_000, max: 5_000_000 },
    ],
    safeBuild: {
      title: "Safe Escape Build",
      description:
        "Skip fishing garb and boots: wear a Grandmaster fisherman cap, eat 2 Pork Pies per hour, and keep rod and journal in your bag. Roads of Avalon are full-loot black zones; this build helps you remount and escape gankers.",
      slots: {
        head: {
          id: "T7_HEAD_GATHERER_FISH",
          name: "Grandmaster's Fisherman Cap",
          hint: "Fishing yield bonus: cheap upgrade over no head slot",
        },
        mainhand: {
          id: "T4_MAIN_RAPIER_MORGANA",
          name: "Adept's Bloodletter",
          hint: "Stay equipped while mounted: rod stays in bag until you cast",
        },
        armor: {
          id: "T4_ARMOR_LEATHER_SET3",
          name: "Adept's Assassin Jacket",
          hint: "Ambush invisibility to break aggro and juke",
        },
        shoes: {
          id: "T4_SHOES_GATHERER_ORE",
          name: "Adept's Miner Workboots",
          hint: "Flee (120% speed burst for 10s",
        },
        bag: {
          id: "T4_BAG",
          name: "Adept's Bag",
          hint: "+151 kg carry capacity on mount",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          quantity: 2,
          hint: "+15% gathering yield, +30% carry weight, 2 per hour",
        },
        mount: {
          id: "T3_MOUNT_HORSE",
          name: "Journeyman's Riding Horse",
          hint: "Cheap T3 horse: low replacement cost",
        },
      },
      inventory: [
        {
          id: "T7_2H_TOOL_FISHINGROD",
          name: "Grandmaster's Fishing Rod",
          hint: "Equip at T8 schools only: keep in bag while traveling",
        },
        {
          id: "T3_FISHINGBAIT",
          name: "Fancy Fish Bait",
          hint: "T3 bait: best silver-to-bite ratio",
        },
        {
          id: "T7_JOURNAL_FISHING_EMPTY",
          name: "Grandmaster Fisherman's Journal (Empty)",
          hint: "Fill while fishing: bonus silver when sold full",
        },
      ],
    },
    profitBuild: {
      title: "Max Profit Fishing Gear",
      description:
        "Full T8 fisherman set with pork pie. Rod in bag: Bloodletter. Thetford cape, bag, and Giant Stag equipped between schools.",
      slots: {
        head: {
          id: "T8_HEAD_GATHERER_FISH",
          name: "Elder's Fisherman Cap",
          hint: "Fishing yield passive bonus",
        },
        armor: {
          id: "T8_ARMOR_GATHERER_FISH",
          name: "Elder's Fisherman Garb",
          hint: "Fishing yield passive bonus",
        },
        shoes: {
          id: "T8_SHOES_GATHERER_FISH",
          name: "Elder's Fisherman Workboots",
          hint: "Fishing yield + weight reduction",
        },
        mainhand: {
          id: "T4_MAIN_RAPIER_MORGANA",
          name: "Adept's Bloodletter",
          hint: "Fight back or escape if dismounted on roads",
        },
        cape: {
          id: "T4_CAPEITEM_FW_THETFORD",
          name: "Adept's Thetford Cape",
          hint: "Vanisher: auto-invis when low HP",
        },
        bag: {
          id: "T5_BAG",
          name: "Expert's Bag",
          hint: "Carry Sturgeon stacks: rod stays in bag until you cast",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          quantity: 2,
          hint: "+15% gathering yield, +30% carry weight, 2 per hour",
        },
        potion: {
          id: "T8_POTION_CLEANSE",
          name: "Invisibility Potion",
          hint: "Essential escape consumable",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "High carry weight for Sturgeon hauls between schools",
        },
      },
      inventory: [
        {
          id: "T8_2H_TOOL_FISHINGROD",
          name: "Elder's Fishing Rod",
          hint: "Equip at T8 schools only",
        },
        {
          id: "T3_FISHINGBAIT",
          name: "Fancy Fish Bait",
          hint: "Best silver-to-bite ratio",
        },
        {
          id: "T7_JOURNAL_FISHING_EMPTY",
          name: "Grandmaster Fisherman's Journal (Empty)",
          hint: "Fill while fishing; return to laborers for bonus fish",
        },
      ],
    },
    requirements: [
      "Fishing level 60+ for Grandmaster rod; T8 fisherman spec for Elder's rod and armor on T8 tabs",
      "T8 road map with water, minimum ~2M/hr with proper fishing gear in-zone",
      "Access to an Avalonian Road portal near a royal city or Brecilien",
      "T3 bait every session (faster bites = more casts per hour)",
      "Pork Pie ×2 per hour on every fishing tab (+15% yield, +30% carry weight)",
      "Grandmaster fishing journal, adds ~100k sell value per filled journal per hour",
    ],
    steps: [
      "Enter an Avalonian Road from a yellow or blue zone and travel inward until you find a T8 map with large water bodies.",
      "Scout for T8 fishing schools (visible nodes on the water), only cast on schools, not open water.",
      "Pick a loadout tab: safe escape (mobility only). T7 gear (middle specs), T8 max profit, or T8 max spec on deep road maps.",
      "T7/T8 geared tabs: equip fisherman armor, eat 2 Pork Pies per hour, and carry an invisibility potion. Keep the rod in your bag, wear Bloodletter, a cape, bag, and mount while riding between schools.",
      "Safe setup: wear the escape build. Grandmaster fisherman cap, 2 Pork Pies per hour, rod and journal in bag. No fishing garb, boots, or invis potion.",
      "Fish T8 River Sturgeon schools, rare Puremist Snapper can also appear as a bonus catch.",
      "Fill your Grandmaster fishing journal as you go for extra sell value.",
      "Bank when full or if scouts appear. Sell River Sturgeon. Puremist Snapper, and filled journals raw; butcher lower-tier bycatch into chopped fish before listing.",
    ],
    tips: [
      "You catch ~350-550 fish/hr depending on gear, premium, and specs. T7 gear ≈400/hr (40% Sturgeon, 60% butchered). T8 gear ≈450/hr (3/7 Sturgeon, 4/7 butchered). Each butchered fish yields ~15 chopped fish.",
      "Sell River Sturgeon and Puremist Snapper raw. Butcher T7-and-lower bycatch into chopped fish. Never chop Sturgeon (raw sells for far more).",
      "Puremist Snapper is the big swing factor, common on Ava Roads and also in T7 yellow Mists. Finding snapper schools pushes a good hour into a great one.",
      "Do not cheap out on T7 gear long-term: T8 fisherman armor gives a significant fish-per-cast bonus and faster spec/journal progress.",
      "Pork Pie ×2 per hour grants +15% gathering yield (which also boosts fishing yield) and +30% carry weight, including on the safe escape build.",
      "If dismounted on the safe build, pop Flee on Miner's Workboots, then Ambush on the Assassin's Jacket to juke and remount your T3 horse.",
      "A single death in expensive fishing gear can wipe hours of profit, use a good mount (Giant Stag) once your kit is valuable.",
      "Carry invisibility potions on geared tabs. They work while silenced and help on Ava Roads.",
      "Never ride with the rod equipped on Ava Roads, swap to it only at the school, then back to Bloodletter before you remount.",
    ],
    featured: true,
    readTime: 9,
  },
  {
    slug: "laborer-passive-income",
    title: "Laborer Passive Income",
    description:
      "Run a fully upgraded T8 laborer island on T7 journals. Each laborer processes one full journal every 22 hours at 150% yield and returns unrefined T7 resources plus an empty journal.",
    category: "laborers",
    difficulty: "advanced",
    zoneType: "safe",
    silverPerHour: { min: 5_000, max: 35_000 },
    silverByLevel: [
      { label: "4-6 T8 laborers (per 22h)", min: 40_000, max: 150_000 },
      { label: "8-12 T8 laborers (per 22h)", min: 80_000, max: 300_000 },
      { label: "16 T8 laborers, T7 journals (per 22h)", min: 150_000, max: 500_000 },
    ],
    requirements: [
      "Level 6 personal island with T8 laborer houses (one laborer per house)",
      "T8 beds and tables, one bed per laborer, one table per four laborers",
      "T8 trophies to reach 150% happiness on T7 journals",
      "T7 full journals, fill while gathering T7/T8 or buy filled journals on the market",
    ],
    steps: [
      "Upgrade island houses to T8 and hire T8 laborers of the matching specialty (prospector, lumberjack, cropper, etc.).",
      "Furnish each T8 house: T8 bed per laborer. T8 table per four laborers, plus T8 trophies for 150% happiness on T7 journals. Happiness takes up to 10 hours to max after placing furniture.",
      "Wait 30 minutes after hiring a new laborer before they can accept their first journal.",
      "Carry empty journals while you gather, craft, or kill mobs, only base fame counts (premium fame bonus does not fill journals).",
      "Hand a full T7 journal to a T8 laborer of the same type. T8 houses hit 150% yield on T7 journals. Each job takes 22 hours.",
      "Collect unrefined resources and the empty journal when the job finishes. Sell resources and re-use or sell the empty journal.",
      "Repeat, specialize laborers to match whatever activity you already do so journal filling costs nothing extra.",
    ],
    tips: [
      "Profit per journal ≈ (resource sell value + empty journal value) - full journal cost. Filling journals yourself removes the buy cost and is the most profitable approach.",
      "This guide assumes a full T8 setup: T8 laborer houses with T8 furniture processing T7 journals at the 150% happiness cap (~58 T7 resources per journal).",
      "Carry two journals at once: one generalist trophy journal (fills on any fame) plus one profession journal (gathering, crafting, or mercenary).",
      "T7 gathering journals fill while harvesting T7 or T8 resources of the matching type.",
      "Laborers process journals at or below their tier, a T8 laborer handles T7 journals. You hire laborers at the house tier; they do not level up from journal turn-ins.",
      "Check market prices before buying filled journals, margins vary by city and journal tier. Caerleon and Brecilien often have the best journal spreads.",
      "Other ways to profit: flip empty/full journals on the market, use returned resources for crafting, or sell leveled laborer contracts.",
    ],
    profitBuild: {
      title: "Island Setup",
      description:
        "Full T8 island setup: T8 furniture and trophies in every house, processing T7 journals at 150% yield.",
      slots: {},
      inventory: [
        {
          id: "T8_FURNITUREITEM_BED",
          name: "Elder's Bed",
          hint: "One T8 bed per laborer",
        },
        {
          id: "T8_FURNITUREITEM_TABLE",
          name: "Elder's Table",
          hint: "One T8 table per four laborers",
        },
        {
          id: "T8_FURNITUREITEM_TROPHY_GENERAL",
          name: "Ledger of Truths",
          hint: "T8 generalist trophy",
        },
        {
          id: "T8_FURNITUREITEM_TROPHY_ORE",
          name: "Adamantium Ore Sample",
          hint: "T8 prospector trophy",
        },
        {
          id: "T7_JOURNAL_TROPHY_GENERAL_FULL",
          name: "Grandmaster's Generalist Trophy Journal (Full)",
          hint: "Hand to laborer: fills on any fame alongside a profession journal",
        },
        {
          id: "T7_JOURNAL_ORE_FULL",
          name: "Grandmaster Prospector's Journal (Full)",
          hint: "Hand to prospector: returns ~58 T7 ore at 150%",
        },
        {
          id: "T7_JOURNAL_FIBER_FULL",
          name: "Grandmaster Cropper's Journal (Full)",
          hint: "Hand to cropper: returns ~58 T7 fiber at 150%",
        },
        {
          id: "T7_JOURNAL_WOOD_FULL",
          name: "Grandmaster Lumberjack's Journal (Full)",
          hint: "Hand to lumberjack: returns ~58 T7 wood at 150%",
        },
      ],
    },
    featured: true,
    readTime: 8,
  },
  {
    slug: "potions-crafting-bulk",
    title: "Bulk Potion Crafting",
    description:
      "Craft Major Healing Potion and Major Energy Potion daily at a Thetford alchemy lab (72 Elusive Foxglove + eggs/milk + Potato Schnapps per 5 pots), add Major Gigantify Potion and Major Resistance Potion before weekend ZvZ, and list on Caerleon when war consumables spike.",
    category: "crafting",
    difficulty: "intermediate",
    zoneType: "safe",
    silverPerHour: { min: 150_000, max: 800_000 },
    requirements: [
      "T6 Alchemy with potions specialization (T7 for Gigantify / Resistance recipes)",
      "Personal island T6+ alchemy lab or Thetford city station (-15% herb city bonus)",
      "Crafting focus saved for Major Healing Potion (768 focus per 5 pots) and Major Gigantify Potion (1,020 focus per 5 pots)",
      "Silver to buy Elusive Foxglove. Goose Eggs, Sheep's Milk, Potato Schnapps, and T7 Firetouched Mullein + Corn Hooch for war pots",
    ],
    steps: [
      "Tuesday-Wednesday: buy Elusive Foxglove [6.0]. Goose Eggs [5.0], Sheep's Milk [6.0], and Potato Schnapps [6.0] on Thetford when herb prices dip after the weekend rush.",
      "Daily bulk (Mon-Wed): craft Major Healing Potion. 72× Elusive Foxglove, 18× Goose Eggs, 18× Potato Schnapps per 5 pots. Spend all focus here first.",
      "Fill remaining lab time with Major Energy Potion, same 72× Elusive Foxglove and 18× Potato Schnapps, but swap eggs for 18× Sheep's Milk per 5 pots. Craft without focus.",
      "T5 starter path: craft Healing Potion (24× Crenellated Burdock + 6× Hen Eggs per 5) and Energy Potion (24× Crenellated Burdock + 6× Goat's Milk per 5) until you unlock T6 majors.",
      "Thursday-Saturday (before CTAs): craft Major Gigantify Potion. 72× Firetouched Mullein, 36× Elusive Foxglove, 18× Goose Eggs, 18× Corn Hooch per 5 pots, and Major Resistance Potion. 72× Firetouched Mullein, 36× Elusive Foxglove, 36× Crenellated Burdock, 18× Sheep's Milk, 18× Corn Hooch per 5 pots.",
      "List Major Healing Potion and Major Gigantify Potion on Caerleon 1 silver under the lowest sell order in stacks of 50. Major Energy Potion can stay on Thetford if Caerleon spread is under 5%.",
      "Profit = (potion sell price × 5 per craft) - herb/egg/milk/alcohol buy cost - station fee - 6.5% market tax. Recheck each recipe before batching.",
    ],
    tips: [
      "Major Healing Potion is ~70% of profit. Never burn focus on Major Energy Potion when heal margins are positive.",
      "Major Gigantify Potion and Major Resistance Potion only matter Thu-Sat; stock 50-100 of each before alliance CTAs, not year-round.",
      "Buy Firetouched Mullein and Corn Hooch early in the week. T7 war-pot inputs spike harder than T6 foxglove.",
      "Goose Eggs are shared by Major Healing Potion and Major Gigantify Potion; buy one bulk stack for both recipes.",
      "If any major potion margin drops below 10% after tax, pause that recipe and wait for the next ZvZ cycle.",
      "Slot an empty Mercenary's Journal while crafting, alchemy fame fills it for bonus laborer silver.",
    ],
    profitBuild: {
      title: "Materials to Stock",
      description:
        "Buy herbs, eggs, milk, and alcohol on Thetford mid-week. You craft Major Healing + Major Energy daily; stock mullein and corn hooch before ZvZ for Gigantify and Resistance.",
      slots: {},
      inventory: [
        {
          id: "T6_FOXGLOVE",
          name: "Elusive Foxglove",
          quantity: 72,
          hint: "Per 5 T6 major pots",
        },
        {
          id: "T5_EGG",
          name: "Goose Eggs",
          quantity: 18,
          hint: "Per 5 Major Healing / Gigantify",
        },
        {
          id: "T6_MILK",
          name: "Sheep's Milk",
          quantity: 18,
          hint: "Per 5 Major Energy / Resistance",
        },
        {
          id: "T6_ALCOHOL",
          name: "Potato Schnapps",
          quantity: 18,
          hint: "Per 5 T6 major recipes",
        },
        {
          id: "T7_MULLEIN",
          name: "Firetouched Mullein",
          quantity: 72,
          hint: "Per 5 Gigantify or Resistance",
        },
        {
          id: "T7_ALCOHOL",
          name: "Corn Hooch",
          quantity: 18,
          hint: "Per 5 war pots",
        },
        {
          id: "T4_BURDOCK",
          name: "Crenellated Burdock",
          quantity: 36,
          hint: "Per 5 Major Resistance Potions",
        },
        {
          id: "T4_JOURNAL_MERCENARY_EMPTY",
          name: "Adept Mercenary's Journal (Empty)",
          quantity: 1,
          hint: "Optional: fill while crafting for bonus returns",
        },
      ],
    },
    featured: false,
    readTime: 8,
  },
];

export const guides: Guide[] = attachGuideReliability(rawGuides);

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: Guide["category"]): Guide[] {
  return guides.filter((g) => g.category === category);
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured);
}
