"use client";

import { cn } from "@next/lib/utils";
import { api } from "@next/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@next/components/ui/card";
import { formatDateTime } from "@formatting/dates";

type UpcomingSkatesListProps = {
  className?: string;
};

const UpcomingSkatesList = ({ className }: UpcomingSkatesListProps) => {
  const { data: skates } = api.skates.getAll.useQuery();

  return (
    <div className={cn("container flex flex-wrap gap-4", className)}>
      {skates?.map((skate) => (
        <Card key={skate.id}>
          <CardHeader>
            <CardTitle>{formatDateTime(skate.scheduledOn)}</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingSkatesList;
