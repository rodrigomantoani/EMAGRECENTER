'use client';

import { WeightLossChart } from '@/components/charts/WeightLossChart';

export default function TestChartPage() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <WeightLossChart />
      </div>
    </div>
  );
}
