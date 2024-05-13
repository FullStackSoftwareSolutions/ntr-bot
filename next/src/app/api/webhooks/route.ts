import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { updatePlayerClerkUserId } from "@db/features/players/players.db";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = (await req.json()) as string;
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const userId = evt.data.id;

  if (userId && evt.type === "user.created") {
    console.log({ userId, evtType: evt.type });
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    );
    if (!email) {
      return new Response("", { status: 200 });
    }

    const [user] = await updatePlayerClerkUserId(email.emailAddress, userId);
    if (user) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          playerId: user.id,
          admin: user.admin,
        },
      });
    }
  }

  return new Response("", { status: 200 });
}
