import { ClinicsTable } from "@/components/clinic/clinics-table";
import { TopHeader } from "@/components/clinic/top-header";
import { clinicApi } from "@/lib/api/clinic";

interface Props {
  params: Promise<{ resourceId: string }>;
}

export default async function ClinicsPage({ params }: Props) {
  const { resourceId } = await params;

  const clinics = await clinicApi.getOrganizationClinics(resourceId);

  return (
    <div>
      <TopHeader />
      <ClinicsTable clinics={clinics} />
    </div>
  );
}
