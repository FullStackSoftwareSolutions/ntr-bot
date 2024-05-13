import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/api/webhooks",
]);

const isLandingPage = createRouteMatcher(["/"]);

const customMiddleware = async (userId: string | null, req: NextRequest) => {
  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    const admin = user.privateMetadata?.admin ?? false;
    if (admin) {
      return;
    }

    if (!isLandingPage(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
};

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return customMiddleware(userId, req);
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
