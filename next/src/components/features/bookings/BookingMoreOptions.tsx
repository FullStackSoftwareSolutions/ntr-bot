"use client";

import { Button } from "@next/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@next/components/ui/dropdown-menu";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { type BookingWithSkates } from "@db/features/bookings/bookings.type";
import BookingDeleteDialog from "./edit/BookingDeleteDialog";
import BookingEditDialog from "./edit/BookingEditDialog";

type BookingMoreOptionsProps = {
  booking: BookingWithSkates;
};

const BookingMoreOptions = ({ booking }: BookingMoreOptionsProps) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto px-0.5 py-0.5">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => setShowEdit(true)}
            className="itmes-center flex gap-1 text-xs"
          >
            <EditIcon className=" size-4 text-secondary" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDelete(true)}
            className="itmes-center flex gap-1 text-xs"
          >
            <TrashIcon className=" size-4 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookingDeleteDialog
        open={showDelete}
        setOpen={setShowDelete}
        booking={booking}
      />
      <BookingEditDialog
        open={showEdit}
        setOpen={setShowEdit}
        booking={booking}
      />
    </>
  );
};

export default BookingMoreOptions;
