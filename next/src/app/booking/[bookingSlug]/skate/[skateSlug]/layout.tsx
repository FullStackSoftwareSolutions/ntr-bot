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
      <section className="flex flex-col overflow-hidden md:container md:pt-4">
        <Breadcrumb className="hidden md:flex">
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

        <div className="flex gap-8 p-8">
          <div>
            <h1 className="text-3xl">{getSkateTimeMessage(skate)}</h1>
            <p className="text-lg text-foreground/40">{skate.booking.name}</p>
          </div>

          <SkateOpenSpots skate={skate} />
        </div>
      </section>

      <Tabs
        className="hide-scrollbar sm:show-scrollbar container mb-4 flex overflow-y-auto"
        value={tab}
        onValueChange={(tab) => {
          if (tab === "spots") {
            return router.push(`/booking/${params.bookingSlug}/${skate.slug}`);
          }
          return router.push(
            `/booking/${params.bookingSlug}/${skate.slug}/${tab}`,
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

      <section className="flex flex-1 flex-col text-center md:container md:mx-auto">
        {children}
      </section>
    </div>
  );
}
