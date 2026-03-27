export async function getClinic(clinicId?: string) {
  if (!clinicId) return;

  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/clinics`);
    const json = await res.json().catch((err) => {});

    return json;
  } catch (error) {
    console.error("Error getting clinic:", error);
  }
}
