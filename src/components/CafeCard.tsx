import { MapPin, Coffee } from "lucide-react";
import { Badge } from "./ui/badge";

interface CafeCardProps {
  id: string;
  name: string;
  distance: string;
  beans: string[];
  rating: number;
  reviews: number;
  isOpen: boolean;
  onClick: () => void;
  isSelected?: boolean;
}

export function CafeCard({
  name,
  distance,
  beans,
  rating,
  reviews,
  isOpen,
  onClick,
  isSelected,
}: CafeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? "bg-amber-50 border-amber-200 shadow-md"
          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex gap-3">
        {/* Cafe Image Placeholder */}
        <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Coffee className="w-8 h-8 text-amber-700" />
        </div>

        {/* Cafe Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="truncate pr-2">{name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs">⭐</span>
              <span className="text-xs">{rating}</span>
              <span className="text-xs text-slate-500">({reviews})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-600 mb-2">
            <MapPin className="w-3 h-3" />
            <span className="text-sm">{distance}</span>
            <span className="text-sm">•</span>
            <span className={`text-sm ${isOpen ? "text-green-600" : "text-red-600"}`}>
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {beans.slice(0, 3).map((bean, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0 bg-slate-100 text-slate-700 hover:bg-slate-100"
              >
                {bean}
              </Badge>
            ))}
            {beans.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0 bg-slate-100 text-slate-700 hover:bg-slate-100"
              >
                +{beans.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
