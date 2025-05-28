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
import { use } from "react";

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
  params: Promise<{ bookingSlug: string; skateSlug: string }>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { skateSlug, bookingSlug } = use(params);

  const tab = getTab(pathname, skateSlug);

  const { data: skate } = api.skates.getBySlugs.useQuery({
    bookingSlug,
    skateSlug,
  });

  if (!skate) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <Breadcrumb className="flex p-4 pt-2 md:pt-4">
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
        className="hide-scrollbar sm:show-scrollbar mb-2 flex overflow-y-auto px-4"
        value={tab}
        onValueChange={(tab) => {
          if (tab === "spots") {
            return router.push(`/booking/${bookingSlug}/skate/${skate.slug}`);
          }
          return router.push(
            `/booking/${bookingSlug}/skate/${skate.slug}/${tab}`,
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

      <section className="mt-4 flex w-full flex-1 flex-col p-4 pt-0">
        {children}
      </section>
    </div>
  );
}
