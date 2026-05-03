import StudySessionClient from "./StudySessionClient";

export default async function StudySessionPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject, topic } = await params;
  return <StudySessionClient subjectId={subject} topicId={topic} />;
}
