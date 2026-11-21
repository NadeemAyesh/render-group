import { NextResponse } from "next/server";
import { DEMO_ACCOUNTS, getRedirectUrlForRole } from "@/lib/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const demo = DEMO_ACCOUNTS[normalizedEmail];

    if (demo && demo.password === password) {
      const response = NextResponse.json({
        success: true,
        user: demo.user,
        redirectUrl: demo.redirectUrl,
      });

      response.cookies.set("renderlancer_role", demo.user.role, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("renderlancer_user", encodeURIComponent(demo.user.fullName), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Generic valid test login
    if (normalizedEmail.includes("@") && password.length >= 6) {
      const user = {
        id: `u-${Date.now()}`,
        fullName: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: "JOB_SEEKER" as const,
        location: "فلسطين (عن بعد)",
        avatar: normalizedEmail.slice(0, 2).toUpperCase(),
      };

      const redirectUrl = getRedirectUrlForRole("JOB_SEEKER");
      const response = NextResponse.json({
        success: true,
        user,
        redirectUrl,
      });

      response.cookies.set("renderlancer_role", user.role, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("renderlancer_user", encodeURIComponent(user.fullName), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { error: "بيانات الدخول غير صحيحة" },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الطلب", details: message },
      { status: 500 }
    );
  }
}
