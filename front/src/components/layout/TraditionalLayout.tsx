import { ReactNode } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/NewFooter";

interface TraditionalLayoutProps {
  children: ReactNode;
}

export default function TraditionalLayout({ children }: TraditionalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 bg-gray-50 mt-16 overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
