import Player from "@next/components/features/players/Player";

export default function PlayerPage({ params }: { params: { email: string } }) {
  return (
    <div className="container flex flex-1 flex-col p-8">
      <Player email={decodeURIComponent(params.email)} />
    </div>
  );
}
