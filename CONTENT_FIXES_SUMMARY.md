# Content Fixes Summary

## Files Changed

### 1. `src/lib/listing-tax.ts`
**Change**: Added market fee component constants with proper breakdown.

**Before**:
```typescript
export const PREMIUM_LISTING_TAX_RATE = 0.065;
export const STANDARD_LISTING_TAX_RATE = 0.105;
```

**After**:
```typescript
// Market fee component breakdown (Albion Online marketplace fees)
export const SETUP_FEE_RATE = 0.025; // 2.5% setup fee (same for Standard and Premium)
export const STANDARD_TRANSACTION_TAX_RATE = 0.08; // 8% transaction tax (Standard)
export const PREMIUM_TRANSACTION_TAX_RATE = 0.04; // 4% transaction tax (Premium)

// Total market fees for sell orders (setup fee + transaction tax)
export const STANDARD_MARKET_FEE_RATE = SETUP_FEE_RATE + STANDARD_TRANSACTION_TAX_RATE; // 10.5%
export const PREMIUM_MARKET_FEE_RATE = SETUP_FEE_RATE + PREMIUM_TRANSACTION_TAX_RATE; // 6.5%

// Legacy aliases (deprecated naming, use MARKET_FEE_RATE instead)
export const PREMIUM_LISTING_TAX_RATE = PREMIUM_MARKET_FEE_RATE;
export const STANDARD_LISTING_TAX_RATE = STANDARD_MARKET_FEE_RATE;
```

### 2. `src/data/guides.ts` - Corrupted Dungeons Tax Inconsistency

**Issue**: Mixed Standard and Premium tax assumptions without clear distinction. Claimed calculator "already subtracts Premium tax" without conditioning on toggle state.

**Fix 1** (Line 212, steps section):
- **Before**: `"subtract ~6.5% listing tax (Premium) from your margin."`
- **After**: `"Expect Standard market fees of ~10.5% (or ~6.5% with Premium) when calculating take-home profit."`

**Fix 2** (Line 221, tips section):
- **Before**: `"The profit calculator already subtracts ~6.5% Premium listing tax from sell value. Undercutting sell orders eats into the margin on top of that."`
- **After**: `"The profit calculator subtracts market fees based on your Premium toggle (Standard: ~10.5% setup fee + transaction tax; Premium: ~6.5%). Undercutting sell orders reduces your margin further on top of those fees."`

### 3. `src/data/guides.ts` - Laborer Guide Output Scope

**Issue**: Description claimed all laborers return unrefined T7 resources without scoping to gathering laborers.

**Fix** (Line 822, description):
- **Before**: `"Each laborer processes one full journal every 22 hours at 150% yield and returns unrefined T7 resources plus an empty journal."`
- **After**: `"Each laborer processes one full journal every 22 hours at 150% yield. Gathering laborers return unrefined T7 resources; crafting laborers return refined materials. All return an empty journal."`

### 4. `src/data/guides.ts` - Laborer Guide Opportunity Cost

**Issue**: Claimed self-filling journals "is the most profitable approach" without mentioning opportunity cost.

**Fix** (Line 848, tips section):
- **Before**: `"Profit per journal ≈ (resource sell value + empty journal value) - full journal cost - listing tax on sells. Filling journals yourself removes the buy cost and is the most profitable approach."`
- **After**: `"Profit per journal ≈ (resource sell value + empty journal value) - full journal cost - market fee on sells. Filling journals yourself lowers upfront cash spending, but compare the profit to selling full journals directly since a filled journal has market value (opportunity cost)."`

### 5. `tests/e2e/albion-claims.spec.ts` - Updated Tests

**Changes**:
- Enhanced Corrupted Dungeons tax consistency tests to check for Premium toggle mention
- Added test to verify both Standard and Premium rates are clearly contrasted
- Changed "mentions tax" to "mentions market fees" for clearer terminology
- Added opportunity cost test for Laborer guide

### 6. `tests/e2e/market-fee-terminology.spec.ts` - New Test File

**New Tests**:
1. **Market fee terminology consistency**: Scans all guide pages for misleading standalone "listing tax" phrases
2. **Centralized fee constants validation**:
   - Standard market fee = setup fee + Standard transaction tax = 10.5%
   - Premium market fee = setup fee + Premium transaction tax = 6.5%
   - Component rates match expected Albion Online values

## Test Results

All tests passing:
- 24 new/updated tests for content fixes
- 257 total tests in full suite (256 passed, 1 transient timeout that passes on retry)

Key test coverage:
- ✅ Corrupted Dungeons doesn't claim calculator uses only Premium tax as default
- ✅ Premium tax mentions include conditional language (toggle, "with Premium")
- ✅ Both Standard and Premium rates mentioned with clear distinction
- ✅ Laborer guide doesn't claim all laborers return unrefined resources
- ✅ Laborer guide mentions opportunity cost when discussing self-filling
- ✅ Market fee terminology consistency across all guides
- ✅ Centralized constants properly structured and validated

## Key Improvements

1. **Clearer Tax Communication**: Users now understand the calculator behavior depends on their Premium toggle setting, not a hardcoded assumption
2. **Better Terminology**: "Market fees" and "sell-order fees" replace confusing "listing tax" wording
3. **Accurate Laborer Info**: Clear distinction between gathering laborers (return unrefined) and crafting laborers (return refined)
4. **Opportunity Cost Education**: Users now understand self-filling journals has an opportunity cost (the market value of the filled journal)
5. **Centralized Constants**: Market fee rates properly broken down into components (setup fee + transaction tax) with clear calculations
