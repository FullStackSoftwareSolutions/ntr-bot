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
  return (
    <Button asChild variant="ghost" className="h-auto p-0.5 text-start">
      <Link href={`/booking/${skate.booking.slug}/${skate.slug}`}>
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
        </Card>
      </Link>
    </Button>
  );
};

export default SkateCard;
