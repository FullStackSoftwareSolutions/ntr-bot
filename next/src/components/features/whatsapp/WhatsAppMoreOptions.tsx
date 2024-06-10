import { Button } from "@next/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@next/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@next/components/ui/dialog";
import { api } from "@next/trpc/react";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import ButtonLoading from "@next/components/ui/button-loading";

const WhatsAppMoreOptions = () => {
  const utils = api.useUtils();
  const [showReset, setShowReset] = useState<boolean>(false);

  const resetMutation = api.whatsapp.reset.useMutation({
    onSuccess: async () => {
      await utils.whatsapp.getConnection.reset();
    },
  });

  const handleReset = async () => {
    await resetMutation.mutateAsync();
  };

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
            onClick={() => setShowReset(true)}
            className="itmes-center flex gap-1 text-xs"
          >
            <TrashIcon className=" size-4 text-red-500" />
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showReset} onOpenChange={(open) => setShowReset(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogDescription>This will reset the connection.</DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowReset(false)}>
              Cancel
            </Button>
            <ButtonLoading
              loading={resetMutation.isPending}
              variant="destructive"
              onClick={handleReset}
            >
              Reset
            </ButtonLoading>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsAppMoreOptions;
