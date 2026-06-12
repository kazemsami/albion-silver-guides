import { ItemSlot } from "@/components/ItemSlot";
import {
  T8_HOUSE_BUILD_MATERIALS,
  computeT8HouseBuildPricing,
} from "@/data/t8-house-cost";
import type {
  EquipmentLoadout,
  EquipmentSlot,
  LoadoutPricing,
  SerializedPriceMap,
} from "@/types/guide";
import { formatSilverExact } from "@/lib/format";
import { deserializePriceMap } from "@/lib/guide-economics";

interface EquipmentPanelProps {
  loadout: EquipmentLoadout;
  variant?: "safe" | "profit" | "default";
  pricing?: LoadoutPricing;
  prices?: SerializedPriceMap;
}

const variantStyles = {
  safe: "border-emerald-500/25 bg-emerald-500/5",
  profit: "border-gold/25 bg-gold/5",
  default: "border-gold/15 bg-obsidian-light",
};

const slotGroups: { label: string; slots: EquipmentSlot[] }[] = [
  { label: "Armor & Weapons", slots: ["head", "mainhand", "armor", "offhand", "shoes"] },
  { label: "Cape, Bag & Mount", slots: ["cape", "bag", "mount"] },
  { label: "Consumables", slots: ["potion", "food"] },
];

const slotLabels: Record<EquipmentSlot, string> = {
  head: "Head",
  mainhand: "Main Hand",
  armor: "Armor",
  offhand: "Off-Hand",
  shoes: "Shoes",
  cape: "Cape",
  bag: "Bag",
  mount: "Mount",
  potion: "Potion",
  food: "Food",
};

export function EquipmentPanel({
  loadout,
  variant = "default",
  pricing,
  prices,
}: EquipmentPanelProps) {
  const { slots, inventory, houseCount } = loadout;
  const hasWornGear = Object.keys(slots).length > 0;
  const priceById = new Map(pricing?.lines.map((line) => [line.id, line]) ?? []);

  const houseBuildPricing =
    houseCount != null && houseCount > 0 && prices
      ? computeT8HouseBuildPricing(deserializePriceMap(prices), houseCount)
      : null;

  const isLaborerSetup = houseCount != null && houseCount > 0;
  const setupTotal =
    pricing?.total != null || houseBuildPricing?.total != null
      ? (pricing?.total ?? 0) + (houseBuildPricing?.total ?? 0)
      : null;
  const loadoutLabel = isLaborerSetup ? "Furniture & journals" : "Loadout market value";

  return (
    <div className={`theme-surface rounded-xl border p-5 sm:p-6 ${variantStyles[variant]}`}>
      <h3 className="font-display text-lg font-semibold text-parchment">
        {loadout.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-parchment/55">
        {loadout.description}
      </p>

      {hasWornGear && (
        <div className="mt-6 space-y-4 rounded-lg border border-slot-border bg-slot-bg p-4 sm:p-5">
          {slotGroups.map((group) => {
            const filled = group.slots
              .filter((key) => slots[key])
              .map((key) => ({ key, item: slots[key]! }));

            if (filled.length === 0) return null;

            return (
              <div key={group.label}>
                <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-parchment/35">
                  {group.label}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {filled.map(({ key, item }) => (
                    <ItemSlot
                      key={key}
                      item={item}
                      label={slotLabels[key]}
                      size={["cape", "bag", "mount", "potion", "food"].includes(key) ? "sm" : "md"}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isLaborerSetup && (
        <div className={`${hasWornGear ? "mt-5" : "mt-6"} w-full`}>
          <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-widest text-parchment/35">
            T8 House Build Cost
          </p>
          <p className="mb-2 text-center text-xs text-parchment/45">
            {houseCount === 1
              ? "Materials to upgrade one T2 house to T8 (Albion Wiki)"
              : `${houseCount} houses, materials per house × ${houseCount}`}
          </p>
          <div className="flex flex-wrap justify-center gap-3 rounded-lg border border-slot-border bg-slot-bg p-4">
            {T8_HOUSE_BUILD_MATERIALS.map((material) => (
              <ItemSlot
                key={material.id}
                item={material}
                label={material.name}
                size="sm"
                quantity={(material.quantity ?? 1) * houseCount}
              />
            ))}
          </div>
          {houseBuildPricing?.total != null && (
            <p className="mt-2 text-center text-sm text-parchment/55">
              House build:{" "}
              <span className="font-semibold text-gold tabular-nums">
                {formatSilverExact(houseBuildPricing.total)} silver
              </span>
              {houseCount > 1 && (
                <span className="text-parchment/40">
                  {" "}
                  ({formatSilverExact(houseBuildPricing.total / houseCount)} per house)
                </span>
              )}
            </p>
          )}
        </div>
      )}

      {inventory && inventory.length > 0 && (
        <div className={`${hasWornGear || isLaborerSetup ? "mt-5" : "mt-6"} w-full`}>
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-parchment/35">
            {hasWornGear ? "Also Bring" : isLaborerSetup ? "Furniture & Journals" : "Items"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 rounded-lg border border-slot-border bg-slot-bg p-4">
            {inventory.map((item) => (
              <ItemSlot
                key={`${item.id}-${item.name}`}
                item={item}
                label={item.name}
                size="sm"
                quantity={item.quantity}
              />
            ))}
          </div>
        </div>
      )}

      <details className="mt-5 border-t border-parchment/10 pt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-gold/80 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
          Item details
        </summary>
        <ul className="mt-3 space-y-2">
          {isLaborerSetup && (
            <li className="text-sm font-medium text-parchment/85">
              T8 house build ({houseCount}×)
              {houseBuildPricing?.total != null && (
                <span className="text-gold/80">
                  {" · "}
                  {formatSilverExact(houseBuildPricing.total)} silver
                </span>
              )}
            </li>
          )}
          {isLaborerSetup &&
            houseBuildPricing?.lines.map((line) => (
              <li key={`house-${line.id}`} className="pl-3 text-sm text-parchment/65">
                <span className="text-parchment/85">
                  {line.name}
                  {line.quantity > 1 ? ` ×${line.quantity}` : ""}
                </span>
                {line.lineTotal != null && (
                  <span className="text-gold/80">
                    {" · "}
                    {formatSilverExact(line.lineTotal)} silver
                  </span>
                )}
              </li>
            ))}
          {Object.entries(slots).map(([key, item]) =>
            item ? (
              <li key={key} className="text-sm text-parchment/65">
                <span className="font-medium text-parchment/85">
                  {item.name}
                  {(item.quantity ?? 1) > 1 ? ` ×${item.quantity}` : ""}
                </span>
                {priceById.get(item.id)?.unitPrice != null && (
                  <span className="text-gold/80">
                    {" · "}
                    {formatSilverExact(priceById.get(item.id)!.lineTotal ?? priceById.get(item.id)!.unitPrice!)} silver
                  </span>
                )}
                {item.hint && (
                  <span className="text-parchment/45"> · {item.hint}</span>
                )}
              </li>
            ) : null,
          )}
          {inventory?.map((item) => {
            const line = priceById.get(item.id);
            const qty = item.quantity ?? 1;
            return (
              <li key={`${item.id}-hint`} className="text-sm text-parchment/65">
                <span className="font-medium text-parchment/85">
                  {item.name}
                  {qty > 1 ? ` ×${qty}` : ""}
                </span>
                {line?.lineTotal != null && (
                  <span className="text-gold/80">
                    {" · "}
                    {formatSilverExact(line.lineTotal)} silver
                  </span>
                )}
                {item.hint && (
                  <span className="text-parchment/45"> · {item.hint}</span>
                )}
              </li>
            );
          })}
        </ul>
      </details>

      {setupTotal != null && (
        <div className="profit-summary-box mt-4 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
          {isLaborerSetup ? (
            <>
              {pricing?.total != null && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-parchment/60">{loadoutLabel}</span>
                  <span className="font-semibold text-gold tabular-nums">
                    {formatSilverExact(pricing.total)} silver
                  </span>
                </div>
              )}
              {houseBuildPricing?.total != null && (
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-parchment/60">
                    T8 house build{houseCount! > 1 ? ` (×${houseCount})` : ""}
                  </span>
                  <span className="font-semibold text-gold tabular-nums">
                    {formatSilverExact(houseBuildPricing.total)} silver
                  </span>
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gold/15 pt-2 text-sm">
                <span className="font-medium text-parchment/70">Total setup cost</span>
                <span className="font-semibold text-gold tabular-nums">
                  {formatSilverExact(setupTotal)} silver
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-parchment/60">{loadoutLabel}</span>
              <span className="font-semibold text-gold tabular-nums">
                {formatSilverExact(setupTotal)} silver
              </span>
            </div>
          )}
          {pricing?.consumableTotal != null && pricing.consumableTotal > 0 && (
            <p className="mt-1 text-xs text-parchment/45">
              Includes consumables: {formatSilverExact(pricing.consumableTotal)}
            </p>
          )}
          {!isLaborerSetup &&
            (pricing?.gearTotal != null || pricing?.consumableTotal != null) && (
              <p className="mt-1 text-xs text-parchment/45">
                {pricing.gearTotal != null && (
                  <span>Gear: {formatSilverExact(pricing.gearTotal)}</span>
                )}
                {pricing.gearTotal != null && pricing.consumableTotal != null && (
                  <span> · </span>
                )}
                {pricing.consumableTotal != null && (
                  <span>Consumables: {formatSilverExact(pricing.consumableTotal)}</span>
                )}
              </p>
            )}
        </div>
      )}
    </div>
  );
}
