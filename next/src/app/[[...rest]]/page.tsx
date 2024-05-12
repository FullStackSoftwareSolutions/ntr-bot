"use client";

import { api } from "@next/trpc/react";

export default function Home() {
  const { data: skates } = api.skates.getAll.useQuery();

  console.log(skates);
  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-4xl font-bold">🤖 beep boop</h1>
      {skates?.map((skate) => (
        <div key={skate.id}>
          <h2>{skate.booking.name}</h2>
        </div>
      ))}
    </div>
  );
}
