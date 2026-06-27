import { MeetingDetailPage } from "@/components/meeting-detail/MeetingDetailPage";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MeetingDetailPage meetingId={Number(id)} />;
}
