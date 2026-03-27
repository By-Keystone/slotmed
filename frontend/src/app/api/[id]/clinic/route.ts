import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/[id]/clinic">,
) {
  const { id: userId } = await ctx.params;

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/v1/clinics/user/${userId}`,
    );
    const data = await res.json();

    return NextResponse.json(data.map(({ createdBy, ...rest }) => rest));
  } catch (err) {
    console.error(err);
  }
}
