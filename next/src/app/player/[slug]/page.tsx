import Player, {
  PlayerByEmail,
  PlayerById,
} from "@next/components/features/players/Player";

export default function PlayerPage({ params }: { params: { slug: string } }) {
  if (params.slug == null) return null;

  if (params.slug.includes("@")) {
    return <PlayerByEmail email={params.slug} />;
  }

  return (
    <div className="container flex flex-1 flex-col p-8">
      <PlayerById id={parseInt(params.slug)} />
    </div>
  );
}
