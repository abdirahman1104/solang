import { PRICING_TIERS } from '@/constants/pricing';

export default function CurrentPlan({ userTier, totalCreditsUsed }) {
  const totalCreditsLimit = PRICING_TIERS[userTier].credits;
  const remainingCredits = totalCreditsLimit - totalCreditsUsed;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-rose-100 via-purple-200 to-blue-200 dark:from-rose-500/20 dark:via-purple-500/20 dark:to-blue-500/20 p-8">
        {/* ... rest of the current plan UI ... */}
      </div>
    </div>
  );
} 