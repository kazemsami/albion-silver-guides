# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guide-card-detail-consistency.spec.ts >> Profit ranges are internally consistent >> ava-roads-fishing: profit range min does not exceed max
- Location: tests\e2e\guide-card-detail-consistency.spec.ts:128:9

# Error details

```
Error: Range "40k - 34.7k" has min > max on ava-roads-fishing

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 34700
Received:    40000
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
        - button "Feedback" [ref=e37]
        - link "Donate" [ref=e38] [cursor=pointer]:
          - /url: https://www.paypal.me/kazemsam
  - main [ref=e39]:
    - article [ref=e40]:
      - navigation "Breadcrumb" [ref=e41]:
        - list [ref=e42]:
          - listitem [ref=e43]:
            - link "Home" [ref=e44] [cursor=pointer]:
              - /url: /
          - listitem [ref=e45]: /
          - listitem [ref=e46]:
            - link "Guides" [ref=e47] [cursor=pointer]:
              - /url: /guides
          - listitem [ref=e48]: /
          - listitem [ref=e49]:
            - link "Fishing" [ref=e50] [cursor=pointer]:
              - /url: /guides?category=fishing
      - generic [ref=e51]:
        - generic [ref=e52]:
          - generic [ref=e53]: Fishing
          - generic [ref=e54]: Advanced
          - generic "Mechanics and calculator inputs checked against wiki, official sources, or logged test data." [ref=e55]: Reviewed
          - generic "Last updated 2026-06-14" [ref=e56]: Last updated Jun 14, 2026
          - generic [ref=e57]: Risk / RNG heavy
          - generic [ref=e58]: 9 min read
        - button "View test logs and sources (Reviewed)" [ref=e60]
        - heading "Avalonian Roads Fishing (T8)" [level=1] [ref=e61]
        - paragraph [ref=e62]: "Fish normal schools on T8 Avalonian Road maps for top-tier silver. Roads are full-loot black zones: the calculator models portal search time, banking frequency, gear deaths, and fish lost when you die with a full bag. Puremist Snapper is a separate RNG line."
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
            - row "Conservative 13.8k Bad luck, low spec, slower route, worse market" [ref=e76]:
              - cell "Conservative" [ref=e77]
              - cell "13.8k" [ref=e78]
              - cell "Bad luck, low spec, slower route, worse market" [ref=e79]
            - row "Median 8.5k Typical session for a normal player" [ref=e80]:
              - cell "Median" [ref=e81]
              - cell "8.5k" [ref=e82]
              - cell "Typical session for a normal player" [ref=e83]
            - row "Expected value 8.5k Includes rare drops mathematically" [ref=e84]:
              - cell "Expected value" [ref=e85]
              - cell "8.5k" [ref=e86]
              - cell "Includes rare drops mathematically" [ref=e87]
            - row "High-roll 3k Lucky drop or strong session" [ref=e88]:
              - cell "High-roll" [ref=e89]
              - cell "3k" [ref=e90]
              - cell "Lucky drop or strong session" [ref=e91]
      - generic [ref=e92]:
        - paragraph [ref=e93]: "Full-loot roads: one death can erase multiple hours of fish"
        - paragraph [ref=e94]: Roads fishing depends on finding a good T8 road, school density, escape skill, and how much loot you carry before banking. The headline below subtracts expected gear loss and death probability × fish in your bag, not just kit replacement.
      - generic [ref=e95]:
        - generic [ref=e96]:
          - generic [ref=e97]:
            - paragraph [ref=e98]: Realistic take-home / hour (Normal)
            - paragraph [ref=e99]: 8.5k
            - paragraph [ref=e100]: "Before death costs: 14.4k/hr"
            - paragraph [ref=e101]: Includes ~6k/hr expected death loss (gear + carried fish)
            - paragraph [ref=e102]: "Expected range: 40k - 34.7k/hr · Lucky greedy up to 29.3k"
          - generic [ref=e103]:
            - generic [ref=e104]:
              - generic [ref=e105]: Gross output / hr
              - generic [ref=e106]: 51.7k
            - generic [ref=e107]:
              - generic [ref=e108]: Expected death loss / hr
              - generic [ref=e109]: 6k
            - generic [ref=e110]:
              - generic [ref=e111]: Loot at risk per death (avg bag)
              - generic [ref=e112]: N/A
            - generic [ref=e113]:
              - generic [ref=e114]: Gear replacement / death
              - generic [ref=e115]: 59.5k
            - generic [ref=e116]:
              - generic [ref=e117]: Effective fish / hr (after portal time)
              - generic [ref=e118]: "227"
        - generic [ref=e119]:
          - paragraph [ref=e120]: Playstyle preset
          - radiogroup [ref=e121]:
            - radio "Safe escape" [ref=e122]
            - radio "Normal" [checked] [ref=e123]
            - radio "Greedy max profit" [ref=e124]
          - paragraph [ref=e125]: Grandmaster fisherman set + GM rod on a decent T8 road. Balanced banking, moderate death and portal time.
        - generic [ref=e126]:
          - paragraph [ref=e127]: Puremist Snapper (RNG, separate line)
          - radiogroup [ref=e128]:
            - radio "Expected Snapper" [checked] [ref=e129]
            - radio "Lucky Snapper hour" [ref=e130]
          - paragraph [ref=e131]: Zone-tier RNG average on normal schools. Each catch yields 4 Snapper. Dry hours with zero catches are common.
      - generic [ref=e132]:
        - heading "Recommended Gear" [level=2] [ref=e133]
        - paragraph [ref=e134]: Loadout for Normal
        - generic [ref=e136]:
          - heading "T7 Fishing Gear (Middle Spec)" [level=3] [ref=e137]
          - paragraph [ref=e138]: T7 fisherman set + pork pie (~3 T7/down + ~2 T8 fish per cast. Upgrade to T8 armor for ~33% more yield.
          - generic [ref=e139]:
            - generic [ref=e140]:
              - paragraph [ref=e141]: Armor & Weapons
              - generic [ref=e142]:
                - generic [ref=e143]:
                  - generic "Grandmaster's Fisherman Cap" [ref=e144]
                  - generic "Grandmaster's Fisherman Cap" [ref=e145]: Head
                - generic [ref=e146]:
                  - generic "Adept's Bloodletter" [ref=e147]
                  - generic "Adept's Bloodletter" [ref=e148]: Main Hand
                - generic [ref=e149]:
                  - generic "Grandmaster's Fisherman Garb" [ref=e150]
                  - generic "Grandmaster's Fisherman Garb" [ref=e151]: Armor
                - generic [ref=e152]:
                  - generic "Grandmaster's Fisherman Workboots" [ref=e153]
                  - generic "Grandmaster's Fisherman Workboots" [ref=e154]: Shoes
            - generic [ref=e155]:
              - paragraph [ref=e156]: Cape, Bag & Mount
              - generic [ref=e157]:
                - generic [ref=e158]:
                  - generic "Adept's Fort Sterling Cape" [ref=e159]
                  - generic "Adept's Fort Sterling Cape" [ref=e160]: Cape
                - generic [ref=e161]:
                  - generic "Adept's Bag" [ref=e162]
                  - generic "Adept's Bag" [ref=e163]: Bag
                - generic [ref=e164]:
                  - generic "Adept's Giant Stag" [ref=e165]
                  - generic "Adept's Giant Stag" [ref=e166]: Mount
            - generic [ref=e167]:
              - paragraph [ref=e168]: Consumables
              - generic [ref=e169]:
                - generic [ref=e170]:
                  - generic "Invisibility Potion ×1" [ref=e171]:
                    - generic [ref=e172]: ×1
                  - generic "Invisibility Potion" [ref=e173]: Potion
                - generic [ref=e174]:
                  - generic "Pork Pie ×2" [ref=e175]:
                    - generic [ref=e176]: ×2
                  - generic "Pork Pie" [ref=e177]: Food
          - generic [ref=e178]:
            - paragraph [ref=e179]: Also Bring
            - generic [ref=e180]:
              - generic [ref=e181]:
                - generic "Grandmaster's Fishing Rod" [ref=e182]
                - generic "Grandmaster's Fishing Rod" [ref=e183]
              - generic [ref=e184]:
                - generic "Fancy Fish Bait ×10" [ref=e185]:
                  - generic [ref=e186]: ×10
                - generic "Fancy Fish Bait" [ref=e187]
              - generic [ref=e188]:
                - generic "Grandmaster Fisherman's Journal (Empty) ×1" [ref=e189]:
                  - generic [ref=e190]: ×1
                - generic "Grandmaster Fisherman's Journal (Empty)" [ref=e191]
          - group [ref=e192]:
            - generic "Item details" [ref=e193] [cursor=pointer]
          - generic [ref=e194]:
            - generic [ref=e195]:
              - generic [ref=e196]: Loadout market value
              - generic [ref=e197]: 140.5k silver
            - paragraph [ref=e198]:
              - generic [ref=e199]: "Gear: 140.5k"
      - generic [ref=e200]:
        - heading "Profit breakdown" [level=2] [ref=e201]
        - paragraph [ref=e202]: Normal preset, expected Snapper view.Site snapshot averages. Updated Jun 14, 2026, 4:46 PM.
        - generic [ref=e203]:
          - paragraph [ref=e204]: Session assumptions
          - generic [ref=e205]:
            - term [ref=e206]: Portal / search downtime
            - definition [ref=e207]: 15.0%
            - term [ref=e208]: Effective fish / hr
            - definition [ref=e209]: "227"
            - term [ref=e210]: Bank every (avg)
            - definition [ref=e211]: 22 min
            - term [ref=e212]: Fish value in bag at death (avg)
            - definition [ref=e213]: N/A
            - term [ref=e214]: Deaths / hour (modeled)
            - definition [ref=e215]: "0.1"
            - term [ref=e216]: Max single-death swing
            - definition [ref=e217]: N/A
        - generic [ref=e218]:
          - paragraph [ref=e219]: Base fish output / hour (Sturgeon + chops)
          - table [ref=e221]:
            - rowgroup [ref=e222]:
              - row "Item Qty/hr Unit Value" [ref=e223]:
                - columnheader "Item" [ref=e224]
                - columnheader "Qty/hr" [ref=e225]
                - columnheader "Unit" [ref=e226]
                - columnheader "Value" [ref=e227]
            - rowgroup [ref=e228]:
              - row "River Sturgeon 91 N/A N/A" [ref=e229]:
                - cell "River Sturgeon" [ref=e230]:
                  - generic [ref=e231]:
                    - generic "River Sturgeon" [ref=e232]
                    - generic [ref=e233]: River Sturgeon
                - cell "91" [ref=e234]
                - cell "N/A" [ref=e235]
                - cell "N/A" [ref=e236]
              - row "Chopped Fish (butchered bycatch) 2,040 N/A N/A" [ref=e237]:
                - cell "Chopped Fish (butchered bycatch)" [ref=e238]:
                  - generic [ref=e239]:
                    - generic "Chopped Fish (butchered bycatch)" [ref=e240]
                    - generic [ref=e241]: Chopped Fish (butchered bycatch)
                - cell "2,040" [ref=e242]
                - cell "N/A" [ref=e243]
                - cell "N/A" [ref=e244]
        - generic [ref=e245]:
          - paragraph [ref=e246]: Puremist Snapper (RNG, separate from base fish)
          - table [ref=e248]:
            - rowgroup [ref=e249]:
              - row "Item Qty/hr Unit Value" [ref=e250]:
                - columnheader "Item" [ref=e251]
                - columnheader "Qty/hr" [ref=e252]
                - columnheader "Unit" [ref=e253]
                - columnheader "Value" [ref=e254]
            - rowgroup [ref=e255]:
              - row "Puremist Snapper (0.20 catches/hr × 4) 0.79 N/A N/A" [ref=e256]:
                - cell "Puremist Snapper (0.20 catches/hr × 4)" [ref=e257]:
                  - generic [ref=e258]:
                    - generic "Puremist Snapper (0.20 catches/hr × 4)" [ref=e259]
                    - generic [ref=e260]: Puremist Snapper (0.20 catches/hr × 4)
                - cell "0.79" [ref=e261]
                - cell "N/A" [ref=e262]
                - cell "N/A" [ref=e263]
        - generic [ref=e264]:
          - paragraph [ref=e265]: Journal + consumables
          - table [ref=e267]:
            - rowgroup [ref=e268]:
              - row "Item Qty/hr Unit Value" [ref=e269]:
                - columnheader "Item" [ref=e270]
                - columnheader "Qty/hr" [ref=e271]
                - columnheader "Unit" [ref=e272]
                - columnheader "Value" [ref=e273]
            - rowgroup [ref=e274]:
              - row "Grandmaster Fisherman's Journal (Full) 0.67 est. 77.5k 51.7k" [ref=e275]:
                - cell "Grandmaster Fisherman's Journal (Full)" [ref=e276]:
                  - generic [ref=e277]:
                    - generic "Grandmaster Fisherman's Journal (Full)" [ref=e278]
                    - generic [ref=e279]: Grandmaster Fisherman's Journal (Full)
                - cell "0.67" [ref=e280]
                - cell "est. 77.5k" [ref=e281]:
                  - generic [ref=e282]:
                    - generic "Saved price snapshot (not live market)" [ref=e283]: est.
                    - text: 77.5k
                - cell "51.7k" [ref=e284]
              - row "Fancy Fish Bait 8.5 N/A N/A" [ref=e285]:
                - cell "Fancy Fish Bait" [ref=e286]:
                  - generic [ref=e287]:
                    - generic "Fancy Fish Bait" [ref=e288]
                    - generic [ref=e289]: Fancy Fish Bait
                - cell "8.5" [ref=e290]
                - cell "N/A" [ref=e291]
                - cell "N/A" [ref=e292]
              - row "Pork Pie 1.7 N/A N/A" [ref=e293]:
                - cell "Pork Pie" [ref=e294]:
                  - generic [ref=e295]:
                    - generic "Pork Pie" [ref=e296]
                    - generic [ref=e297]: Pork Pie
                - cell "1.7" [ref=e298]
                - cell "N/A" [ref=e299]
                - cell "N/A" [ref=e300]
              - row "Invisibility Potion 0.51 N/A N/A" [ref=e301]:
                - cell "Invisibility Potion" [ref=e302]:
                  - generic [ref=e303]:
                    - generic "Invisibility Potion" [ref=e304]
                    - generic [ref=e305]: Invisibility Potion
                - cell "0.51" [ref=e306]
                - cell "N/A" [ref=e307]
                - cell "N/A" [ref=e308]
              - row "Grandmaster Fisherman's Journal (Empty) 1 est. 31.8k 31.8k" [ref=e309]:
                - cell "Grandmaster Fisherman's Journal (Empty)" [ref=e310]:
                  - generic [ref=e311]:
                    - generic "Grandmaster Fisherman's Journal (Empty)" [ref=e312]
                    - generic [ref=e313]: Grandmaster Fisherman's Journal (Empty)
                - cell "1" [ref=e314]
                - cell "est. 31.8k" [ref=e315]:
                  - generic [ref=e316]:
                    - generic "Saved price snapshot (not live market)" [ref=e317]: est.
                    - text: 31.8k
                - cell "31.8k" [ref=e318]
          - paragraph [ref=e319]: "Net input + consumables: 31.8k silver"
        - generic [ref=e320]:
          - generic [ref=e321]:
            - generic [ref=e322]: Gross output / hour
            - generic [ref=e323]: 51.7k
          - generic [ref=e324]:
            - generic [ref=e325]: Minus consumables + empty journal
            - generic [ref=e326]: "-31.8k"
          - generic [ref=e327]:
            - generic [ref=e328]: Minus Standard listing tax (~10.5%)
            - generic [ref=e329]: "-5.4k"
          - generic [ref=e330]:
            - generic [ref=e331]: Net before death costs
            - generic [ref=e332]: 14.4k
          - generic [ref=e333]:
            - generic [ref=e334]: Minus gear deaths (0.1/hr × kit)
            - generic [ref=e335]: "-6k"
          - generic [ref=e336]:
            - generic [ref=e337]: Realistic take-home / hour
            - generic [ref=e338]: 8.5k
        - paragraph [ref=e339]: Carried fish value = base fish gross × (bank interval ÷ 60). Expected fish loss = deaths/hr × carried fish value. Gear loss = deaths/hr × full kit buy price. Portal downtime reduces effective fish/hr before all other lines. Snapper is shown separately because it is high-variance RNG.
      - generic [ref=e340]:
        - heading "Requirements" [level=2] [ref=e341]
        - list [ref=e342]:
          - listitem [ref=e343]: Fishing level 60+ for Grandmaster rod; T8 fisherman spec for Elder's rod and armor on T8 tabs
          - listitem [ref=e345]: T8 road map with water; profit scales with gear tab (see calculator)
          - listitem [ref=e347]: Access to an Avalonian Road portal near a royal city or Brecilien
          - listitem [ref=e349]: T3 bait every session (faster bites = more casts per hour)
          - listitem [ref=e351]: Pork Pie ×2 per hour on every fishing tab (+15% yield, +30% carry weight)
          - listitem [ref=e353]: Grandmaster fishing journal, adds ~100k sell value per filled journal per hour
      - generic [ref=e355]:
        - heading "Step-by-Step" [level=2] [ref=e356]
        - list [ref=e357]:
          - listitem [ref=e358]:
            - generic [ref=e359]: "1"
            - paragraph [ref=e360]: Enter an Avalonian Road from a yellow or blue zone and travel inward until you find a T8 map with large water bodies.
          - listitem [ref=e361]:
            - generic [ref=e362]: "2"
            - paragraph [ref=e363]: Scout for fishing schools on the water (visible nodes), only cast on schools, not open water.
          - listitem [ref=e364]:
            - generic [ref=e365]: "3"
            - paragraph [ref=e366]: "Pick a loadout tab: safe escape (mobility only). T7 gear (middle specs), T8 max profit, or T8 max spec on deep road maps."
          - listitem [ref=e367]:
            - generic [ref=e368]: "4"
            - paragraph [ref=e369]: "T7/T8 geared tabs: equip fisherman armor, eat 2 Pork Pies per hour, and carry an invisibility potion. Keep the fishing rod in your bag and cast at schools without equipping it."
          - listitem [ref=e370]:
            - generic [ref=e371]: "5"
            - paragraph [ref=e372]: "Safe setup: wear the escape build. Grandmaster fisherman cap, 2 Pork Pies per hour, rod and journal in bag. No fishing garb, boots, or invis potion."
          - listitem [ref=e373]:
            - generic [ref=e374]: "6"
            - paragraph [ref=e375]: Fill your Grandmaster fishing journal as you go for extra sell value.
          - listitem [ref=e376]:
            - generic [ref=e377]: "7"
            - paragraph [ref=e378]: Bank when full or if scouts appear. Sell River Sturgeon. Puremist Snapper, and filled journals raw; butcher lower-tier bycatch into chopped fish before listing.
      - generic [ref=e379]:
        - heading "Pro Tips" [level=2] [ref=e380]
        - list [ref=e381]:
          - listitem [ref=e382]:
            - generic [ref=e383]: ★
            - text: You catch ~350-550 fish/hr depending on gear, premium, and specs. T7 gear ≈400/hr (40% Sturgeon, 60% butchered). T8 gear ≈450/hr (3/7 Sturgeon, 4/7 butchered). Each butchered fish yields ~15 chopped fish.
          - listitem [ref=e384]:
            - generic [ref=e385]: ★
            - text: Sell River Sturgeon and Puremist Snapper raw. Butcher T7-and-lower bycatch into chopped fish. Never chop Sturgeon (raw sells for far more).
          - listitem [ref=e386]:
            - generic [ref=e387]: ★
            - text: Puremist Snapper is the big swing factor on T7/T8 maps. Strong Snapper RNG on a normal school pushes a good hour into a great one.
          - listitem [ref=e388]:
            - generic [ref=e389]: ★
            - text: "Do not cheap out on T7 gear long-term: T8 fisherman armor gives a significant fish-per-cast bonus and faster spec/journal progress."
          - listitem [ref=e390]:
            - generic [ref=e391]: ★
            - text: Pork Pie ×2 per hour grants +15% gathering yield (which also boosts fishing yield) and +30% carry weight, including on the safe escape build.
          - listitem [ref=e392]:
            - generic [ref=e393]: ★
            - text: If dismounted on the safe build, pop Flee on Miner's Workboots, then Ambush on the Assassin's Jacket to juke and remount your T3 horse.
          - listitem [ref=e394]:
            - generic [ref=e395]: ★
            - text: A single death with a full bag can wipe hours of profit. The calculator shows gear replacement plus death probability × carried fish value, not kit alone.
          - listitem [ref=e396]:
            - generic [ref=e397]: ★
            - text: Use Safe escape if you bank every ~12 min, Normal for ~22 min banking on GM gear, Greedy if you push deep roads with full T8 set.
          - listitem [ref=e398]:
            - generic [ref=e399]: ★
            - text: Puremist Snapper is the big swing factor. The calculator lists Snapper separately from Sturgeon/chops so you can see expected vs lucky hours.
          - listitem [ref=e400]:
            - generic [ref=e401]: ★
            - text: Portal time finding a good T8 road reduces effective fish/hr. A bad road or contested schools cut income even with max gear.
          - listitem [ref=e402]:
            - generic [ref=e403]: ★
            - text: Fort Sterling Cape gives CC reduction on geared tabs. Carry invisibility potions for dismount escapes.
          - listitem [ref=e404]:
            - generic [ref=e405]: ★
            - text: The fishing rod stays in your bag. Cast at schools without equipping it.
      - generic [ref=e406]:
        - heading "References" [level=2] [ref=e407]
        - list [ref=e408]:
          - listitem [ref=e409]:
            - 'link "GremmyAngler: Fishing on the Avalonian Roads (Beginners Guide)" [ref=e410] [cursor=pointer]':
              - /url: https://www.youtube.com/watch?v=sHCPd84O-50
      - generic [ref=e411]:
        - heading "Related Guides" [level=2] [ref=e412]
        - link "Fishing Intermediate Safe Zones Beginner friendly Reviewed Last updated Jun 13, 2026 Yellow Zone Mists Fishing Fish in yellow-zone Mists for solid non-lethal fishing income. PvP is knockdown-only, so profit mainly depends on fishing level, fisherman gear, Mist rarity, school density, market prices, and how quickly you find higher-rarity nested Mists. The calculator treats T7 journals and Puremist Snapper as late-game bonuses, not beginner income. Profit range / hr 4.9k – 37.6k/hr· saved prices 10 min read →" [ref=e414] [cursor=pointer]:
          - /url: /guides/mists-fishing
          - generic [ref=e415]:
            - generic [ref=e416]: Fishing
            - generic [ref=e417]: Intermediate
            - generic [ref=e418]: Safe Zones
            - generic [ref=e419]: Beginner friendly
            - generic "Mechanics and calculator inputs checked against wiki, official sources, or logged test data." [ref=e420]: Reviewed
            - generic "Last updated 2026-06-13" [ref=e421]: Last updated Jun 13, 2026
          - heading "Yellow Zone Mists Fishing" [level=3] [ref=e422]
          - paragraph [ref=e423]: Fish in yellow-zone Mists for solid non-lethal fishing income. PvP is knockdown-only, so profit mainly depends on fishing level, fisherman gear, Mist rarity, school density, market prices, and how quickly you find higher-rarity nested Mists. The calculator treats T7 journals and Puremist Snapper as late-game bonuses, not beginner income.
          - generic [ref=e424]:
            - text: Profit range / hr
            - paragraph [ref=e425]:
              - text: 4.9k – 37.6k/hr
              - generic [ref=e426]: · saved prices
            - generic [ref=e428]: 10 min read →
  - contentinfo [ref=e429]:
    - generic [ref=e430]:
      - generic [ref=e431]:
        - generic [ref=e432]:
          - heading "Albion Silver" [level=3] [ref=e433]
          - paragraph [ref=e434]: Community-driven money making guides for Albion Online. Learn proven strategies to grow your silver stack, from safe gathering routes to high-risk corrupted dungeons.
          - generic [ref=e435]:
            - button "Feedback" [ref=e436]
            - link "Support this site" [ref=e437] [cursor=pointer]:
              - /url: https://www.paypal.me/kazemsam
        - generic [ref=e438]:
          - heading "Categories" [level=4] [ref=e439]
          - list [ref=e440]:
            - listitem [ref=e441]:
              - link "Gathering" [ref=e442] [cursor=pointer]:
                - /url: /guides?category=gathering
            - listitem [ref=e443]:
              - link "Crafting" [ref=e444] [cursor=pointer]:
                - /url: /guides?category=crafting
            - listitem [ref=e445]:
              - link "Dungeons & PvE" [ref=e446] [cursor=pointer]:
                - /url: /guides?category=dungeons
            - listitem [ref=e447]:
              - link "Fishing" [ref=e448] [cursor=pointer]:
                - /url: /guides?category=fishing
            - listitem [ref=e449]:
              - link "Laborers" [ref=e450] [cursor=pointer]:
                - /url: /guides?category=laborers
        - generic [ref=e451]:
          - heading "Disclaimer" [level=4] [ref=e452]
          - paragraph [ref=e453]: Silver/hour estimates are approximate and vary by server, patch, and player skill. This is a fan site, not affiliated with Sandbox Interactive.
      - generic [ref=e454]:
        - paragraph [ref=e455]:
          - text: Copyright © 2026 Kazem Abou Setta. This project is free software licensed under the
          - link "GNU General Public License v3.0 or later" [ref=e456] [cursor=pointer]:
            - /url: /license
          - text: . You may redistribute and modify it under those terms. There is no warranty.
        - paragraph [ref=e457]:
          - link "Source code" [ref=e458] [cursor=pointer]:
            - /url: https://github.com/kazemsami/albion-silver-guides
          - text: ·
          - link "LICENSE file" [ref=e459] [cursor=pointer]:
            - /url: https://github.com/kazemsami/albion-silver-guides/blob/main/LICENSE
          - text: ·
          - link "GPLv3 on gnu.org" [ref=e460] [cursor=pointer]:
            - /url: https://www.gnu.org/licenses/gpl-3.0.html
          - text: · Albion Silver Guides · Fan-made project
```

# Test source

```ts
  50  | 
  51  |   return {
  52  |     title: title.trim(),
  53  |     profitText: profitText.trim(),
  54  |     categoryText: categoryText.trim(),
  55  |   };
  56  | }
  57  | 
  58  | test.describe("Guide card titles match detail page h1", () => {
  59  |   test.beforeEach(async ({ page }) => {
  60  |     await blockLivePriceApis(page);
  61  |   });
  62  | 
  63  |   for (const slug of GUIDE_SLUGS) {
  64  |     test(`${slug}: card title matches detail h1`, async ({ page }) => {
  65  |       await page.goto("/guides");
  66  |       await page.waitForSelector(`a[href="/guides/${slug}"]`, {
  67  |         timeout: 10_000,
  68  |       }).catch(() => null);
  69  | 
  70  |       const cardInfo = await extractCardInfo(page, slug);
  71  |       if (!cardInfo || !cardInfo.title) {
  72  |         // Card may be hidden under a category filter - skip title check
  73  |         // but still verify the detail page loads
  74  |         await page.goto(`/guides/${slug}`);
  75  |         const h1 = page.locator("h1").first();
  76  |         await expect(h1).toBeVisible();
  77  |         return;
  78  |       }
  79  | 
  80  |       await page.goto(`/guides/${slug}`);
  81  |       const h1Text = (await page.locator("h1").first().textContent()) ?? "";
  82  |       expect(
  83  |         h1Text.trim(),
  84  |         `Detail h1 must match card title for "${slug}"`,
  85  |       ).toContain(cardInfo.title.replace(/…$/, "").trim().substring(0, 20));
  86  |     });
  87  |   }
  88  | });
  89  | 
  90  | test.describe("Category page shows correct guides for each category", () => {
  91  |   test.beforeEach(async ({ page }) => {
  92  |     await blockLivePriceApis(page);
  93  |   });
  94  | 
  95  |   for (const category of CATEGORIES) {
  96  |     const expectedSlugs = CATEGORY_GUIDES[category];
  97  | 
  98  |     test(`${category}: all expected guides appear on category page`, async ({
  99  |       page,
  100 |     }) => {
  101 |       await page.goto(`/guides?category=${category}`);
  102 |       await page.waitForSelector(`a[href^="/guides/"]`, {
  103 |         timeout: 10_000,
  104 |       }).catch(() => null);
  105 | 
  106 |       for (const slug of expectedSlugs) {
  107 |         const link = page.locator(`a[href="/guides/${slug}"]`).first();
  108 |         const count = await link.count();
  109 |         expect(
  110 |           count,
  111 |           `Expected guide "${slug}" to appear on ${category} category page`,
  112 |         ).toBeGreaterThan(0);
  113 |       }
  114 |     });
  115 |   }
  116 | });
  117 | 
  118 | test.describe("Profit ranges are internally consistent", () => {
  119 |   /**
  120 |    * Tests that the profit range shown on a guide detail page
  121 |    * is not obviously impossible (min <= max).
  122 |    */
  123 |   test.beforeEach(async ({ page }) => {
  124 |     await blockLivePriceApis(page);
  125 |   });
  126 | 
  127 |   for (const slug of GUIDE_SLUGS) {
  128 |     test(`${slug}: profit range min does not exceed max`, async ({ page }) => {
  129 |       await page.goto(`/guides/${slug}`);
  130 | 
  131 |       // Look for patterns like "104k – 283k" or "600k – 1.8M"
  132 |       const rangePattern = /(\d+(?:\.\d+)?[kKmM]?)\s*[–-]\s*(\d+(?:\.\d+)?[kKmM]?)/g;
  133 |       const bodyText = await page.locator("main").innerText();
  134 |       const matches = [...bodyText.matchAll(rangePattern)];
  135 | 
  136 |       function parseAmount(s: string): number {
  137 |         const n = parseFloat(s);
  138 |         if (/[mM]$/.test(s)) return n * 1_000_000;
  139 |         if (/[kK]$/.test(s)) return n * 1_000;
  140 |         return n;
  141 |       }
  142 | 
  143 |       for (const match of matches) {
  144 |         const minVal = parseAmount(match[1]);
  145 |         const maxVal = parseAmount(match[2]);
  146 |         if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0 && maxVal > 0) {
  147 |           expect(
  148 |             minVal,
  149 |             `Range "${match[0]}" has min > max on ${slug}`,
> 150 |           ).toBeLessThanOrEqual(maxVal);
      |             ^ Error: Range "40k - 34.7k" has min > max on ava-roads-fishing
  151 |         }
  152 |       }
  153 |     });
  154 |   }
  155 | });
  156 | 
```