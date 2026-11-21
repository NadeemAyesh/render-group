import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("renderlancer_role")?.value;
  const rawUser = cookieStore.get("renderlancer_user")?.value;

  if (!role || !rawUser) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      fullName: decodeURIComponent(rawUser),
      role,
    },
  });
}
