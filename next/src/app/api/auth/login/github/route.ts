// app/login/github/callback/route.ts
import { cookies } from "next/headers";
import { github } from "@next/auth";
import { generateState } from "arctic";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = github.createAuthorizationURL(state, ["user:email"]);

  (await cookies()).set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  url.searchParams.set("prompt", "consent");

  return Response.redirect(url);
}
