import TaskInfoPage from "@/src/components/post/TaskInfoPage";
interface PageProps {
  params: { id: string };
}

export default async function TaskPage({ params }: PageProps) {

  const resolvedParams = await params;

  return <TaskInfoPage taskId={resolvedParams.id} />;
}
