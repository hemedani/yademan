import { Suspense } from "react";
import EventsPageContent from "./EventsPageContent";

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF007A]"></div>
        </div>
      }
    >
      <EventsPageContent />
    </Suspense>
  );
}
