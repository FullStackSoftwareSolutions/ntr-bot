"use client";

import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@next/components/ui/card";
import { getSkateTimeMessage } from "@next/features/skates/skates.model";
import { api } from "@next/trpc/react";
import Link from "next/link";
import { formatDateRelative } from "@formatting/dates/calendar";
import SkateOpenSpots from "./SkateOpenSpots";
import SkateFilledSpots from "./SkateFilledSpots";

type SkateCardProps = {
  skate: Skate;
};

const SkateCard = ({ skate }: SkateCardProps) => {
  const mutation = api.skates.announce.useMutation();

  const announceSkate = () => {
    mutation.mutate({ skateId: skate.id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getSkateTimeMessage(skate)}</CardTitle>
        <CardDescription>
          {formatDateRelative(skate.scheduledOn)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <SkateOpenSpots skate={skate} />
        <SkateFilledSpots skate={skate} />
      </CardContent>
      <CardFooter>
        <Button className="flex-1" onClick={() => announceSkate()}>
          Announce
        </Button>
        {skate.slug && (
          <Button className="flex-1" asChild>
            <Link href={`/bookings/${skate.booking.slug}/${skate.slug}`}>
              Manage
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SkateCard;
