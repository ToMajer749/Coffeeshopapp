import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { CafeCard } from "./CafeCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Cafe {
  id: string;
  name: string;
  distance: string;
  beans: string[];
  rating: number;
  reviews: number;
  isOpen: boolean;
  lat: number;
  lng: number;
}

interface CafeListPanelProps {
  cafes: Cafe[];
  selectedCafe?: string;
  onCafeSelect: (id: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
}

export function CafeListPanel({
  cafes,
  selectedCafe,
  onCafeSelect,
  onFilterClick,
  activeFilterCount,
}: CafeListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCafes = cafes.filter((cafe) =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-t-3xl shadow-2xl">
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1 bg-slate-300 rounded-full" />
      </div>

      {/* Header */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2>Specialty Coffee Shops</h2>
            <p className="text-sm text-slate-600">{filteredCafes.length} cafés nearby</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search cafés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterClick}
            className="relative flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-amber-600 hover:bg-amber-600">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Cafe List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-4">
          {filteredCafes.map((cafe) => (
            <CafeCard
              key={cafe.id}
              {...cafe}
              onClick={() => onCafeSelect(cafe.id)}
              isSelected={cafe.id === selectedCafe}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
