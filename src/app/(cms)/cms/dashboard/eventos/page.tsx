import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Event } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { EventosListView } from "./_features/EventosList/view";

export const metadata: Metadata = {
  title: "Eventos — NEXORA CMS",
};

type PageProps = {
  searchParams: Promise<{ status?: string; type?: string }>;
};

async function EventosData({ searchParams }: PageProps) {
  const { status, type } = await searchParams;

  const adminClient = createAdminClient();

  let query = adminClient
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data } = await query;

  const eventos: Event[] = data ?? [];

  return (
    <EventosListView
      eventos={eventos}
      statusFilter={status ?? ""}
      typeFilter={type ?? ""}
    />
  );
}

function EventosLoading() {
  return (
    <section
      className={cn("space-y-6")}
      aria-label="Carregando eventos"
      aria-busy="true"
    >
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className={cn("space-y-2")}>
          <Skeleton className={cn("h-7 w-32")} />
          <Skeleton className={cn("h-4 w-48")} />
        </div>
        <Skeleton className={cn("h-9 w-full sm:w-32")} />
      </div>
      <Skeleton className={cn("h-px w-full")} />
      <div
        className={cn(
          "grid gap-3 rounded-lg border p-3 sm:grid-cols-[2rem_10rem_9rem_5rem_8rem]",
        )}
      >
        <Skeleton className={cn("h-9")} />
        <Skeleton className={cn("h-9")} />
        <Skeleton className={cn("h-9")} />
        <Skeleton className={cn("h-9")} />
        <Skeleton className={cn("h-9")} />
      </div>
      <div className={cn("space-y-2 rounded-lg border p-4")}>
        <Skeleton className={cn("h-8 w-full")} />
        <Skeleton className={cn("h-8 w-full")} />
        <Skeleton className={cn("h-8 w-full")} />
      </div>
    </section>
  );
}

export default function EventosPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<EventosLoading />}>
      <EventosData searchParams={searchParams} />
    </Suspense>
  );
}
