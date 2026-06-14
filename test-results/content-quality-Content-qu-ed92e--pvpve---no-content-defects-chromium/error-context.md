# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: content-quality.spec.ts >> Content quality - no placeholder or broken text >> /guides/corrupted-dungeons-pvpve - no content defects
- Location: tests\e2e\content-quality.spec.ts:66:9

# Error details

```
Error: Double punctuation like "estimates.."

expect(received).not.toMatch(expected)

Expected pattern: not /[a-zA-Z]\.\./
Received string:      "Skip to content
Albion Silver
MONEY MAKING GUIDES
All Guides
Gathering
Crafting
Dungeons & PvE
Fishing
Laborers
Live prices
Albion server region for prices
West
Europe
Asia
Market city for prices
Average
Caerleon
Bridgewatch
Lymhurst
Martlock
Fort Sterling
Thetford
Premium
Feedback
Donate
Home
/
Guides
/
Dungeons & PvE
DUNGEONS & PVE
Advanced
Needs review
Last updated Jun 12, 2026
Risk / RNG heavy
9 min read

Needs review: Not reviewed enough yet. Treat profit numbers as estimates.. No test logs attached yet.

Corrupted Dungeons for PvPvE Profit

Run Stalker corrupted dungeons in red zones for souls and runes. Hunter (knockdown) is for learning; Stalker and Slayer are full-loot. Use this for the flow and invasion rules; real profit depends on win rate, deaths, market tax, and how often you get contested.

Average uses the median price across all six royal cities. This route was logged in Caerleon. Pick that city in the header for route-specific live prices.

PROFIT OUTCOMES / HR (AFTER TAX)

METRIC	TAKE-HOME/HR	MEANING
Conservative	295.7k	Bad luck, low spec, slower route, worse market
Median	372.9k	Typical session for a normal player
Expected value	372.9k	Includes rare drops mathematically
High-roll	475.2k	Lucky drop or strong session

EST. TAKE-HOME / HOUR (AFTER TAX)

372.9k

Before tax: 436k/hr

All skill levels (after tax): 295.7k - 475.2k/hr

Gross output

600.8k

YOUR SKILL LEVEL

Hunter (blue/yellow)
Stalker (red)
Slayer (black)

Full-loot Stalker runs; calculator models ~0.3 full-kit deaths/hr. Profit still swings with invasion win rate.

Recommended Gear

Loadout for Stalker (red)

Stalker Build (Red)

T6 Claymore burst build for red-zone corrupted PvPvE.

ARMOR & WEAPONS

Head
Main Hand
Armor
Shoes

CAPE, BAG & MOUNT

Cape

CONSUMABLES

×3
Potion
×2
Food

ALSO BRING

×2
Invisibility Potion
Item details
Loadout market value
337.6k silver

Includes consumables: 46k

Gear: 291.6k · Consumables: 46k

Profit breakdown

Calculated from 1-hour output at Stalker (red) yield. Standard listing tax (~10.5%). Site snapshot averages. Updated Jun 14, 2026, 4:04 PM.

1-HOUR OUTPUT (SELL VALUE)

ITEM	QTY/HR	UNIT	VALUE

Grandmaster's Soul
	88	
EST.
4.4k	387.2k

Master's Rune
	176	
EST.
140	24.6k

Elder's Soul
	18	
EST.
10.5k	189k

Gross output: 600.8k silver

1-HOUR INPUT COSTS

ITEM	QTY/HR	UNIT	VALUE

Master's Soldier Helmet (kit replacement)
	0.3	
EST.
52k	15.6k

Master's Mercenary Jacket (kit replacement)
	0.3	
EST.
82k	24.6k

Master's Soldier Boots (kit replacement)
	0.3	
EST.
48k	14.4k

Master's Claymore (kit replacement)
	0.3	
EST.
108k	32.4k

Adept's Thetford Cape (kit replacement)
	0.3	
EST.
42k	12.6k

Input cost: 99.6k silver

1-HOUR CONSUMABLES

ITEM	QTY/HR	UNIT	VALUE

Mutton Stew
	2	
EST.
1.3k	2.6k

Major Healing Potion
	3	
EST.
10.8k	32.4k

Invisibility Potion
	2	
EST.
15.2k	30.3k

Consumable cost: 65.3k silver

Gross output / hour
600.8k
Minus input costs
-99.6k
Minus consumables
-65.3k
Net before listing tax
436k
Minus Standard listing tax (~10.5%)
-63.1k
Est. take-home / hour
372.9k

Take-home = output sell value - input buys - consumables - ~10.5% Standard listing tax on gross output. Gather/fish yields are scaled down for no Premium. Deaths, repairs, and station fees are not included unless listed as inputs. Yields scale with your selected skill level.

Requirements
T6 Claymore burst build or equivalent 1v1 PvP setup
Hunter (yellow/blue, knockdown) to learn; Stalker (red/black, full loot) for profit; Slayer needs 100k+ infamy
Mutton Stew, healing pots, invisibility pots, budget per hour in calculator
Know invasion rules: fight, banish via shards, or reset with invis, you cannot fast-extract until the final boss is dead
Step-by-Step
1

Find a Corrupted Dungeon entrance in the open world (sinister solo portal) or use a corrupted map from the market.

2

At the entrance, choose Hunter (yellow/blue), Stalker (red/black), or Slayer (red/black, 100k+ infamy). Learn in Hunter until you clear reliably.

3

Optional: click the Demonic Shrine within 45 seconds if you want to sign up as an invader. Skipping it slightly lowers invasion odds.

4

Clear mobs for infamy until the final boss spawns. Loot Grandmaster's Souls and Elder's Souls from the chest; they are most of the run's value.

5

When invaded before the boss: duel if you have the advantage, or destroy three Demonic Shards (they appear on your minimap) to banish the invader for free. Killing the invader also ends further invasions for that run.

6

After the final boss dies, invasions stop. Exit normally or chain through the post-boss portal. Bank after each chest. Stalker deaths are full loot.

7

Sell souls and runes on Caerleon. List 1 silver under the lowest sell order during prime hours; subtract ~6.5% listing tax (Premium) from your margin.

Pro Tips
★
Stalker pays much more than Hunter but is full-loot PvP, only run it when your invasion win rate is solid.
★
Demonic Shards are breakable objects that spawn on invasion. Destroy three to eject the invader. They cost no silver; that is the intended banish mechanic.
★
You can be invaded even if you skip the entrance shrine. Signing the contract only affects your chance to become the invader.
★
Healing is reduced 40% in Corrupted Dungeons, burst and shard-banish plays often beat trying to out-heal a geared invader.
★
Slayer is for high-infamy veterans; higher IP cap and T8 mobs, but death risk dwarfs the extra loot for most farmers.
★
Never chain runs with a full inventory. One death loses the chest and your kit on Stalker/Slayer.
★
The profit calculator already subtracts ~6.5% Premium listing tax from sell value. Undercutting sell orders eats into the margin on top of that.
★
Stalker gear losses swing your hourly. At ~290k kit value, the calculator assumes ~0.3 deaths/hour (~85k/hr); aggressive or unlucky sessions lose multiples of that plus the chest loot on each death.
★
Bank after each chest when possible. Real hourly profit swings with invasion frequency, win rate, loot RNG, and infamy tier.
Related Guides
DUNGEONS & PVE
Advanced
Dangerous Zones
Risk / RNG heavy
Needs review
Last updated Jun 14, 2026
Solo Dungeon Maps

Buy solo dungeon maps from the market, open a private dungeon entrance, and farm silver in a dedicated instance with no competition. Accessible from ~1100 IP (T6 maps) up to 1540+ IP (T8.2 maps). A logged 2.5-hour session at 1540 IP with 20 T8.2 maps produced 4.2M gross loot before listing tax. Unlike free open-world spawns, maps stay in the zone you open them, and you can chain runs back-to-back without waiting.

PROFIT RANGE / HR

887.7k – 1.2m/hr· saved prices

8 min read →
DUNGEONS & PVE
Advanced
Dangerous Zones
Risk / RNG heavy
Needs review
Last updated Jun 13, 2026
Abyssal Depths Silver Farming

Run The Depths from any royal city's Antiquarian's Den: orange-zone PvE/PvP with collapsing floors, souls, and stacking buffs. The calculator models win rate, solo/duo/trio queue time, run duration, floor extract depth, optional PvP loot, and bag-only death loss. Gear stays equipped on death.

PROFIT RANGE / HR

180.3k – 508.1k/hr· saved prices

13 min read →
Albion Silver

Community-driven money making guides for Albion Online. Learn proven strategies to grow your silver stack, from safe gathering routes to high-risk corrupted dungeons.

Feedback
Support this site
CATEGORIES
Gathering
Crafting
Dungeons & PvE
Fishing
Laborers
DISCLAIMER

Silver/hour estimates are approximate and vary by server, patch, and player skill. This is a fan site, not affiliated with Sandbox Interactive.

Copyright © 2026 Kazem Abou Setta. This project is free software licensed under the GNU General Public License v3.0 or later. You may redistribute and modify it under those terms. There is no warranty.

Source code · LICENSE file · GPLv3 on gnu.org · Albion Silver Guides · Fan-made project"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - link "Albion Silver Money Making Guides" [ref=e6] [cursor=pointer]:
          - /url: /
          - generic [ref=e7]:
            - generic [ref=e8]: Albion Silver
            - generic [ref=e9]: Money Making Guides
        - navigation "Main" [ref=e10]:
          - generic [ref=e11]:
            - link "All Guides" [ref=e12] [cursor=pointer]:
              - /url: /guides
              - text: All Guides
              - img [ref=e13]
            - menu:
              - generic:
                - menuitem: Gathering
                - menuitem: Crafting
                - menuitem: Dungeons & PvE
                - menuitem: Fishing
                - menuitem: Laborers
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic "Live prices from Albion Online Data Project (West, Europe, or Asia server), refreshed about hourly. Off uses site snapshot averages." [ref=e17] [cursor=pointer]:
            - checkbox "Use live market prices" [ref=e18]
            - generic [ref=e19]: Live prices
          - generic "Enable live prices to pick a server region" [ref=e21]:
            - generic [ref=e22]: Albion server region for prices
            - generic [ref=e23]:
              - combobox "Albion server region for prices" [disabled] [ref=e24] [cursor=pointer]:
                - option "West" [disabled] [selected]
                - option "Europe" [disabled]
                - option "Asia" [disabled]
              - img
          - generic "Enable live prices to pick a market city" [ref=e26]:
            - generic [ref=e27]: Market city for prices
            - generic [ref=e28]:
              - combobox "Market city for prices" [disabled] [ref=e29] [cursor=pointer]:
                - option "Average" [disabled] [selected]
                - option "Caerleon" [disabled]
                - option "Bridgewatch" [disabled]
                - option "Lymhurst" [disabled]
                - option "Martlock" [disabled]
                - option "Fort Sterling" [disabled]
                - option "Thetford" [disabled]
              - img
          - 'generic "No Premium: 10.5% listing tax, no gather/fish bonus" [ref=e31] [cursor=pointer]':
            - checkbox "Premium account" [ref=e32]
            - generic [ref=e33]: Premium
        - button "Switch to light theme" [ref=e34]:
          - img [ref=e35]
        - button "Feedback" [ref=e38]
        - link "Donate" [ref=e39] [cursor=pointer]:
          - /url: https://www.paypal.me/kazemsam
  - main [ref=e40]:
    - article [ref=e41]:
      - navigation "Breadcrumb" [ref=e42]:
        - list [ref=e43]:
          - listitem [ref=e44]:
            - link "Home" [ref=e45] [cursor=pointer]:
              - /url: /
          - listitem [ref=e46]: /
          - listitem [ref=e47]:
            - link "Guides" [ref=e48] [cursor=pointer]:
              - /url: /guides
          - listitem [ref=e49]: /
          - listitem [ref=e50]:
            - link "Dungeons & PvE" [ref=e51] [cursor=pointer]:
              - /url: /guides?category=dungeons
      - generic [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: Dungeons & PvE
          - generic [ref=e55]: Advanced
          - generic "Not reviewed enough yet. Treat profit numbers as estimates." [ref=e56]: Needs review
          - generic "Last updated 2026-06-12" [ref=e57]: Last updated Jun 12, 2026
          - generic [ref=e58]: Risk / RNG heavy
          - generic [ref=e59]: 9 min read
        - paragraph [ref=e60]: "Needs review: Not reviewed enough yet. Treat profit numbers as estimates.. No test logs attached yet."
        - heading "Corrupted Dungeons for PvPvE Profit" [level=1] [ref=e61]
        - paragraph [ref=e62]: Run Stalker corrupted dungeons in red zones for souls and runes. Hunter (knockdown) is for learning; Stalker and Slayer are full-loot. Use this for the flow and invasion rules; real profit depends on win rate, deaths, market tax, and how often you get contested.
      - paragraph [ref=e63]:
        - text: Average uses the median price across all six royal cities. This route was logged in
        - button "Caerleon" [ref=e64]
        - text: . Pick that city in the header for route-specific live prices.
      - generic [ref=e65]:
        - paragraph [ref=e66]: Profit outcomes / hr (after tax)
        - table [ref=e69]:
          - rowgroup [ref=e70]:
            - row "Metric Take-home/hr Meaning" [ref=e71]:
              - columnheader "Metric" [ref=e72]
              - columnheader "Take-home/hr" [ref=e73]
              - columnheader "Meaning" [ref=e74]
          - rowgroup [ref=e75]:
            - row "Conservative 295.7k Bad luck, low spec, slower route, worse market" [ref=e76]:
              - cell "Conservative" [ref=e77]
              - cell "295.7k" [ref=e78]
              - cell "Bad luck, low spec, slower route, worse market" [ref=e79]
            - row "Median 372.9k Typical session for a normal player" [ref=e80]:
              - cell "Median" [ref=e81]
              - cell "372.9k" [ref=e82]
              - cell "Typical session for a normal player" [ref=e83]
            - row "Expected value 372.9k Includes rare drops mathematically" [ref=e84]:
              - cell "Expected value" [ref=e85]
              - cell "372.9k" [ref=e86]
              - cell "Includes rare drops mathematically" [ref=e87]
            - row "High-roll 475.2k Lucky drop or strong session" [ref=e88]:
              - cell "High-roll" [ref=e89]
              - cell "475.2k" [ref=e90]
              - cell "Lucky drop or strong session" [ref=e91]
      - generic [ref=e92]:
        - generic [ref=e93]:
          - generic [ref=e94]:
            - paragraph [ref=e95]: Est. take-home / hour (after tax)
            - paragraph [ref=e96]: 372.9k
            - paragraph [ref=e97]: "Before tax: 436k/hr"
            - paragraph [ref=e98]: "All skill levels (after tax): 295.7k - 475.2k/hr"
          - generic [ref=e99]:
            - paragraph [ref=e100]: Gross output
            - paragraph [ref=e101]: 600.8k
        - generic [ref=e102]:
          - paragraph [ref=e103]: Your skill level
          - radiogroup "Skill level" [ref=e104]:
            - radio "Hunter (blue/yellow)" [ref=e105]
            - radio "Stalker (red)" [checked] [ref=e106]
            - radio "Slayer (black)" [ref=e107]
          - paragraph [ref=e108]: Full-loot Stalker runs; calculator models ~0.3 full-kit deaths/hr. Profit still swings with invasion win rate.
      - generic [ref=e109]:
        - heading "Recommended Gear" [level=2] [ref=e110]
        - paragraph [ref=e111]: Loadout for Stalker (red)
        - generic [ref=e113]:
          - heading "Stalker Build (Red)" [level=3] [ref=e114]
          - paragraph [ref=e115]: T6 Claymore burst build for red-zone corrupted PvPvE.
          - generic [ref=e116]:
            - generic [ref=e117]:
              - paragraph [ref=e118]: Armor & Weapons
              - generic [ref=e119]:
                - generic [ref=e120]:
                  - generic "Master's Soldier Helmet" [ref=e121]
                  - generic "Master's Soldier Helmet" [ref=e122]: Head
                - generic [ref=e123]:
                  - generic "Master's Claymore" [ref=e124]
                  - generic "Master's Claymore" [ref=e125]: Main Hand
                - generic [ref=e126]:
                  - generic "Master's Mercenary Jacket" [ref=e127]
                  - generic "Master's Mercenary Jacket" [ref=e128]: Armor
                - generic [ref=e129]:
                  - generic "Master's Soldier Boots" [ref=e130]
                  - generic "Master's Soldier Boots" [ref=e131]: Shoes
            - generic [ref=e132]:
              - paragraph [ref=e133]: Cape, Bag & Mount
              - generic [ref=e135]:
                - generic "Adept's Thetford Cape" [ref=e136]
                - generic "Adept's Thetford Cape" [ref=e137]: Cape
            - generic [ref=e138]:
              - paragraph [ref=e139]: Consumables
              - generic [ref=e140]:
                - generic [ref=e141]:
                  - generic "Major Healing Potion ×3" [ref=e142]:
                    - generic [ref=e143]: ×3
                  - generic "Major Healing Potion" [ref=e144]: Potion
                - generic [ref=e145]:
                  - generic "Mutton Stew ×2" [ref=e146]:
                    - generic [ref=e147]: ×2
                  - generic "Mutton Stew" [ref=e148]: Food
          - generic [ref=e149]:
            - paragraph [ref=e150]: Also Bring
            - generic [ref=e152]:
              - generic "Invisibility Potion ×2" [ref=e153]:
                - generic [ref=e154]: ×2
              - generic "Invisibility Potion" [ref=e155]
          - group [ref=e156]:
            - generic "Item details" [ref=e157] [cursor=pointer]
          - generic [ref=e158]:
            - generic [ref=e159]:
              - generic [ref=e160]: Loadout market value
              - generic [ref=e161]: 337.6k silver
            - paragraph [ref=e162]: "Includes consumables: 46k"
            - paragraph [ref=e163]:
              - generic [ref=e164]: "Gear: 291.6k"
              - text: ·
              - generic [ref=e165]: "Consumables: 46k"
      - generic [ref=e166]:
        - heading "Profit breakdown" [level=2] [ref=e167]
        - paragraph [ref=e168]: Calculated from 1-hour output at Stalker (red) yield. Standard listing tax (~10.5%). Site snapshot averages. Updated Jun 14, 2026, 4:04 PM.
        - generic [ref=e169]:
          - paragraph [ref=e170]: 1-Hour Output (sell value)
          - table [ref=e172]:
            - rowgroup [ref=e173]:
              - row "Item Qty/hr Unit Value" [ref=e174]:
                - columnheader "Item" [ref=e175]
                - columnheader "Qty/hr" [ref=e176]
                - columnheader "Unit" [ref=e177]
                - columnheader "Value" [ref=e178]
            - rowgroup [ref=e179]:
              - row "Grandmaster's Soul 88 est. 4.4k 387.2k" [ref=e180]:
                - cell "Grandmaster's Soul" [ref=e181]:
                  - generic [ref=e182]:
                    - generic "Grandmaster's Soul" [ref=e183]
                    - generic [ref=e184]: Grandmaster's Soul
                - cell "88" [ref=e185]
                - cell "est. 4.4k" [ref=e186]:
                  - generic [ref=e187]:
                    - generic "Saved price snapshot (not live market)" [ref=e188]: est.
                    - text: 4.4k
                - cell "387.2k" [ref=e189]
              - row "Master's Rune 176 est. 140 24.6k" [ref=e190]:
                - cell "Master's Rune" [ref=e191]:
                  - generic [ref=e192]:
                    - generic "Master's Rune" [ref=e193]
                    - generic [ref=e194]: Master's Rune
                - cell "176" [ref=e195]
                - cell "est. 140" [ref=e196]:
                  - generic [ref=e197]:
                    - generic "Saved price snapshot (not live market)" [ref=e198]: est.
                    - text: "140"
                - cell "24.6k" [ref=e199]
              - row "Elder's Soul 18 est. 10.5k 189k" [ref=e200]:
                - cell "Elder's Soul" [ref=e201]:
                  - generic [ref=e202]:
                    - generic "Elder's Soul" [ref=e203]
                    - generic [ref=e204]: Elder's Soul
                - cell "18" [ref=e205]
                - cell "est. 10.5k" [ref=e206]:
                  - generic [ref=e207]:
                    - generic "Saved price snapshot (not live market)" [ref=e208]: est.
                    - text: 10.5k
                - cell "189k" [ref=e209]
          - paragraph [ref=e210]: "Gross output: 600.8k silver"
        - generic [ref=e211]:
          - paragraph [ref=e212]: 1-Hour Input Costs
          - table [ref=e214]:
            - rowgroup [ref=e215]:
              - row "Item Qty/hr Unit Value" [ref=e216]:
                - columnheader "Item" [ref=e217]
                - columnheader "Qty/hr" [ref=e218]
                - columnheader "Unit" [ref=e219]
                - columnheader "Value" [ref=e220]
            - rowgroup [ref=e221]:
              - row "Master's Soldier Helmet (kit replacement) 0.3 est. 52k 15.6k" [ref=e222]:
                - cell "Master's Soldier Helmet (kit replacement)" [ref=e223]:
                  - generic [ref=e224]:
                    - generic "Master's Soldier Helmet (kit replacement)" [ref=e225]
                    - generic [ref=e226]: Master's Soldier Helmet (kit replacement)
                - cell "0.3" [ref=e227]
                - cell "est. 52k" [ref=e228]:
                  - generic [ref=e229]:
                    - generic "Saved price snapshot (not live market)" [ref=e230]: est.
                    - text: 52k
                - cell "15.6k" [ref=e231]
              - row "Master's Mercenary Jacket (kit replacement) 0.3 est. 82k 24.6k" [ref=e232]:
                - cell "Master's Mercenary Jacket (kit replacement)" [ref=e233]:
                  - generic [ref=e234]:
                    - generic "Master's Mercenary Jacket (kit replacement)" [ref=e235]
                    - generic [ref=e236]: Master's Mercenary Jacket (kit replacement)
                - cell "0.3" [ref=e237]
                - cell "est. 82k" [ref=e238]:
                  - generic [ref=e239]:
                    - generic "Saved price snapshot (not live market)" [ref=e240]: est.
                    - text: 82k
                - cell "24.6k" [ref=e241]
              - row "Master's Soldier Boots (kit replacement) 0.3 est. 48k 14.4k" [ref=e242]:
                - cell "Master's Soldier Boots (kit replacement)" [ref=e243]:
                  - generic [ref=e244]:
                    - generic "Master's Soldier Boots (kit replacement)" [ref=e245]
                    - generic [ref=e246]: Master's Soldier Boots (kit replacement)
                - cell "0.3" [ref=e247]
                - cell "est. 48k" [ref=e248]:
                  - generic [ref=e249]:
                    - generic "Saved price snapshot (not live market)" [ref=e250]: est.
                    - text: 48k
                - cell "14.4k" [ref=e251]
              - row "Master's Claymore (kit replacement) 0.3 est. 108k 32.4k" [ref=e252]:
                - cell "Master's Claymore (kit replacement)" [ref=e253]:
                  - generic [ref=e254]:
                    - generic "Master's Claymore (kit replacement)" [ref=e255]
                    - generic [ref=e256]: Master's Claymore (kit replacement)
                - cell "0.3" [ref=e257]
                - cell "est. 108k" [ref=e258]:
                  - generic [ref=e259]:
                    - generic "Saved price snapshot (not live market)" [ref=e260]: est.
                    - text: 108k
                - cell "32.4k" [ref=e261]
              - row "Adept's Thetford Cape (kit replacement) 0.3 est. 42k 12.6k" [ref=e262]:
                - cell "Adept's Thetford Cape (kit replacement)" [ref=e263]:
                  - generic [ref=e264]:
                    - generic "Adept's Thetford Cape (kit replacement)" [ref=e265]
                    - generic [ref=e266]: Adept's Thetford Cape (kit replacement)
                - cell "0.3" [ref=e267]
                - cell "est. 42k" [ref=e268]:
                  - generic [ref=e269]:
                    - generic "Saved price snapshot (not live market)" [ref=e270]: est.
                    - text: 42k
                - cell "12.6k" [ref=e271]
          - paragraph [ref=e272]: "Input cost: 99.6k silver"
        - generic [ref=e273]:
          - paragraph [ref=e274]: 1-Hour Consumables
          - table [ref=e276]:
            - rowgroup [ref=e277]:
              - row "Item Qty/hr Unit Value" [ref=e278]:
                - columnheader "Item" [ref=e279]
                - columnheader "Qty/hr" [ref=e280]
                - columnheader "Unit" [ref=e281]
                - columnheader "Value" [ref=e282]
            - rowgroup [ref=e283]:
              - row "Mutton Stew 2 est. 1.3k 2.6k" [ref=e284]:
                - cell "Mutton Stew" [ref=e285]:
                  - generic [ref=e286]:
                    - generic "Mutton Stew" [ref=e287]
                    - generic [ref=e288]: Mutton Stew
                - cell "2" [ref=e289]
                - cell "est. 1.3k" [ref=e290]:
                  - generic [ref=e291]:
                    - generic "Saved price snapshot (not live market)" [ref=e292]: est.
                    - text: 1.3k
                - cell "2.6k" [ref=e293]
              - row "Major Healing Potion 3 est. 10.8k 32.4k" [ref=e294]:
                - cell "Major Healing Potion" [ref=e295]:
                  - generic [ref=e296]:
                    - generic "Major Healing Potion" [ref=e297]
                    - generic [ref=e298]: Major Healing Potion
                - cell "3" [ref=e299]
                - cell "est. 10.8k" [ref=e300]:
                  - generic [ref=e301]:
                    - generic "Saved price snapshot (not live market)" [ref=e302]: est.
                    - text: 10.8k
                - cell "32.4k" [ref=e303]
              - row "Invisibility Potion 2 est. 15.2k 30.3k" [ref=e304]:
                - cell "Invisibility Potion" [ref=e305]:
                  - generic [ref=e306]:
                    - generic "Invisibility Potion" [ref=e307]
                    - generic [ref=e308]: Invisibility Potion
                - cell "2" [ref=e309]
                - cell "est. 15.2k" [ref=e310]:
                  - generic [ref=e311]:
                    - generic "Saved price snapshot (not live market)" [ref=e312]: est.
                    - text: 15.2k
                - cell "30.3k" [ref=e313]
          - paragraph [ref=e314]: "Consumable cost: 65.3k silver"
        - generic [ref=e315]:
          - generic [ref=e316]:
            - generic [ref=e317]: Gross output / hour
            - generic [ref=e318]: 600.8k
          - generic [ref=e319]:
            - generic [ref=e320]: Minus input costs
            - generic [ref=e321]: "-99.6k"
          - generic [ref=e322]:
            - generic [ref=e323]: Minus consumables
            - generic [ref=e324]: "-65.3k"
          - generic [ref=e325]:
            - generic [ref=e326]: Net before listing tax
            - generic [ref=e327]: 436k
          - generic [ref=e328]:
            - generic [ref=e329]: Minus Standard listing tax (~10.5%)
            - generic [ref=e330]: "-63.1k"
          - generic [ref=e331]:
            - generic [ref=e332]: Est. take-home / hour
            - generic [ref=e333]: 372.9k
        - paragraph [ref=e334]: Take-home = output sell value - input buys - consumables - ~10.5% Standard listing tax on gross output. Gather/fish yields are scaled down for no Premium. Deaths, repairs, and station fees are not included unless listed as inputs. Yields scale with your selected skill level.
      - generic [ref=e335]:
        - heading "Requirements" [level=2] [ref=e336]
        - list [ref=e337]:
          - listitem [ref=e338]: T6 Claymore burst build or equivalent 1v1 PvP setup
          - listitem [ref=e340]: Hunter (yellow/blue, knockdown) to learn; Stalker (red/black, full loot) for profit; Slayer needs 100k+ infamy
          - listitem [ref=e342]: Mutton Stew, healing pots, invisibility pots, budget per hour in calculator
          - listitem [ref=e344]: "Know invasion rules: fight, banish via shards, or reset with invis, you cannot fast-extract until the final boss is dead"
      - generic [ref=e346]:
        - heading "Step-by-Step" [level=2] [ref=e347]
        - list [ref=e348]:
          - listitem [ref=e349]:
            - generic [ref=e350]: "1"
            - paragraph [ref=e351]: Find a Corrupted Dungeon entrance in the open world (sinister solo portal) or use a corrupted map from the market.
          - listitem [ref=e352]:
            - generic [ref=e353]: "2"
            - paragraph [ref=e354]: At the entrance, choose Hunter (yellow/blue), Stalker (red/black), or Slayer (red/black, 100k+ infamy). Learn in Hunter until you clear reliably.
          - listitem [ref=e355]:
            - generic [ref=e356]: "3"
            - paragraph [ref=e357]: "Optional: click the Demonic Shrine within 45 seconds if you want to sign up as an invader. Skipping it slightly lowers invasion odds."
          - listitem [ref=e358]:
            - generic [ref=e359]: "4"
            - paragraph [ref=e360]: Clear mobs for infamy until the final boss spawns. Loot Grandmaster's Souls and Elder's Souls from the chest; they are most of the run's value.
          - listitem [ref=e361]:
            - generic [ref=e362]: "5"
            - paragraph [ref=e363]: "When invaded before the boss: duel if you have the advantage, or destroy three Demonic Shards (they appear on your minimap) to banish the invader for free. Killing the invader also ends further invasions for that run."
          - listitem [ref=e364]:
            - generic [ref=e365]: "6"
            - paragraph [ref=e366]: After the final boss dies, invasions stop. Exit normally or chain through the post-boss portal. Bank after each chest. Stalker deaths are full loot.
          - listitem [ref=e367]:
            - generic [ref=e368]: "7"
            - paragraph [ref=e369]: Sell souls and runes on Caerleon. List 1 silver under the lowest sell order during prime hours; subtract ~6.5% listing tax (Premium) from your margin.
      - generic [ref=e370]:
        - heading "Pro Tips" [level=2] [ref=e371]
        - list [ref=e372]:
          - listitem [ref=e373]:
            - generic [ref=e374]: ★
            - text: Stalker pays much more than Hunter but is full-loot PvP, only run it when your invasion win rate is solid.
          - listitem [ref=e375]:
            - generic [ref=e376]: ★
            - text: Demonic Shards are breakable objects that spawn on invasion. Destroy three to eject the invader. They cost no silver; that is the intended banish mechanic.
          - listitem [ref=e377]:
            - generic [ref=e378]: ★
            - text: You can be invaded even if you skip the entrance shrine. Signing the contract only affects your chance to become the invader.
          - listitem [ref=e379]:
            - generic [ref=e380]: ★
            - text: Healing is reduced 40% in Corrupted Dungeons, burst and shard-banish plays often beat trying to out-heal a geared invader.
          - listitem [ref=e381]:
            - generic [ref=e382]: ★
            - text: Slayer is for high-infamy veterans; higher IP cap and T8 mobs, but death risk dwarfs the extra loot for most farmers.
          - listitem [ref=e383]:
            - generic [ref=e384]: ★
            - text: Never chain runs with a full inventory. One death loses the chest and your kit on Stalker/Slayer.
          - listitem [ref=e385]:
            - generic [ref=e386]: ★
            - text: The profit calculator already subtracts ~6.5% Premium listing tax from sell value. Undercutting sell orders eats into the margin on top of that.
          - listitem [ref=e387]:
            - generic [ref=e388]: ★
            - text: Stalker gear losses swing your hourly. At ~290k kit value, the calculator assumes ~0.3 deaths/hour (~85k/hr); aggressive or unlucky sessions lose multiples of that plus the chest loot on each death.
          - listitem [ref=e389]:
            - generic [ref=e390]: ★
            - text: Bank after each chest when possible. Real hourly profit swings with invasion frequency, win rate, loot RNG, and infamy tier.
      - generic [ref=e391]:
        - heading "Related Guides" [level=2] [ref=e392]
        - generic [ref=e393]:
          - link "Dungeons & PvE Advanced Dangerous Zones Risk / RNG heavy Needs review Last updated Jun 14, 2026 Solo Dungeon Maps Buy solo dungeon maps from the market, open a private dungeon entrance, and farm silver in a dedicated instance with no competition. Accessible from ~1100 IP (T6 maps) up to 1540+ IP (T8.2 maps). A logged 2.5-hour session at 1540 IP with 20 T8.2 maps produced 4.2M gross loot before listing tax. Unlike free open-world spawns, maps stay in the zone you open them, and you can chain runs back-to-back without waiting. Profit range / hr 887.7k – 1.2m/hr· saved prices 8 min read →" [ref=e394] [cursor=pointer]:
            - /url: /guides/dungeon-maps-solo
            - generic [ref=e395]:
              - generic [ref=e396]: Dungeons & PvE
              - generic [ref=e397]: Advanced
              - generic [ref=e398]: Dangerous Zones
              - generic [ref=e399]: Risk / RNG heavy
              - generic "Not reviewed enough yet. Treat profit numbers as estimates." [ref=e400]: Needs review
              - generic "Last updated 2026-06-14" [ref=e401]: Last updated Jun 14, 2026
            - heading "Solo Dungeon Maps" [level=3] [ref=e402]
            - paragraph [ref=e403]: Buy solo dungeon maps from the market, open a private dungeon entrance, and farm silver in a dedicated instance with no competition. Accessible from ~1100 IP (T6 maps) up to 1540+ IP (T8.2 maps). A logged 2.5-hour session at 1540 IP with 20 T8.2 maps produced 4.2M gross loot before listing tax. Unlike free open-world spawns, maps stay in the zone you open them, and you can chain runs back-to-back without waiting.
            - generic [ref=e404]:
              - text: Profit range / hr
              - paragraph [ref=e405]:
                - text: 887.7k – 1.2m/hr
                - generic [ref=e406]: · saved prices
              - generic [ref=e408]: 8 min read →
          - 'link "Dungeons & PvE Advanced Dangerous Zones Risk / RNG heavy Needs review Last updated Jun 13, 2026 Abyssal Depths Silver Farming Run The Depths from any royal city''s Antiquarian''s Den: orange-zone PvE/PvP with collapsing floors, souls, and stacking buffs. The calculator models win rate, solo/duo/trio queue time, run duration, floor extract depth, optional PvP loot, and bag-only death loss. Gear stays equipped on death. Profit range / hr 180.3k – 508.1k/hr· saved prices 13 min read →" [ref=e409] [cursor=pointer]':
            - /url: /guides/abyssal-depths-farming
            - generic [ref=e410]:
              - generic [ref=e411]: Dungeons & PvE
              - generic [ref=e412]: Advanced
              - generic [ref=e413]: Dangerous Zones
              - generic [ref=e414]: Risk / RNG heavy
              - generic "Not reviewed enough yet. Treat profit numbers as estimates." [ref=e415]: Needs review
              - generic "Last updated 2026-06-13" [ref=e416]: Last updated Jun 13, 2026
            - heading "Abyssal Depths Silver Farming" [level=3] [ref=e417]
            - paragraph [ref=e418]: "Run The Depths from any royal city's Antiquarian's Den: orange-zone PvE/PvP with collapsing floors, souls, and stacking buffs. The calculator models win rate, solo/duo/trio queue time, run duration, floor extract depth, optional PvP loot, and bag-only death loss. Gear stays equipped on death."
            - generic [ref=e419]:
              - text: Profit range / hr
              - paragraph [ref=e420]:
                - text: 180.3k – 508.1k/hr
                - generic [ref=e421]: · saved prices
              - generic [ref=e423]: 13 min read →
  - contentinfo [ref=e424]:
    - generic [ref=e425]:
      - generic [ref=e426]:
        - generic [ref=e427]:
          - heading "Albion Silver" [level=3] [ref=e428]
          - paragraph [ref=e429]: Community-driven money making guides for Albion Online. Learn proven strategies to grow your silver stack, from safe gathering routes to high-risk corrupted dungeons.
          - generic [ref=e430]:
            - button "Feedback" [ref=e431]
            - link "Support this site" [ref=e432] [cursor=pointer]:
              - /url: https://www.paypal.me/kazemsam
        - generic [ref=e433]:
          - heading "Categories" [level=4] [ref=e434]
          - list [ref=e435]:
            - listitem [ref=e436]:
              - link "Gathering" [ref=e437] [cursor=pointer]:
                - /url: /guides?category=gathering
            - listitem [ref=e438]:
              - link "Crafting" [ref=e439] [cursor=pointer]:
                - /url: /guides?category=crafting
            - listitem [ref=e440]:
              - link "Dungeons & PvE" [ref=e441] [cursor=pointer]:
                - /url: /guides?category=dungeons
            - listitem [ref=e442]:
              - link "Fishing" [ref=e443] [cursor=pointer]:
                - /url: /guides?category=fishing
            - listitem [ref=e444]:
              - link "Laborers" [ref=e445] [cursor=pointer]:
                - /url: /guides?category=laborers
        - generic [ref=e446]:
          - heading "Disclaimer" [level=4] [ref=e447]
          - paragraph [ref=e448]: Silver/hour estimates are approximate and vary by server, patch, and player skill. This is a fan site, not affiliated with Sandbox Interactive.
      - generic [ref=e449]:
        - paragraph [ref=e450]:
          - text: Copyright © 2026 Kazem Abou Setta. This project is free software licensed under the
          - link "GNU General Public License v3.0 or later" [ref=e451] [cursor=pointer]:
            - /url: /license
          - text: . You may redistribute and modify it under those terms. There is no warranty.
        - paragraph [ref=e452]:
          - link "Source code" [ref=e453] [cursor=pointer]:
            - /url: https://github.com/kazemsami/albion-silver-guides
          - text: ·
          - link "LICENSE file" [ref=e454] [cursor=pointer]:
            - /url: https://github.com/kazemsami/albion-silver-guides/blob/main/LICENSE
          - text: ·
          - link "GPLv3 on gnu.org" [ref=e455] [cursor=pointer]:
            - /url: https://www.gnu.org/licenses/gpl-3.0.html
          - text: · Albion Silver Guides · Fan-made project
  - alert [ref=e456]
```

# Test source

```ts
  1   | /**
  2   |  * Content quality tests.
  3   |  * Scans visible text on all guide pages for known content bugs:
  4   |  * broken placeholders, double punctuation, bad list numbering, etc.
  5   |  */
  6   | import { test, expect } from "@playwright/test";
  7   | import { GUIDE_SLUGS, CATEGORIES, blockLivePriceApis } from "./helpers";
  8   | 
  9   | const ALL_ROUTES = [
  10  |   "/",
  11  |   "/guides",
  12  |   ...CATEGORIES.map((c) => `/guides?category=${c}`),
  13  |   ...GUIDE_SLUGS.map((s) => `/guides/${s}`),
  14  | ];
  15  | 
  16  | /** Forbidden patterns in visible page text.  Each entry has a pattern and a
  17  |  *  human-readable reason for the test failure message. */
  18  | const CONTENT_CHECKS: Array<{ pattern: RegExp; reason: string }> = [
  19  |   {
  20  |     pattern: /\bNaN\b/,
  21  |     reason: "NaN rendered in page text - likely a missing number calculation",
  22  |   },
  23  |   {
  24  |     pattern: /\bundefined\b/,
  25  |     reason: "undefined rendered in page text - likely a missing data field",
  26  |   },
  27  |   {
  28  |     pattern: /\[object Object\]/,
  29  |     reason: "[object Object] rendered - object serialisation error",
  30  |   },
  31  |   {
  32  |     pattern: /guide s\b/i,
  33  |     reason: 'Broken pluralisation: "guide s"',
  34  |   },
  35  |   {
  36  |     pattern: /\bPotion s\b/,
  37  |     reason: 'Broken pluralisation: "Potion s"',
  38  |   },
  39  |   {
  40  |     pattern: /\{\{/,
  41  |     reason: "Unresolved template marker {{",
  42  |   },
  43  |   {
  44  |     pattern: /Loading filters…/,
  45  |     reason: 'SSR rendered "Loading filters…" placeholder',
  46  |   },
  47  |   {
  48  |     // Double punctuation: two periods not preceded by a digit (so "1.2.3." is ok,
  49  |     // "profits.." is not).
  50  |     pattern: /[a-zA-Z]\.\./,
  51  |     reason: 'Double punctuation like "estimates.."',
  52  |   },
  53  |   {
  54  |     // Ordered list items where the same number appears twice in a row like "1. 1."
  55  |     pattern: /\b(\d+)\.\s+\1\./,
  56  |     reason: "Duplicated ordered-list numbers like \"1. 1.\"",
  57  |   },
  58  | ];
  59  | 
  60  | test.describe("Content quality - no placeholder or broken text", () => {
  61  |   test.beforeEach(async ({ page }) => {
  62  |     await blockLivePriceApis(page);
  63  |   });
  64  | 
  65  |   for (const route of ALL_ROUTES) {
  66  |     test(`${route} - no content defects`, async ({ page }) => {
  67  |       await page.goto(route);
  68  |       // Wait for main content
  69  |       await page.waitForSelector("main, article, [role='main']", {
  70  |         timeout: 10_000,
  71  |       }).catch(() => null);
  72  | 
  73  |       const text = await page.locator("body").innerText();
  74  | 
  75  |       for (const { pattern, reason } of CONTENT_CHECKS) {
> 76  |         expect(text, reason).not.toMatch(pattern);
      |                                  ^ Error: Double punctuation like "estimates.."
  77  |       }
  78  |     });
  79  |   }
  80  | });
  81  | 
  82  | test.describe("Header and footer consistency", () => {
  83  |   test.beforeEach(async ({ page }) => {
  84  |     await blockLivePriceApis(page);
  85  |   });
  86  | 
  87  |   // Routes to check for consistent header/footer
  88  |   const HEADER_FOOTER_ROUTES = [
  89  |     "/",
  90  |     "/guides",
  91  |     "/guides?category=gathering",
  92  |     "/guides?category=dungeons",
  93  |     `/guides/${GUIDE_SLUGS[0]}`,
  94  |     `/guides/${GUIDE_SLUGS[4]}`,
  95  |   ];
  96  | 
  97  |   for (const route of HEADER_FOOTER_ROUTES) {
  98  |     test(`${route} has header with navigation and footer with license`, async ({
  99  |       page,
  100 |     }) => {
  101 |       await page.goto(route);
  102 | 
  103 |       // Header: must have the site logo/brand link to /
  104 |       const brandLink = page.locator('header a[href="/"]').first();
  105 |       await expect(brandLink, "Header brand link must exist").toBeVisible();
  106 | 
  107 |       // Header: "All Guides" or Guides nav link
  108 |       const guidesLink = page
  109 |         .locator('header a[href="/guides"]')
  110 |         .first();
  111 |       await expect(guidesLink, "Header must have /guides link").toBeVisible();
  112 | 
  113 |       // Footer: GPLv3 mention
  114 |       const footerText = await page.locator("footer").innerText();
  115 |       expect(
  116 |         footerText,
  117 |         "Footer must mention GPLv3",
  118 |       ).toMatch(/GPL.*v3|General Public License/i);
  119 | 
  120 |       // Footer: No "All rights reserved"
  121 |       expect(
  122 |         footerText,
  123 |         'Footer must not say "All rights reserved"',
  124 |       ).not.toMatch(/All rights reserved/i);
  125 | 
  126 |       // Footer: No "Source-available" license claim
  127 |       expect(
  128 |         footerText,
  129 |         'Footer must not claim "Source-available license"',
  130 |       ).not.toMatch(/Source-available license/i);
  131 |     });
  132 |   }
  133 | 
  134 |   test("Header contains Feedback button", async ({ page }) => {
  135 |     await page.goto("/guides");
  136 |     // Feedback button in header (text or aria-label)
  137 |     const feedbackBtn = page.locator(
  138 |       'header button:has-text("Feedback"), header a:has-text("Feedback")',
  139 |     ).first();
  140 |     await expect(feedbackBtn, "Header must have a Feedback button").toBeVisible();
  141 |   });
  142 | 
  143 |   test("Header contains Donate link", async ({ page }) => {
  144 |     await page.goto("/guides");
  145 |     const donateLink = page.locator(
  146 |       'header a:has-text("Donate"), header button:has-text("Donate")',
  147 |     ).first();
  148 |     await expect(donateLink, "Header must have a Donate link").toBeVisible();
  149 |   });
  150 | 
  151 |   test("Header contains Live prices control", async ({ page }) => {
  152 |     await page.goto("/guides");
  153 |     // The live prices toggle - look for the label or button
  154 |     const livePrices = page
  155 |       .locator('header [aria-label*="live prices" i], header label:has-text("Live"), header button:has-text("Live")')
  156 |       .first();
  157 |     await expect(livePrices, "Header must have Live prices control").toBeVisible();
  158 |   });
  159 | 
  160 |   test("Header contains market city selector", async ({ page }) => {
  161 |     await page.goto("/guides");
  162 |     // The city select dropdown
  163 |     const citySelect = page
  164 |       .locator('header select[id*="city" i], header select[aria-label*="city" i], header select')
  165 |       .first();
  166 |     await expect(citySelect, "Header must have a market city selector").toBeVisible();
  167 |   });
  168 | });
  169 | 
```