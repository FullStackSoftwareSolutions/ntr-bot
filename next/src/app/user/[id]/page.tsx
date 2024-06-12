import User from "@next/components/features/users/User";

export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div className="container flex flex-1 flex-col p-8">
      <User id={decodeURIComponent(params.id)} />
    </div>
  );
}
