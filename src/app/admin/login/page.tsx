import { redirect } from "next/navigation";
import { adminConfigured, isAuthed } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthed()) {
    redirect("/admin");
  }

  return <LoginForm configured={adminConfigured()} />;
}
