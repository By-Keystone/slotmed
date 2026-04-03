export async function getSede(sedeId?: string) {
  if (!sedeId) return;

  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/sedes`);
    const json = await res.json().catch((err) => {});

    return json;
  } catch (error) {
    console.error("Error getting sede:", error);
  }
}
