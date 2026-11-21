import { NextResponse } from "next/server";
import { getRedirectUrlForRole, AuthRole } from "@/lib/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, role, location, companyName } = body;

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: "جميع الحقول الإلزامية مطلوبة" },
        { status: 400 }
      );
    }

    const validRoles: AuthRole[] = ["JOB_SEEKER", "EMPLOYER", "SUPER_ADMIN", "CONTENT_EDITOR"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "نوع الحساب المختار غير صالح" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const newUser = {
      id: `u-${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone || undefined,
      role: role as AuthRole,
      location: location || "فلسطين (عن بعد)",
      companyName: role === "EMPLOYER" ? companyName : undefined,
      avatar: fullName.trim().slice(0, 2).toUpperCase(),
    };

    const redirectUrl = getRedirectUrlForRole(role as AuthRole);
    const response = NextResponse.json({
      success: true,
      user: newUser,
      redirectUrl,
    });

    response.cookies.set("renderlancer_role", newUser.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("renderlancer_user", encodeURIComponent(newUser.fullName), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Register API Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب", details: message },
      { status: 500 }
    );
  }
}
