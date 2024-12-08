import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChart } from "@/contexts/ChartContext";

const popularSymbols = [
  { value: "NASDAQ:AAPL", label: "Apple Inc. (AAPL)" },
  { value: "NASDAQ:MSFT", label: "Microsoft Corporation (MSFT)" },
  { value: "NASDAQ:GOOGL", label: "Alphabet Inc. (GOOGL)" },
  { value: "NYSE:TSLA", label: "Tesla, Inc. (TSLA)" },
  { value: "NYSE:NVDA", label: "NVIDIA Corporation (NVDA)" },
  { value: "NYSE:META", label: "Meta Platforms Inc. (META)" },
  { value: "NYSE:AMZN", label: "Amazon.com Inc. (AMZN)" },
  { value: "NYSE:BRK.B", label: "Berkshire Hathaway Inc. (BRK.B)" },
  { value: "NYSE:JPM", label: "JPMorgan Chase & Co. (JPM)" },
  { value: "NYSE:V", label: "Visa Inc. (V)" },
] as const;

export const SymbolSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { chartData, setChartSymbol } = useChart();

  const currentSymbol = popularSymbols.find(
    (symbol) => symbol.value === chartData.symbol
  ) || { value: chartData.symbol, label: chartData.symbol };

  const handleSelect = (value: string) => {
    setChartSymbol(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {currentSymbol.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command value={chartData.symbol}>
          <CommandInput placeholder="Search symbol..." />
          <CommandEmpty>No symbol found.</CommandEmpty>
          <CommandGroup>
            {popularSymbols.map((symbol) => (
              <CommandItem
                key={symbol.value}
                value={symbol.value}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    chartData.symbol === symbol.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {symbol.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};