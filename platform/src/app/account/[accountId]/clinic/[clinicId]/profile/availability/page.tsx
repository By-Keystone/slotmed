import { availabilityApi } from "@/lib/api/availability";
import { AvailabilityEditor } from "@/components/clinic/availability/availability-editor";

interface Props {
  params: Promise<{ clinicId: string }>;
}

export default async function AvailabilityPage({ params }: Props) {
  const { clinicId } = await params;

  const blocks = await availabilityApi.getMyAvailability(clinicId);

  return <AvailabilityEditor initial={blocks} />;
}
