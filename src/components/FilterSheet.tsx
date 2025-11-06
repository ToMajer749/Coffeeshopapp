import { X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFilters: {
    flavorNotes: string[];
    origins: string[];
    roasters: string[];
    brewMethods: string[];
  };
  onFilterChange: (category: string, value: string) => void;
  onClearAll: () => void;
}

const filterOptions = {
  flavorNotes: [
    "Chocolate",
    "Nutty",
    "Fruity",
    "Floral",
    "Caramel",
    "Berry",
    "Citrus",
    "Spicy",
  ],
  origins: [
    "Ethiopia",
    "Colombia",
    "Brazil",
    "Kenya",
    "Guatemala",
    "Costa Rica",
    "Indonesia",
    "Vietnam",
  ],
  roasters: [
    "Local Roast Co.",
    "Blue Bottle",
    "Intelligentsia",
    "Stumptown",
    "Counter Culture",
    "Verve",
    "Heart Coffee",
    "La Colombe",
  ],
  brewMethods: [
    "Espresso",
    "Pour Over",
    "French Press",
    "Aeropress",
    "Cold Brew",
    "Drip",
    "Chemex",
    "Siphon",
  ],
};

export function FilterSheet({
  open,
  onOpenChange,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: FilterSheetProps) {
  const totalFilters =
    selectedFilters.flavorNotes.length +
    selectedFilters.origins.length +
    selectedFilters.roasters.length +
    selectedFilters.brewMethods.length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="px-4 pt-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {totalFilters > 0 && (
                  <Badge className="bg-amber-600 hover:bg-amber-700">
                    {totalFilters}
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Filter coffee shops by flavor notes, bean origin, roaster, and brew method
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-140px)]">
          <div className="p-4 space-y-6">
            {/* Flavor Notes */}
            <FilterSection
              title="Flavor Notes"
              options={filterOptions.flavorNotes}
              selected={selectedFilters.flavorNotes}
              onToggle={(value) => onFilterChange("flavorNotes", value)}
            />

            <Separator />

            {/* Bean Origin */}
            <FilterSection
              title="Bean Origin"
              options={filterOptions.origins}
              selected={selectedFilters.origins}
              onToggle={(value) => onFilterChange("origins", value)}
            />

            <Separator />

            {/* Roaster */}
            <FilterSection
              title="Roaster"
              options={filterOptions.roasters}
              selected={selectedFilters.roasters}
              onToggle={(value) => onFilterChange("roasters", value)}
            />

            <Separator />

            {/* Brew Method */}
            <FilterSection
              title="Brew Method"
              options={filterOptions.brewMethods}
              selected={selectedFilters.brewMethods}
              onToggle={(value) => onFilterChange("brewMethods", value)}
            />
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
          <Button
            variant="outline"
            onClick={onClearAll}
            className="flex-1"
            disabled={totalFilters === 0}
          >
            Clear All
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-amber-600 hover:bg-amber-700"
          >
            Show Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                isSelected
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
