"use client";

import { Suspense } from "react";
import KundliAdvancedContent from "./KundliAdvancedContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading...</div>}>
      <KundliAdvancedContent />
    </Suspense>
  );
}