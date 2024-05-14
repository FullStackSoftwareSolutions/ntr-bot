import { type Skate } from "@db/features/skates/skates.type";
import { Button } from "@next/components/ui/button";
import { Card, CardTitle } from "@next/components/ui/card";
import { type Positions } from "@next/features/skates/skates.model";
import { PlusIcon } from "lucide-react";

type SkateAddSubButtonProps = {
  skate: Skate;
  position: Positions;
};

const SkateAddSubButton = ({ skate, position }: SkateAddSubButtonProps) => {
  return (
    <Button
      variant="secondary"
      className="flex h-auto items-stretch justify-stretch p-0.5"
    >
      <Card className="flex flex-1 flex-col items-center justify-center p-0.5 hover:bg-card/90">
        <CardTitle className="flex  flex-1 items-center justify-center gap-2 p-6">
          <PlusIcon size={24} className="text-secondary" /> Add Sub
        </CardTitle>
      </Card>
    </Button>
  );
};

export default SkateAddSubButton;
