import Player, {
  PlayerByEmail,
  PlayerById,
} from "@next/components/features/players/Player";

export default function PlayerPage({ params }: { params: { slug: string } }) {
  if (params.slug == null) return null;

  const slug = decodeURIComponent(params.slug);
  if (slug.includes("@")) {
    return (
      <div className="container flex flex-1 flex-col p-8">
        <PlayerByEmail email={slug} />
      </div>
    );
  }

  return (
    <div className="container flex flex-1 flex-col p-8">
      <PlayerById id={parseInt(slug)} />
    </div>
  );
}
