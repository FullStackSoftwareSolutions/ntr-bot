import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <SignUp path="/sign-up" />
    </div>
  );
}
