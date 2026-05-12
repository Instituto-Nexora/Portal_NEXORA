import { redirect } from "next/navigation"
import { PrivateHeader } from "@/components/layout/PrivateHeader"
import { PrivateSidebar } from "@/components/layout/PrivateSidebar"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const sessionUser = {
    id: user.id,
    email: user.email ?? "",
    profile: profile ?? null,
    full_name: profile?.full_name ?? "",
  }

  return (
    <div className={cn("flex h-screen overflow-hidden")}>
      <PrivateSidebar user={sessionUser} className={cn("sticky top-0 h-screen hidden md:flex")} />

      <div className={cn("flex flex-1 flex-col overflow-hidden")}>
        <PrivateHeader user={sessionUser} />

        <main className={cn("flex-1 overflow-y-auto p-6 bg-muted/40")}>
          {children}
        </main>
      </div>
    </div>
  )
}
