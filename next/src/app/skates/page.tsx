import SkatesList from "@next/components/features/skates/SkatesList";
import { TrophyIcon } from "lucide-react";

export default function SkatesPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-8">
      <h1 className="m-8 flex items-center gap-4 text-4xl font-bold">
        <TrophyIcon /> Skates
      </h1>
      <SkatesList />
    </div>
  );
}
