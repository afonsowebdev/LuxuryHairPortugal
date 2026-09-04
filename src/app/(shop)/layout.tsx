import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminBar } from "@/components/admin/AdminBar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
