import type { Metadata } from "next";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminDataProvider } from "@/context/AdminDataContext";

export const metadata: Metadata = {
  title: {
    default: "Admin | Luxury Hair Portugal",
    template: "%s | Admin Luxury Hair Portugal",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <div className="min-h-screen bg-cream">{children}</div>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}
