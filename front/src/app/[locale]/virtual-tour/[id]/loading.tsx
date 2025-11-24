// Loading component for virtual tour
export default function VirtualTourLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a00]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF007A]"></div>
        <p className="mt-4 text-white">Loading virtual tour...</p>
      </div>
    </div>
  );
}
