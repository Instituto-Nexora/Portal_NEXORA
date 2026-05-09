import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import type { AdminProfile } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { AdminsListView } from "./_features/AdminsList/view";

export const metadata: Metadata = {
  title: "Administradores — NEXORA CMS",
};

async function AdminsData() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const admins: AdminProfile[] = data ?? [];

  return <AdminsListView admins={admins} />;
}

function AdminsLoading() {
  return (
    <section
      className={cn("space-y-6")}
      aria-label="Carregando administradores"
      aria-busy="true"
    >
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className={cn("space-y-2")}>
          <Skeleton className={cn("h-7 w-48")} />
          <Skeleton className={cn("h-4 w-72 max-w-full")} />
        </div>
        <Skeleton className={cn("h-9 w-full sm:w-40")} />
      </div>
      <div className={cn("grid gap-3 sm:hidden")}>
        <Skeleton className={cn("h-24")} />
        <Skeleton className={cn("h-24")} />
        <Skeleton className={cn("h-24")} />
      </div>
      <div className={cn("hidden space-y-2 rounded-lg border p-4 sm:block")}>
        <Skeleton className={cn("h-8 w-full")} />
        <Skeleton className={cn("h-8 w-full")} />
        <Skeleton className={cn("h-8 w-full")} />
      </div>
    </section>
  );
}

export default function AdminsPage() {
  return (
    <Suspense fallback={<AdminsLoading />}>
      <AdminsData />
    </Suspense>
  );
}
