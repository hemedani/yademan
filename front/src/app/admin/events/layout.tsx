"use client";

import { ReactNode } from "react";
import AdminSidebar from "@/components/organisms/AdminSidebar";

interface AdminEventLayoutProps {
  children: ReactNode;
}

const AdminEventLayout: React.FC<AdminEventLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
};

export default AdminEventLayout;
