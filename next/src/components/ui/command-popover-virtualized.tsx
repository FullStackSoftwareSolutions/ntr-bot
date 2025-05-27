import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@next/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@next/components/ui/popover";
import { cn } from "@next/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useFilter } from "react-aria";
import { Input } from "./input";
import { useRefCallback } from "@next/hooks/useRefCallback";
import { CheckIcon, XIcon } from "lucide-react";

type CommandPopoverVirtualizedProps<T> = {
  className?: string;
  placeholder?: string;
  onValueChange?: (value: T | null | T[]) => void;
  onSearchChange?: (value: string) => void;
  value?: T | null | T[];
  options: T[];
  getOptionLabel: (option: T) => string;
  multiple?: boolean;
  isLoading?: boolean;
};

export function CommandPopoverVirtualized<T>({
  className,
  value,
  options,
  getOptionLabel,
  onValueChange,
  multiple,
  isLoading,
  onSearchChange,
  placeholder = "Search...",
}: CommandPopoverVirtualizedProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [parentRef, setParentRef] = useRefCallback<HTMLDivElement>();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  useEffect(() => {
    onSearchChange?.(searchValue);
  }, [searchValue, onSearchChange]);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { contains } = useFilter({
    sensitivity: "base",
  });
  const filteredOptions = useMemo(
    () =>
      options.filter((option) => contains(getOptionLabel(option), searchValue)),
    [options, searchValue, contains, getOptionLabel],
  );

  const itemSize = 32;
  const pageSize = 5;

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSize,
    scrollPaddingEnd: itemSize,
    scrollPaddingStart: itemSize,
  });
  const items = virtualizer.getVirtualItems();

  const handleSelect = (index: number) => {
    const option = filteredOptions[index] ?? null;

    if (multiple && option) {
      const valueArray = value as T[];

      const newValue = isSelected(option)
        ? valueArray.filter((val) => val !== option)
        : [...valueArray, option];

      onValueChange?.(newValue);
      return;
    }

    setSearchValue("");
    inputRef.current?.blur();
    onValueChange?.(option);
    setOpen(false);
  };

  const handleClear = () => {
    onValueChange?.(multiple ? [] : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;

    if (!e.defaultPrevented) {
      switch (e.key) {
        case "Escape": {
          input?.blur();
          break;
        }
        case "Enter": {
          if (filteredOptions[0]) {
            handleSelect(selectedIndex ?? 0);
            e.preventDefault();
          }

          break;
        }
        case "Home": {
          if (filteredOptions[0]) {
            setSelectedIndex(0);
            virtualizer.scrollToIndex(0);
          }

          break;
        }
        case "End": {
          if (filteredOptions[0]) {
            const newIndex = filteredOptions.length - 1;
            setSelectedIndex(newIndex);
            virtualizer.scrollToIndex(newIndex);
          }

          break;
        }
        case "ArrowDown": {
          if (filteredOptions[0]) {
            const nextIndex = Math.min(
              filteredOptions.length - 1,
              selectedIndex === null ? 0 : selectedIndex + 1,
            );
            setSelectedIndex(nextIndex);
            virtualizer.scrollToIndex(nextIndex);
          }

          break;
        }
        case "PageDown": {
          if (filteredOptions[0]) {
            const nextIndex = Math.min(
              filteredOptions.length - 1,
              selectedIndex === null ? 0 : selectedIndex + pageSize,
            );
            setSelectedIndex(nextIndex);
            virtualizer.scrollToIndex(nextIndex);
          }

          break;
        }
        case "ArrowUp": {
          if (filteredOptions[0]) {
            const nextIndex = Math.max(
              0,
              selectedIndex === null ? 0 : selectedIndex - 1,
            );
            setSelectedIndex(nextIndex);
            virtualizer.scrollToIndex(nextIndex);
          }

          break;
        }
        case "PageUp": {
          if (filteredOptions[0]) {
            const nextIndex = Math.max(
              0,
              selectedIndex === null ? 0 : selectedIndex - pageSize,
            );
            setSelectedIndex(nextIndex);
            virtualizer.scrollToIndex(nextIndex);
          }

          break;
        }
      }
    }
  };

  const getPlaceholder = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (multiple) {
      const valueArray = value as T[];
      return valueArray?.length
        ? valueArray.map(getOptionLabel).join(", ")
        : placeholder;
    }

    return value ? getOptionLabel(value as T) : placeholder;
  };

  const isSelected = (option: T) => {
    if (multiple) {
      return (value as T[])?.some((val) => val === option);
    }

    return value === option;
  };

  const hasValue = multiple ? (value as T[])?.length > 0 : !!value;

  return (
    <Popover open={open}>
      <div className="relative h-auto overflow-visible">
        <Input
          className={cn(
            "w-full pr-8",
            hasValue && "placeholder:text-foreground",
            className,
          )}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            if (multiple) {
              setSearchValue("");
            }
          }}
          value={searchValue}
          placeholder={getPlaceholder()}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {hasValue && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center">
            <Button
              className="pointer-events-auto ml-auto mr-1 px-1"
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleClear}
            >
              <XIcon className="size-5" />
            </Button>
          </div>
        )}
        <PopoverAnchor className="pointer-events-none absolute bottom-0 left-0 right-0 top-0" />
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="start"
          sideOffset={2}
          className="w-(--radix-popper-anchor-width) p-0"
        >
          <div
            className="max-h-64 overflow-y-auto overflow-x-hidden px-1 py-1"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            ref={setParentRef}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${items[0]?.start ?? 0}px)`,
                }}
              >
                {items.map((virtualRow) => {
                  const option = filteredOptions[virtualRow.index] as T;
                  const label = getOptionLabel(option);

                  return (
                    <div
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                      aria-selected={selectedIndex === virtualRow.index}
                      onMouseOver={() => {
                        setSelectedIndex(virtualRow.index);
                      }}
                      onMouseDown={() => handleSelect(virtualRow.index)}
                    >
                      {multiple && (
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected(option)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          {isSelected(option) && (
                            <CheckIcon className="size-3" />
                          )}
                        </div>
                      )}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
