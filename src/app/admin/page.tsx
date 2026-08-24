import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { contentFile, getContent } from "@/lib/content";
import AdminEditor from "./AdminEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  const content = await getContent();

  return <AdminEditor initial={content} storePath={contentFile()} />;
}
