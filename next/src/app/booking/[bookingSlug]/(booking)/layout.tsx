"use client";

import BookingHeader from "@next/components/features/bookings/BookingHeader";
import { Tabs, TabsList, TabsTrigger } from "@next/components/ui/tabs";
import { api } from "@next/trpc/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@next/components/ui/breadcrumb";

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
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
      <Breadcrumb className="flex p-4 pt-2 md:pt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/bookings">Bookings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{booking.announceName}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <BookingHeader booking={booking} />

      <Tabs
        className="hide-scrollbar sm:show-scrollbar mb-2 flex overflow-y-auto px-4"
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
          <TabsTrigger value="bot">Bot</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="mt-4 flex w-full flex-1 flex-col p-4 pt-0">
        {children}
      </section>
    </div>
  );
}
