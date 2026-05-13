import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export async function assertAuthenticatedLayout(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
}
