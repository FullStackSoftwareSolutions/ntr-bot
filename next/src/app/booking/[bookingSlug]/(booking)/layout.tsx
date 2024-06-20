"use client";

import BookingHeader from "@next/components/features/bookings/BookingHeader";
import { Tabs, TabsList, TabsTrigger } from "@next/components/ui/tabs";
import { api } from "@next/trpc/react";
import { useParams, usePathname, useRouter } from "next/navigation";

const getTab = (pathname: string | null, slug: string) => {
  const tab = pathname?.split(slug).pop()?.replace("/", "");
  if (tab?.length) {
    return tab;
  }
  return "spots";
};

type BookingLayoutProps = {
  children: React.ReactNode;
};

export default function BookingLayout({ children }: BookingLayoutProps) {
  const params = useParams<{ bookingSlug: string }>();
  const { data: booking } = api.bookings.getBySlug.useQuery({
    slug: params.bookingSlug,
  });
  const pathname = usePathname();
  const router = useRouter();

  const tab = getTab(pathname, params.bookingSlug);

  if (!booking) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-start">
      <BookingHeader slug={params.bookingSlug} />

      <Tabs
        className="hide-scrollbar sm:show-scrollbar container mb-4 flex overflow-y-auto"
        value={tab}
        onValueChange={(tab) => {
          if (tab === "spots") {
            return router.push(`/booking/${params.bookingSlug}`);
          }
          return router.push(`/booking/${params.bookingSlug}/${tab}`);
        }}
      >
        <TabsList>
          <TabsTrigger value="spots">Spots</TabsTrigger>
          <TabsTrigger value="skates">Skates</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="flex flex-1 flex-col md:container md:mx-auto">
        {children}
      </section>
    </div>
  );
}
