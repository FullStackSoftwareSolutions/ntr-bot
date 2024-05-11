import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <SignIn path="/sign-in" />
    </div>
  );
}
