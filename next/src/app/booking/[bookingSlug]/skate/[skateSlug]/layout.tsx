"use client";

import SkateOpenSpots from "@next/components/features/skates/SkateOpenSpots";
import { getSkateTimeMessage } from "@next/features/skates/skates.model";
import { api } from "@next/trpc/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@next/components/ui/breadcrumb";
import { formatDate } from "@formatting/dates";
import { Tabs, TabsList, TabsTrigger } from "@next/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import SkateHeader from "@next/components/features/skates/SkateHeader";

const getTab = (pathname: string | null, slug: string) => {
  const tab = pathname?.split(slug).pop()?.replace("/", "");
  if (tab?.length) {
    return tab;
  }
  return "spots";
};

export default function SkatePageLayout({
  params,
  children,
}: {
  params: { bookingSlug: string; skateSlug: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const tab = getTab(pathname, params.skateSlug);

  const { data: skate } = api.skates.getBySlugs.useQuery({
    bookingSlug: params.bookingSlug,
    skateSlug: params.skateSlug,
  });

  if (!skate) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="container flex pt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/bookings">Bookings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/booking/${skate.booking.slug}`}>
              {skate.booking.announceName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{formatDate(skate.scheduledOn)}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <SkateHeader skate={skate} />

      <Tabs
        className="hide-scrollbar sm:show-scrollbar container mb-4 flex overflow-y-auto"
        value={tab}
        onValueChange={(tab) => {
          if (tab === "spots") {
            return router.push(
              `/booking/${params.bookingSlug}/skate/${skate.slug}`,
            );
          }
          return router.push(
            `/booking/${params.bookingSlug}/skate/${skate.slug}/${tab}`,
          );
        }}
      >
        <TabsList>
          <TabsTrigger value="spots" className="gap-1">
            Spots
          </TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="bot">Bot</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="container mx-auto flex flex-1 flex-col text-center">
        {children}
      </section>
    </div>
  );
}
