import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";

export async function adminGuard() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "ابتدا وارد حساب کاربری شوید.",
        },
        { status: 401 }
      ),
    };
  }

  if (!user.isAdmin) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "شما دسترسی ادمین ندارید.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}