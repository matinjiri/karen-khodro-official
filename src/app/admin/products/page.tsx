import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import ProductList from "@/src/components/admin/ProductList";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.isAdmin) {
    redirect("/my-account");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6f6f6]"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <ProductList />
      </div>
    </main>
  );
}