"use client";

import { Suspense } from "react";
import CallEndedContent from "./CallEndedContent";

export default function CallEndedPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading session details...</div>}>
      <CallEndedContent />
    </Suspense>
  );
}
