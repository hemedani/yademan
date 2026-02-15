import { Suspense } from "react";
import EventDetailContent from "./EventDetailContent";

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF007A]"></div>
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}
