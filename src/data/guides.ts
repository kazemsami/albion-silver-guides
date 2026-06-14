import type { Guide } from "@/types/guide";
import { attachGuideReliability } from "@/data/guide-reliability";
import {
  guideDefaultMarketCityBySlug,
  guideRiskProfileBySlug,
} from "@/data/guide-meta";

const rawGuides: Omit<Guide, "reliability" | "defaultMarketCity" | "riskProfile">[] = [
  {
    slug: "t4-ore-mining-yellow-zone",
    title: "Ore Mining in Yellow Zones",
    description:
      "Mine Martlock highland yellow zones (logged route: Eldon Hill) for iron, tin, and titanium ore. Sell raw ore locally and optionally fill a prospector journal. Reviewed against 1 logged 30-min intermediate run with Pork Pie, no Premium: ~205k/hr net after Standard tax and 1 Pork Pie (~361 iron/hr at ×1.9 extrapolation).",
    category: "gathering",
    difficulty: "beginner",
    zoneType: "safe",
    silverPerHour: { min: 110_000, max: 205_000 },
    requirements: [
      "T4 pick in bag + T4 miner gear to start; T5 pick for titanium nodes (matches logged run)",
      "Giant Stag for node-to-node travel and carry weight on every tier",
      "Miner backpack (cape slot) plus a gatherer bag for longer trips before banking",
      "Empty Adept Prospector's Journal in inventory (optional bonus silver)",
      "Pork Pie (+15% yield, +30% carry weight), budget ~1 pie per hour on every tier",
    ],
    steps: [
      "Start in Martlock. Logged test route: Eldon Hill yellow highland. Alternate loop: Haytor → Pennine Forest → Slimehag. Mine iron (T4) as the main value; tin and titanium spawn on the same paths.",
      "For maximum silver per hour, skip copper (T2) and often tin (T3) and only hit iron and titanium. The logged run mined every ore on path, which adds tin volume but lowers iron/hr.",
      "Bank when carry weight hits ~80%. With Pork Pie and a bag, a mixed-ore trip is roughly 700+ ore before banking (logged 30 min: 190 iron, 405 tin, 68 titanium, plus uncommon spawns).",
      "Do not refine. Sell raw ore on the Martlock market (list 1 silver under the lowest sell order). Tin sells but iron and uncommon ore usually pay better per minute.",
      "After depositing, buy another Pork Pie and repeat. Upgrade to T5 pick when you can one-shot titanium nodes without slowing the route.",
      "Track profit as: (ore sold × price) minus Pork Pie cost minus listing tax. Journals add bonus silver if you fill one while mining.",
    ],
    tips: [
      "Logged 30-min intermediate run (Eldon Hill, T5 gear, Pork Pie, miner backpack, gatherer bag, every node, no Premium): 190 iron, 405 tin, 68 titanium, 28 uncommon iron, 17 uncommon titanium. Calculator extrapolates yields to 1 hr at ×1.9 (banking/travel overhead, not straight ×2). Saved Martlock ore averages: iron 170, tin 105, titanium 490, uncommon iron 180, uncommon titanium 650. ~105k net in 30 min after Standard listing tax (10.5%) and 1 Pork Pie (~205k/hr). Premium (+50% gather yield, 6.5% tax) is projected only; toggle Premium in the header to compare.",
      "Iron-only routing should raise iron/hr above 361 but total stack weight drops. Tin is fast to mine but lower silver per minute. Titanium and enchanted ore need T5 pick and higher spec (intermediate tier in the calculator).",
      "Martlock has solid local ore buy volume; only haul to Caerleon if the price gap exceeds ~8% after transport time.",
      "Mine during EU off-peak if your zone is crowded; contested nodes cut ore/hr directly.",
      "If you die, you only lose your pork pie and partial stack. Yellow zones knock down; they do not loot your ore.",
      "Premium gather yield (+50%) and prospector journals were not on the logged run; treat those as upside only.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "T5 miner set for Eldon Hill. Logged setup: Pork Pie, miner backpack, gatherer bag.",
      slots: {
        head: {
          id: "T5_HEAD_GATHERER_ORE",
          name: "Expert's Miner Cap",
          hint: "Mining yield passive bonus",
        },
        armor: {
          id: "T5_ARMOR_GATHERER_ORE",
          name: "Expert's Miner Garb",
          hint: "Mining yield passive bonus",
        },
        shoes: {
          id: "T5_SHOES_GATHERER_ORE",
          name: "Expert's Miner Workboots",
          hint: "Yield bonus + reduced ore weight",
        },
        cape: {
          id: "T5_BACKPACK_GATHERER_ORE",
          name: "Expert's Miner Backpack",
          hint: "Cape slot: -30% ore weight",
        },
        bag: {
          id: "T4_BAG",
          name: "Adept's Bag",
          hint: "Pick in bag until you mine; extra carry weight per trip",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "Best yellow-zone gather mount: speed plus carry weight",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          hint: "+15% gathering yield, +30% carry weight",
        },
      },
      inventory: [
        {
          id: "T5_2H_TOOL_PICK",
          name: "Expert's Pickaxe",
          hint: "In bag. Equip to mine iron (T4) and titanium (T5)",
        },
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
    title: "Fiber Farming in Yellow Zones",
    description:
      "Farm Lazygrass Plain near Bridgewatch on T5 harvester gear for mixed T3-T5 fiber and cropper journal fills. Reviewed against 1 logged 30-min run with Pork Pie (no Premium): ~250k/hr net after Standard tax and 1 Pork Pie.",
    category: "gathering",
    difficulty: "beginner",
    zoneType: "safe",
    silverPerHour: { min: 250_000, max: 450_000 },
    requirements: [
      "T5 sickle in bag + T5 harvester gear (cap, garb, workboots)",
      "Giant Stag for loop travel and carry weight on every tier",
      "Harvester backpack (cape slot) plus a gatherer bag for longer loops",
      "Two empty Expert Cropper's Journals in inventory",
      "Pork Pie (+15% yield, +30% carry weight), budget ~1 pie per hour on every tier",
    ],
    steps: [
      "Base out of Bridgewatch. Farm Lazygrass Plain (yellow zone): circle the map on a tight loop. Fiber is a secondary resource in steppe zones, so node density is lower than swamp fiber routes.",
      "Harvest T5 Skyflower first, then T4 Hemp and T3 Flax on the return leg. Grab rare hemp (.2) when it spawns. Uncommon and rare skyflower (.1/.2) need T5 gear and higher spec (intermediate tier in the calculator).",
      "Carry two empty Expert Cropper's Journals and fill them while gathering (about two full journals per hour on this loop). Sell full journals with your fiber in Bridgewatch.",
      "Sell raw fiber in Bridgewatch (do not weave to cloth unless cloth margins clearly beat raw fiber after tax).",
      "After depositing, buy another Pork Pie and repeat the loop.",
      "Relist every 30 minutes during peak hours or undercut by 1 silver to move stacks before the next loop.",
    ],
    tips: [
      "Reviewed against 1 logged run on Lazygrass Plain (Bridgewatch, T5 harvester gear, Pork Pie, no Premium). Logged fiber/hr already includes the Pork Pie gather bonus.",
      "Logged run (~30 min): ~225 T3 flax, ~250 T4 hemp, ~141 T5 skyflower, plus rare hemp and uncommon/rare skyflower when enchanted nodes spawned, one Expert journal filled. ~140k gross before tax (~280k/hr); ~125k net after Standard listing tax and 1 Pork Pie (~250k/hr).",
      "Enchanted nodes are bonus silver from intermediate tier up: rare hemp (.2) at beginner; uncommon or rare skyflower (.1/.2) once you run T5 gear and higher mining/fiber spec.",
      "With Premium on the same Lazygrass Plain loop, expect roughly ~450k/hr before tax (+50% gather yield and lower listing tax). That figure is projected, not logged. Toggle Premium in the header to compare.",
      "Skyflower (T5) is most of your silver; prioritize T5 nodes even if it means skipping a T4 cluster.",
      "Bridgewatch is your bank and market; sell locally instead of hauling to Caerleon unless the spread clearly covers travel time.",
      "Pork Pie (+15% yield, +30% carry weight) is part of every loadout tier and was active on the logged run.",
      "Stay in yellow zones for knockdown safety, blue zones are not more profitable, just less punishing on death than red.",
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "T5 harvester set for Lazygrass Plain. Pork Pie, harvester backpack, gatherer bag; carry two empty cropper journals.",
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
        cape: {
          id: "T5_BACKPACK_GATHERER_FIBER",
          name: "Expert's Harvester Backpack",
          hint: "Cape slot: -30% fiber weight",
        },
        bag: {
          id: "T4_BAG",
          name: "Adept's Bag",
          hint: "Sickle in bag until you harvest; extra carry weight per loop",
        },
        mount: {
          id: "T4_MOUNT_GIANTSTAG",
          name: "Adept's Giant Stag",
          hint: "Best yellow-zone gather mount: speed plus carry weight",
        },
        food: {
          id: "T7_MEAL_PIE",
          name: "Pork Pie",
          hint: "+15% gathering yield, +30% carry weight",
        },
      },
      inventory: [
        {
          id: "T5_2H_TOOL_SICKLE",
          name: "Expert's Sickle",
          hint: "In bag. Equip for hemp (T4) and skyflower (T5)",
        },
        {
          id: "T5_JOURNAL_FIBER_EMPTY",
          name: "Expert Cropper's Journal (Empty)",
          quantity: 2,
          hint: "Carry two empties; fill both over the loop",
        },
      ],
    },
    featured: true,
    readTime: 6,
  },
  {
    slug: "corrupted-dungeons-pvpve",
    title: "Corrupted Dungeons for PvPvE Profit",
    description:
      "Run Stalker corrupted dungeons in red zones for souls and runes. Hunter (knockdown) is for learning; Stalker and Slayer are full-loot. Use this for the flow and invasion rules; real profit depends on win rate, deaths, market tax, and how often you get contested.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 250_000, max: 650_000 },
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
      "Sell souls and runes on Caerleon. List 1 silver under the lowest sell order during prime hours; subtract ~6.5% listing tax (Premium) from your margin.",
    ],
    tips: [
      "Stalker pays much more than Hunter but is full-loot PvP, only run it when your invasion win rate is solid.",
      "Demonic Shards are breakable objects that spawn on invasion. Destroy three to eject the invader. They cost no silver; that is the intended banish mechanic.",
      "You can be invaded even if you skip the entrance shrine. Signing the contract only affects your chance to become the invader.",
      "Healing is reduced 40% in Corrupted Dungeons, burst and shard-banish plays often beat trying to out-heal a geared invader.",
      "Slayer is for high-infamy veterans; higher IP cap and T8 mobs, but death risk dwarfs the extra loot for most farmers.",
      "Never chain runs with a full inventory. One death loses the chest and your kit on Stalker/Slayer.",
      "The profit calculator already subtracts ~6.5% Premium listing tax from sell value. Undercutting sell orders eats into the margin on top of that.",
      "Stalker gear losses swing your hourly. At ~290k kit value, the calculator assumes ~0.3 deaths/hour (~85k/hr); aggressive or unlucky sessions lose multiples of that plus the chest loot on each death.",
      "Bank after each chest when possible. Real hourly profit swings with invasion frequency, win rate, loot RNG, and infamy tier.",
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
          hint: "Chain Lightning burst; invis comes from your potion",
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
    slug: "dungeon-maps-solo",
    title: "Solo Dungeon Maps",
    description:
      "Buy solo dungeon maps from the market, open a private dungeon entrance, and farm silver in a dedicated instance with no competition. Accessible from ~1100 IP (T6 maps) up to 1540+ IP (T8.2 maps). A logged 2.5-hour session at 1540 IP with 20 T8.2 maps produced 4.2M gross loot before listing tax. Unlike free open-world spawns, maps stay in the zone you open them, and you can chain runs back-to-back without waiting.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 900_000, max: 1_600_000 },
    requirements: [
      "~1100 IP minimum for T6 or T7 maps; ~1400-1540 IP for T8+ maps",
      "Solo dungeon maps from the market (T6 ~10-15k each, T7 ~25-30k, T8.2 ~40k); buy in bulk of 20+",
      "Red or black zone near a royal city; yellow zones work but pay significantly less",
      "An extra 2 to 3 maps in your bag for the spawn-blocking trick (see tips)",
    ],
    steps: [
      "Buy solo dungeon maps in bulk from the market. T7 maps offer solid loot with less zone-hopping than T8. T8.2 is the high end (~40k each). Check the order book daily; map prices fluctuate.",
      "Pick your zone. You want a red zone surrounded by higher-tier zones so your map portal can only spawn in your current zone. Alternatively, enter the Roads of Avalon and find a Hideout zone whose name starts with SEC (for T6 maps) or SET (for T7 maps). These zone types keep map portals locked to the same zone.",
      "Optional spawn-block trick: bring 3 to 4 extra maps. Open one map, walk to its portal location, then open a second one. Repeat until the game shows a message that all dungeon slots are filled. Close the last dungeon immediately. Every slot is now taken so your next map will always spawn right where you are standing, eliminating travel between runs.",
      "Enter the dungeon. Clear packs efficiently. Do not wait for the 90-second post-kill chest timer. A real run takes 4 to 5 minutes to clear naturally, so waiting every chest adds 33 percent dead time to your session.",
      "Mob threshold rule: you can skip up to 5 mobs without the final chest locking. Chrome Golems are an exception and do not count toward the threshold even if skipped. When a pack mixes large and small mobs, killing only the small mobs still counts, so clear mixed packs at minimum.",
      "Shaman boss warning: if the boss uses its ability, the five shrines around it become active and each shrine counts as one mob toward the threshold. Do not let any aggroed mob live when fighting a Shaman boss or the chest will not open.",
      "Watch for Morganotones near mob packs. If you aggro a pack too close to a Morganotone it will shadow-aggro and silently count toward the threshold. Kill Morganotones before finishing a nearby pack.",
      "Loot all chests. Open silver bags immediately inside the dungeon so they convert to silver on death instead of dropping as loot. Bank after every 1 to 2 runs.",
      "Sell runes, souls, and relics on Caerleon. List 1 silver under the lowest sell order during prime hours. Relics sometimes have better value crafted than sold raw.",
    ],
    tips: [
      "Maps guarantee a private instance. Unlike free open-world dungeons, no other player can take your chest.",
      "T8 maps jump to random zones constantly which creates a lot of travel downtime. T7 maps run at 11 per hour vs T8 at 8 to 9 per hour. Both tiers reach similar silver per hour before tax, but T7 is more consistent and forgiving if you are learning routes.",
      "Zone trick detail: if your current zone is T7 and all surrounding zones are T8, T7 map portals have nowhere to spawn except in your zone. This removes all inter-zone travel. It works for T6 and T7 maps. T8 maps cannot use this trick since T8 is the highest tier.",
      "Roads of Avalon hideout zones starting with SEC are T6 and starting with SET are T7. These zones accept maps of the same tier only, so your portals will never jump to another zone. Roads are a popular spot for consistent high-volume sessions.",
      "T8.2 maps at ~40k each cost roughly 19 percent of your gross loot per run. Watch the buy price before restocking. A jump from 40k to 55k reduces net margin by about 120k per hour at 8 runs per hour.",
      "Do not wait the 90-second chest timer. A full clear takes 4 to 5 minutes anyway. Waiting adds 33 percent dead time per run which directly cuts maps per hour.",
      "Chrome Golems are the one mob type that does not count toward the 5-mob skip threshold. You can safely ignore them if needed.",
      "Coldmetal Robe or a tanky chest piece can substitute for Mercenary Jacket if you need more HP for survival. Crypt Candle offhand gives more damage than Torch; Torch gives cooldown reduction and more mobility between packs.",
      "Thetford Cape is the strongest cape for this activity. Leather Shoes give cooldown reduction for faster ability cycling if you do not have energy problems; Cloth Sandals are safer if you need the mana.",
      "Red-zone deaths drop your full inventory. Never carry more than 2 runs of unsold loot into a third run. The calculator models only the map cost as an input; consumables are a real additional cost not tracked in the logged session.",
    ],
    references: [
      {
        title: "Lemisi1235: T8.2 Solo Dungeon Map Run (2.5 hrs, 4.2M loot)",
        url: "https://www.youtube.com/watch?v=kdZ9GL9kpoo",
      },
    ],
    profitBuild: {
      title: "T8.2 Map Build (~1540 IP)",
      description:
        "Elder's gear from the logged 2.5-hour T8.2 session. ~1540 IP. Swap offhand to Crypt Candle for more damage, or keep Torch for cooldown reduction and faster pack-to-pack movement.",
      slots: {
        head: {
          id: "T8_HEAD_CLOTH_SET1",
          name: "Elder's Scholar Cowl",
          hint: "Energy regen on every spell cast",
        },
        armor: {
          id: "T8_ARMOR_LEATHER_SET1",
          name: "Elder's Mercenary Jacket",
          hint: "Strong AoE damage output; swap to Coldmetal Robe for more HP",
        },
        shoes: {
          id: "T8_SHOES_PLATE_SET1",
          name: "Elder's Soldier Boots",
          hint: "Gap close between packs; swap to Leather Shoes for CDR if energy is not an issue",
        },
        mainhand: {
          id: "T8_XBOW_HEAVY",
          name: "Elder's Heavy Crossbow",
          hint: "High AoE bolt clear speed",
        },
        cape: {
          id: "T4_CAPEITEM_FW_THETFORD",
          name: "Thetford Cape",
          hint: "Strongest cape option for this activity",
        },
        food: {
          id: "T8_MEAL_STEW",
          name: "Elder's Mutton Stew",
          hint: "+damage for faster clears",
        },
        potion: {
          id: "T8_POTION_HEAL",
          name: "Elder's Healing Potion",
          hint: "Emergency heal between pulls",
        },
      },
    },
    featured: false,
    readTime: 8,
  },
  {
    slug: "abyssal-depths-farming",
    title: "Abyssal Depths Silver Farming",
    description:
      "Run The Depths from any royal city's Antiquarian's Den: orange-zone PvE/PvP with collapsing floors, souls, and stacking buffs. The calculator models win rate, solo/duo/trio queue time, run duration, floor extract depth, optional PvP loot, and bag-only death loss. Gear stays equipped on death.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 400_000, max: 1_200_000 },
    requirements: [
      "Antiquarian's Den in any royal city or Caerleon, enter unflagged, bank everything in the shared Den bank",
      "Queue duo or trio with a full team when possible; solo works for PvE but is handicapped in PvP",
      "~1200 Item Power softcap (only 20% of stats above 1200 count; Fame Bonus is not reduced)",
      "Empty inventory before entry, equipped gear locks inside; only consumables can technically be swapped mid-run",
      "PvP ability builds ready before entry; swap spells between fights when you have time to inspect enemies",
      "Cheap mount with strong carry weight (riding boar, ox, or stag) for extract loot",
      "Food, healing pots, and extra consumables for ~45 min runs",
    ],
    steps: [
      "Enter the Antiquarian's Den from the map portal, bank all items, and queue at The Depths gateway. Match your queue size to your group, duo in duo, trio in trio.",
      "Orange zone rules apply: death drops inventory only, not equipped gear. Enter with an empty bag and the loadout you will fight with.",
      "Floor 1 uses T6 mobs. Clear statue rooms to spawn a loot chest or one of three buffs: Dominion (slow), Cruelty (resistance shred), or Wrath (burst damage + healing when dealing direct damage below 40% HP).",
      "Each buff your team picks up adds one stack of Demonic Ferocity party-wide (+2% PvP damage and +1% PvP defense per stack, max 15). Aim for 15 stacks on floor 1 before descending, low stacks mean reset and extract instead of pushing.",
      "Souls drop from player deaths always, and rarely from mobs. Red = enemy, blue = ally, white = mob or a player who released. Blue souls revive teammates at the Altar of Awakening; any soul works at an upward exit or the Altar of Greed.",
      "Sacrifice enemy red souls at the Altar of Greed when they are still downed, that removes them from the run and pays a chest. Kidnap red souls mid-fight so enemies cannot revive. Fully loot greed chests immediately so you can chain soul turn-ins.",
      "After ~10–15 minutes, floor 1 collapses, hellfire damage ramps if you linger. Upward exits to the Den and downward stairs to floor 2 spawn across the map. Hover exit icons to read the timer.",
      "If buff stacks are low, a teammate is down, or your bag already holds good loot, take an exit and secure profit. Floor 2 (T7 mobs, better rewards) repeats the same loop.",
      "Floor 3 (T8 mobs) spawns contested vault keys (3 in duo, 5 in trio) and a central Treasure Vault. Opening the vault spawns a channeled escape portal. When floor 3 collapses there are no Den exits, leave via soul exit or the vault portal.",
      "Player kills and altar souls are a major loot source, take PvP fights when stacked and geared. Sell tradable chest loot on Caerleon; open silver bags in your bag (they do not drop on death).",
    ],
    tips: [
      "1200 IP is the efficient sweet spot, do not overspend on 8.4 for marginal gains. A .4 weapon keeps full Fame Bonus if you are leveling specs safely here.",
      "The loadout panel shows full kit value, but only bag loot drops on death. Astral Staff is for clear speed under the softcap, not a per-death 9M silver loss.",
      "Use Conservative PvE for floor-1 learning. Average floor-2 at 68% win rate is the Expected row and calculator default; Median is the same route at 65% if you reset more often. PvP win run when you take fights; Floor-3 vault for high-roll upside.",
      "Adjust win rate and run duration (20, 30, 45 min). Silver/hr drops if runs take longer or you reset often.",
      "Run PvP abilities even while clearing mobs. If you get jumped mid-pull, there is no time to respec.",
      "Never fight without an active room buff if the enemy has one, buffs only proc below 40% HP but are the main edge beyond gear.",
      "Death loss in the calculator is bag loot only. Open silver bags in your inventory; tradable chest loot is what you lose if you wipe with a full bag.",
      "Reset early when stacks are below ~10, inventory is full, or you are outnumbered. Safe extracts beat greedy floor-3 throws.",
      "Floor 3 is stacked and sweaty, only push when your team hit 15 stacks early and you are ready for key fights. Vault loot is high variance.",
      "Optional: empty T8 mercenary journals on floor 3 T8 mobs (~300k per 15 filled), inventory risk only.",
    ],
    references: [
      {
        title: "Leyvi: The Depths Explained (PvP, Buffs & Souls)",
        url: "https://www.youtube.com/watch?v=DT-SNiJZemI",
      },
      {
        title: "Swole Benji: Solo Abyssal Depths Guide",
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
          hint: "Empty at entry, fill with extract loot only",
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
    title: "Avalonian Roads Group Tracking",
    description:
      "Run 4-man veteran tracking on the Roads of Avalon. Strong groups rotate Golem, Dawnbird, Panther, Werewolf, and Rare Quarry hunts. The profit calculator uses average loot from a real ~22 kill session: panther fur, dawnbird feathers, spirit remains, body parts, ancient stones/souls, and rare quarry bags, plus low-chance shapeshifter remnants.",
    category: "dungeons",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 550_000, max: 1_200_000 },
    requirements: [
      "Party of 4 for veteran targets on Avalonian Roads (extra players only speed up study timers)",
      "One tracker/DPS with a T7 Tracking Toolkit (covers Golem, Dawnbird, Panther, and Werewolf via tier +1)",
      "Tracking Mastery plus target specializations for the veteran hunts you rotate",
      "Tank, healer, and DPS in full-loot PvP gear for Roads black zones",
      "Beef Sandwich, Major Healing Potions, Major Gigantify, invisibility potions for Roads escapes",
    ],
    steps: [
      "Form a fixed 4-man group: 1 tracker/DPS (starts hunts), 1 tank (Incubus Mace + Guardian), 1 healer (Fallen Staff), 1 DPS (Wildfire Staff or Crystal Reaper). Share voice comms; track study and engage timing matter.",
      "Enter Avalonian Roads from a royal city or Brecilien portal. The tracker equips a T7 Tracking Toolkit and uses it on Roads maps to reveal tracks in a large radius.",
      "Study tracks with the toolkit in inventory. Clear any guard mobs before studying. Party members can study together to shorten the timer; veteran tracks require 4-8 players in party.",
      "Follow the highlighted region on the map through each hunt step. Deal enough damage before the hidden flee timer or the target escapes to the next zone. HP carries between steps.",
      "Rotate veteran hunts as tracks appear. Take Golem, Dawnbird, Panther, Werewolf, and Rare Quarry hunts on your Roads loop (~6-8 kills/hr when travel and banking are fast).",
      "Rare Quarries (Earthdaughter, Harvester of Souls, Shadowmask) are worth detours when tracks appear. They add Black Market loot on top of normal remains and essences.",
      "Bank after every successful kill. Roads are full-loot black zones; carry invisibility potions and remount quickly after banking.",
      "Sell Shapeshifter remnants and essences on Caerleon. List Rare Animal Remains in stacks of 100; crafters buy them for Arcane Extracts and war pots.",
    ],
    tips: [
      "Do not hard-lock Golem or Dawnbird only. Top Roads groups rotate every veteran track the toolkit reveals.",
      "A T7 toolkit covers Golem natively and Dawnbird, Panther, and Werewolf via the tier +1 rule. You do not need a T8 toolkit for those hunts.",
      "Too many players near the engagement zone, even outside it, can spook the target. Keep scouts minimal during the fight.",
      "De-aggroing resets the target's HP for the current hunt step. Do not reset progress with bad pulls.",
      "Calculator average loot is based on a real ~22 kill Roads session: panther fur, dawnbird feathers, spirit remains, body parts, ancient stones/souls, and rare quarry artifact bags.",
      "Competent 4-man groups often land ~6-7 kills/hr with ~650-750k group loot per kill on clean routes.",
      "Shapeshifter remnants are the main silver swing but drop rarely. Log 30-50 kills before you trust your personal average.",
      "Use Expected for planning, Good for above-average clean routes, and Lucky only for remnant jackpot hours.",
      "Per-player profit = group loot minus consumables, tax, repairs, deaths, and downtime, split across your party size (default 4).",
    ],
    references: [
      {
        title: "Group Tracking In Roads of Avalon | Albion Online",
        url: "https://www.youtube.com/watch?v=rYnjYIeOCNU",
      },
    ],
    profitBuild: {
      title: "Required Gear",
      description:
        "Standard DPS slot for Avalonian Roads mixed veteran hunts. Tracker carries the toolkit in inventory.",
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
          hint: "+defense and sustain for Roads hunts",
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
          hint: "Tracker only: mixed T7/T8 veteran hunts on Roads",
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
    slug: "mists-fishing",
    title: "Yellow Zone Mists Fishing",
    description:
      "Fish in yellow-zone Mists for solid non-lethal fishing income. PvP is knockdown-only, so profit mainly depends on fishing level, fisherman gear, Mist rarity, school density, market prices, and how quickly you find higher-rarity nested Mists. The calculator treats T7 journals and Puremist Snapper as late-game bonuses, not beginner income.",
    category: "fishing",
    difficulty: "intermediate",
    zoneType: "safe",
  
    silverPerHour: { min: 250_000, max: 1_000_000 },
  
    silverByLevel: [
      { label: "Fishing Level 10-30", amount: 250_000 },
      { label: "Fishing Level 30-60", amount: 500_000 },
      { label: "Fishing Level 60+", amount: 800_000 },
    ],
  
    requirements: [
      "Fishing level 10+ to start, but serious income starts much later",
      "Your best fisherman gear for your current fishing tier. Wear your best non-fishing gear for everything else",
      "Avalonian fishing rod in your bag. You can cast from inventory without equipping it",
      "T3 Fancy Fish Bait for active fishing schools",
      "Grandmaster Fisherman's Journal",
      "Moose mount (recommended)",
      "Basic comfort with Will o' Wisps, nested Mist portals, Mist rarity, and exit timers",
    ],
  
    steps: [
      "Bank in your royal city before each run. There is no normal bank inside the Mists, so enter with empty bag space and sell after you leave.",
      "Enter the Mists by finding a Will o' Wisp in a T5/T6 yellow zone. Wear your best gear, fisherman armor, Avalonian rod in bag, bait, and journal. Moose mount is recommended.",
      "Fish active schools near water in your starting Mist. Use T3 Fancy Fish Bait at schools for faster bites and more casts per hour.",
      "When the exit timer reaches around 5:00, start scouting for higher-rarity nested Wisps instead of squeezing one more fishing school.",
      "Prioritize Rare, Epic, and Legendary nested Mists because higher-rarity Mists are more likely to contain better fishing opportunities. Do not assume every Rare+ Mist is automatically a T7 fishing zone.",
      "If you only find an Uncommon Will o' Wisp, remember its location and keep searching briefly. If time is running out and no better option appears, enter the Uncommon Mist and keep fishing rather than wasting the rest of the session.",
      "At fishing 60+, bring a Grandmaster Fisherman's Journal when you expect to fish higher-rarity Mists long enough to fill meaningful fame. Below that, treat journals as a slow bonus, not guaranteed hourly income.",
      "After leaving the Mists, sell valuable fish raw. Butcher low-value bycatch into chopped fish only when chopped-fish value is clearly better than raw sale value.",
    ],
  
    tips: [
      "Yellow-zone Mists are knockdown-only, so wear your best gear instead of cheap throwaway kit.",
      "Your fishing rod can stay in your inventory. You do not need to put it in your main hand to fish.",
      "T7 fishing zones are not the default Mist you spawn into. You are usually hunting for better nested Mists, especially Epic and Legendary ones.",
      "Puremist Snapper is a rare T7 Mist/Roads fish, not its own visible fishing school. Treat it as RNG upside, not stable hourly income.",
      "A T7 Grandmaster Fisherman's Journal usually does not fill efficiently at low fishing levels. It becomes more realistic once you have stronger gear, higher fishing fame, and access to better Mists.",
      "At lower fishing levels, most income comes from normal fish and chopped fish. Do not advertise Snapper or T7 journals as beginner income.",
      "Pork Pie gives extra yield and carry weight, but beginners should check whether the extra fish value actually pays for the food.",
      "Fish during off-peak hours if possible. Less competition means more active schools and fewer interruptions.",
      "When the exit timer is low, scouting higher-rarity Wisps is often worth more than finishing one extra low-tier school.",
      "Use the silver/hour numbers as realistic ranges, not guarantees. Market prices, Mist rarity, competition, and fishing level change the result heavily.",
    ],
  
    references: [
      {
        title: "Albion Online Wiki: Mists",
        url: "https://wiki.albiononline.com/wiki/Mists",
      },
      {
        title: "Albion Online Wiki: Fishing",
        url: "https://wiki.albiononline.com/wiki/Fishing",
      },
      {
        title: "Albion Online Wiki: Fishing Rod",
        url: "https://wiki.albiononline.com/wiki/Fishing_Rod",
      },
      {
        title: "GremmyAngler: Beginner's Fishing Guide (Zero to Hero, Part 1)",
        url: "https://www.youtube.com/watch?v=oTcuphnd1io",
      },
      {
        title: "Reddit: Mists fishing tips (r/albiononline)",
        url: "https://www.reddit.com/r/albiononline/comments/1qgyrag/comment/o0iiku1/",
      },
    ],
  
    profitBuild: {
      title: "Required Gear",
      description:
        "Wear your best non-fishing gear for everything else. Required: fisherman set, Avalonian rod in bag, bait, and Grandmaster journal. Moose mount recommended.",
  
      slots: {
        head: {
          id: "T8_HEAD_GATHERER_FISH",
          name: "Elder's Fisherman Cap",
          hint: "Best fisherman head you can wear.",
        },
  
        armor: {
          id: "T8_ARMOR_GATHERER_FISH",
          name: "Elder's Fisherman Garb",
          hint: "Best fisherman armor you can wear.",
        },
  
        shoes: {
          id: "T8_SHOES_GATHERER_FISH",
          name: "Elder's Fisherman Workboots",
          hint: "Best fisherman boots you can wear.",
        },

        mount: {
          id: "T6_MOUNT_GIANTSTAG_MOOSE",
          name: "Master's Moose",
          hint: "Recommended mount for mists fishing loops.",
        },
      },
  
      inventory: [
        {
          id: "T8_2H_TOOL_FISHINGROD_AVALON",
          name: "Elder's Avalonian Fishing Rod",
          hint: "Stays in bag. Cast without equipping.",
        },
        {
          id: "T3_FISHINGBAIT",
          name: "Fancy Fish Bait",
          hint: "Use at active fishing schools for faster bites.",
        },
        {
          id: "T7_JOURNAL_FISHING_EMPTY",
          name: "Grandmaster Fisherman's Journal (Empty)",
          hint: "Fill while fishing in higher-rarity Mists.",
        },
      ],
    },
  
    featured: true,
    readTime: 10,
  },
  {
    slug: "ava-roads-fishing",
    title: "Avalonian Roads Fishing (T8)",
    description:
      "Fish normal schools on T8 Avalonian Road maps for top-tier silver. Roads are full-loot black zones: the calculator models portal search time, banking frequency, gear deaths, and fish lost when you die with a full bag. Puremist Snapper is a separate RNG line.",
    category: "fishing",
    difficulty: "advanced",
    zoneType: "dangerous",
    silverPerHour: { min: 600_000, max: 1_800_000 },
    silverByLevel: [
      { label: "Safe escape (bank ~12 min)", min: 400_000, max: 900_000 },
      { label: "Normal (GM gear, ~22 min banking)", min: 600_000, max: 1_300_000 },
      { label: "Greedy max profit (~35 min banking)", min: 900_000, max: 2_000_000 },
      { label: "Greedy + lucky Snapper hour (RNG)", min: 1_200_000, max: 2_800_000 },
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
          hint: "Escape if dismounted on roads",
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
          hint: "In bag, cast without equipping",
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
        "Full T8 fisherman set with pork pie. Rod in bag; Fort Sterling cape, Giant Stag, and invis potion for road escapes.",
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
          id: "T4_CAPEITEM_FW_FORTSTERLING",
          name: "Adept's Fort Sterling Cape",
          hint: "CC reduction; pair with invis potion to escape",
        },
        bag: {
          id: "T5_BAG",
          name: "Expert's Bag",
          hint: "Carry fish stacks between schools",
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
          hint: "High carry weight between schools",
        },
      },
      inventory: [
        {
          id: "T8_2H_TOOL_FISHINGROD",
          name: "Elder's Fishing Rod",
          hint: "In bag, cast without equipping",
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
      "T8 road map with water; profit scales with gear tab (see calculator)",
      "Access to an Avalonian Road portal near a royal city or Brecilien",
      "T3 bait every session (faster bites = more casts per hour)",
      "Pork Pie ×2 per hour on every fishing tab (+15% yield, +30% carry weight)",
      "Grandmaster fishing journal, adds ~100k sell value per filled journal per hour",
    ],
    steps: [
      "Enter an Avalonian Road from a yellow or blue zone and travel inward until you find a T8 map with large water bodies.",
      "Scout for fishing schools on the water (visible nodes), only cast on schools, not open water.",
      "Pick a loadout tab: safe escape (mobility only). T7 gear (middle specs), T8 max profit, or T8 max spec on deep road maps.",
      "T7/T8 geared tabs: equip fisherman armor, eat 2 Pork Pies per hour, and carry an invisibility potion. Keep the fishing rod in your bag and cast at schools without equipping it.",
      "Safe setup: wear the escape build. Grandmaster fisherman cap, 2 Pork Pies per hour, rod and journal in bag. No fishing garb, boots, or invis potion.",
      "Fill your Grandmaster fishing journal as you go for extra sell value.",
      "Bank when full or if scouts appear. Sell River Sturgeon. Puremist Snapper, and filled journals raw; butcher lower-tier bycatch into chopped fish before listing.",
    ],
    tips: [
      "You catch ~350-550 fish/hr depending on gear, premium, and specs. T7 gear ≈400/hr (40% Sturgeon, 60% butchered). T8 gear ≈450/hr (3/7 Sturgeon, 4/7 butchered). Each butchered fish yields ~15 chopped fish.",
      "Sell River Sturgeon and Puremist Snapper raw. Butcher T7-and-lower bycatch into chopped fish. Never chop Sturgeon (raw sells for far more).",
      "Puremist Snapper is the big swing factor on T7/T8 maps. Strong Snapper RNG on a normal school pushes a good hour into a great one.",
      "Do not cheap out on T7 gear long-term: T8 fisherman armor gives a significant fish-per-cast bonus and faster spec/journal progress.",
      "Pork Pie ×2 per hour grants +15% gathering yield (which also boosts fishing yield) and +30% carry weight, including on the safe escape build.",
      "If dismounted on the safe build, pop Flee on Miner's Workboots, then Ambush on the Assassin's Jacket to juke and remount your T3 horse.",
      "A single death with a full bag can wipe hours of profit. The calculator shows gear replacement plus death probability × carried fish value, not kit alone.",
      "Use Safe escape if you bank every ~12 min, Normal for ~22 min banking on GM gear, Greedy if you push deep roads with full T8 set.",
      "Puremist Snapper is the big swing factor. The calculator lists Snapper separately from Sturgeon/chops so you can see expected vs lucky hours.",
      "Portal time finding a good T8 road reduces effective fish/hr. A bad road or contested schools cut income even with max gear.",
      "Fort Sterling Cape gives CC reduction on geared tabs. Carry invisibility potions for dismount escapes.",
      "The fishing rod stays in your bag. Cast at schools without equipping it.",
    ],
    references: [
      {
        title: "GremmyAngler: Fishing on the Avalonian Roads (Beginners Guide)",
        url: "https://www.youtube.com/watch?v=sHCPd84O-50",
      },
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
      { label: "4-6 T8 houses (per 22h)", min: 120_000, max: 450_000 },
      { label: "8-12 T8 houses (per 22h)", min: 240_000, max: 900_000 },
      { label: "16 T8 houses, T7 journals (per 22h)", min: 450_000, max: 1_500_000 },
    ],
    requirements: [
      "Level 6 personal island with T8 laborer houses (three laborers per house, up to 16 houses)",
      "T8 bed per laborer and T8 table per four laborers (same tier as the laborer fills minimum happiness)",
      "T7 full journals, fill while gathering T7/T8 or buy filled journals on the market",
      "Optional: T8 general + specialty trophies if you later run T8 journals or trophy journals",
    ],
    steps: [
      "Upgrade island houses to T8 and hire T8 laborers of the matching specialty (prospector, lumberjack, cropper, etc.). Each house holds three laborers. Guild halls only sell T2 laborers; buy higher tiers on the market or level them with jobs.",
      "Furnish each T8 house: one T8 bed per laborer and one T8 table per four laborers across the island. Matching-tier furniture already returns 150% yield on T7 journals. Happiness rises over time once furniture is placed.",
      "Wait 30 minutes after hiring a new laborer before they can accept their first journal job (you can still buy empty journals from them immediately).",
      "Carry empty journals while you gather, craft, or kill mobs. Only base fame counts (premium fame bonus does not fill journals).",
      "Hand a full T7 journal to a T8 laborer of the same type. Each job takes 22 hours. A T8 laborer cannot take a journal above its own tier.",
      "Collect resources and the empty journal when the job finishes. Uncollected returns are deleted after 7 days.",
      "Repeat. Match laborer specialty to whatever activity you already do so journal filling costs nothing extra.",
    ],
    tips: [
      "Profit per journal ≈ (resource sell value + empty journal value) - full journal cost - listing tax on sells. Filling journals yourself removes the buy cost and is the most profitable approach.",
      "Each T8 laborer house holds three laborers. Island tiers in the calculator count houses, not individual laborers.",
      "Breakeven island spend: compare total T8 house + furniture cost to (profit per journal × journals per 22h cycle × 30). A full island often pays back over weeks, not hours.",
      "T8 bed + T8 table on a T8 laborer already hits 150% yield on T7 journals (wiki cap: min(150%, happiness ÷ 2)). Extra trophies mainly help T8 journals or trophy journal jobs.",
      "Gathering laborers return ~58 unrefined T7 resources per journal at 150%. Crafting laborers return ~6.6 refined mats total, split across bars/planks/cloth/leather by specialty (matches Albion Online Grind weights).",
      "Tinker is mostly planks (~44% of crafting return), plus smaller shares of bars, cloth, and leather. There is no item called Redleaf Leather; T7 leather is Reinforced Leather.",
      "Check market prices before buying filled journals; margins vary by city and journal tier.",
      "Other ways to profit: flip empty/full journals, craft with returned resources, pick up laborers as contracts to move or sell them, or level contracts for market resale.",
    ],
    profitBuild: {
      title: "Island Setup",
      description:
        "T8 bed and table in every house (trophies optional), processing T7 journals at 150% yield.",
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
          hint: "Optional T8 general trophy (+5 happiness each)",
        },
        {
          id: "T8_FURNITUREITEM_TROPHY_ORE",
          name: "Adamantium Ore Sample",
          hint: "Optional T8 prospector trophy (+10 happiness on prospectors)",
        },
        {
          id: "T7_JOURNAL_TROPHY_GENERAL_FULL",
          name: "Grandmaster's Generalist Trophy Journal (Full)",
          hint: "Optional job: fill on any fame, hand in for general trophy returns",
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
    references: [
      {
        title: "Albion Online Wiki: Laborer",
        url: "https://wiki.albiononline.com/wiki/Laborer",
      },
      {
        title: "Albion Online Wiki: Journal",
        url: "https://wiki.albiononline.com/wiki/Journal",
      },
      {
        title: "Albion Online Grind: Laborers Profit Calculator",
        url: "https://albiononlinegrind.com/laborers-profit-calculator",
      },
    ],
  },
  {
    slug: "potions-crafting-bulk",
    title: "Bulk Potion Crafting",
    description:
      "Craft T6 and T7 bulk potions at an alchemy lab and compare recipes in the calculator. Profit is measured per 10,000 focus (with focus) or per batch (without focus). Listing tax, sell strategy, and an adjustable station fee are included. Margins swing with buy prices and whether you sell on a normal week or hold for events.",
    category: "crafting",
    difficulty: "intermediate",
    zoneType: "safe",
    silverPerHour: { min: 80_000, max: 350_000 },
    requirements: [
      "T6 Alchemy with potions specialization (T7 spec for Gigantify, Resistance, and Sticky)",
      "T6+ alchemy lab at a royal city station in Bridgewatch (any public alchemist station works)",
      "Crafting focus for the recipes you plan to run with focus (see focus table in tips)",
      "Silver to buy herbs, eggs, milk, and alcohol; T7 Firetouched Mullein and Corn Hooch for war pots",
    ],
    steps: [
      "Early week: buy Elusive Foxglove, Goose Eggs, Sheep's Milk, Potato Schnapps, Brightleaf Comfrey, and Dragon Teasel in Bridgewatch (or wherever your city is cheapest). Saved calculator prices are Bridgewatch averages.",
      "Daily bulk (Mon-Wed): craft Major Healing Potion .1 with focus first. 72× Elusive Foxglove, 18× Goose Eggs, 18× Potato Schnapps, 45× Basic Arcane Extract per 5 pots (3,461 focus + 2,500 silver lab fee per batch).",
      "Compare Major Energy Potion .1 (4,188 focus) and Poison Potion (1,635 focus) in the calculator before spending leftover focus. Energy uses 72× foxglove, 18× milk, 18× schnapps, 45× basic extract; Poison uses 24× foxglove, 12× teasel, 12× comfrey, 6× milk.",
      "T5 starter path: craft Healing Potion (24× Crenellated Burdock + 6× Hen Eggs per 5) and Energy Potion (24× Crenellated Burdock + 6× Goat's Milk per 5) until T6 majors unlock.",
      "Thu-Sat before CTAs: craft Major Gigantify .1 (5,278 focus), Major Resistance .1 (6,368 focus), and Major Sticky (5,503 focus). Each makes 5 pots per batch with 72× mullein plus the foxglove, burdock, egg, milk, and corn hooch shown in the calculator.",
      "List pots in Bridgewatch 1 silver under the lowest sell order in stacks of 50. Use Sell normally in the calculator for a normal week, or Hold for events if you stock until CTAs or ZvZ.",
      "Profit = (potion sell price × 5 per craft) minus net material cost after lab returns minus listing tax. Recheck each recipe in the calculator before batching.",
    ],
    tips: [
      "Tested focus per batch of 5 pots: T6 Major Healing .1 = 3,461, .2 = 4,895 (+ 2,500 silver lab fee), Major Energy .1 = 4,188, .2 = 5,923, Poison 1,635; T7 Major Gigantify .1 = 5,278, .2 = 7,009, Major Resistance .1 = 6,368, .2 = 8,103, Major Sticky 5,503.",
      "Saved average prices in the calculator (Bridgewatch, tested): buy Foxglove 550, Goose Eggs 470, Sheep's Milk 450, Potato Schnapps 450, Brightleaf Comfrey 526, Dragon Teasel 530, Crenellated Burdock 545, Firetouched Mullein 580, Corn Hooch 514; sell Major Healing 10,100, Major Energy 9,000, Poison 6,000, Major Gigantify 14,000, Major Resistance 14,500, Major Sticky 14,000.",
      "Spend focus on whichever T6 recipe shows the best profit per 10,000 focus at your prices. Poison is often competitive because it costs less focus per batch.",
      "Major Gigantify, Resistance, and Sticky matter most Thu-Sat; stock 50-100 of each before alliance CTAs, not year-round.",
      "Buy Firetouched Mullein and Corn Hooch early in the week. T7 war-pot inputs spike harder than T6 foxglove.",
      "Goose Eggs are shared by Major Healing, Gigantify, and Sticky; buy one bulk stack when you run multiple recipes.",
      "The calculator defaults to With focus, Basic extract (.1), and Sell normally. Material return is 45% on focus crafts and 15% without focus. Toggle Hold for events to model CTA or ZvZ price spikes.",
      "Turn on Live prices in the header to pull hourly averages from the Albion Data Project; city picker applies when live is on.",
      "Carry an Alchemist's Journal while crafting for laborer returns from crafting fame.",
    ],
    profitBuild: {
      title: "Materials to Stock",
      description:
        "Buy herbs, eggs, milk, and alcohol where prices are lowest. Run T6 majors daily; stock mullein and corn hooch before ZvZ for Gigantify, Resistance, and Sticky.",
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
          id: "T1_ALCHEMY_EXTRACT_LEVEL1",
          name: "Basic Arcane Extract",
          quantity: 45,
          hint: "Per 5 .1 major pots",
        },
        {
          id: "T5_TEASEL",
          name: "Dragon Teasel",
          quantity: 12,
          hint: "Per 5 Poison Potions",
        },
        {
          id: "T3_COMFREY",
          name: "Brightleaf Comfrey",
          quantity: 12,
          hint: "Per 5 Poison Potions",
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
      ],
    },
    featured: false,
    readTime: 8,
  },
];

export const guides: Guide[] = attachGuideReliability(rawGuides).map((guide) => ({
  ...guide,
  defaultMarketCity: guideDefaultMarketCityBySlug[guide.slug],
  riskProfile: guideRiskProfileBySlug[guide.slug],
}));

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: Guide["category"]): Guide[] {
  return guides.filter((g) => g.category === category);
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured);
}
