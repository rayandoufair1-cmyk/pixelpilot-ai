import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ProjectView } from "@/components/portal/ProjectView";
import type { Project, Message } from "@/types";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  return (
    <ProjectView
      project={project as Project}
      initialMessages={(messages || []) as Message[]}
    />
  );
}
