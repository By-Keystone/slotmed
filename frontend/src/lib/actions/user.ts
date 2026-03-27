"use server";

export async function getUserByAuthId(authId: string) {
  try {
    const data = await fetch(
      `${process.env.API_URL}/api/v1/user?auth_id=${authId}`,
    );
    const res = await data.json();

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
