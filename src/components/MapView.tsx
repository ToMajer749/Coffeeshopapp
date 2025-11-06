import { MapPin } from "lucide-react";

interface CafeLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  cafes: CafeLocation[];
  selectedCafe?: string;
  onCafeSelect: (id: string) => void;
}

export function MapView({ cafes, selectedCafe, onCafeSelect }: MapViewProps) {
  // Mock map - in production this would be Google Maps, Mapbox, etc.
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
      {/* Map grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-slate-300" />
          ))}
        </div>
      </div>

      {/* Street lines for map effect */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#94a3b8" strokeWidth="2" />
      </svg>

      {/* Cafe markers */}
      {cafes.map((cafe, index) => {
        const left = 15 + (index * 18) % 70;
        const top = 20 + (index * 23) % 60;
        const isSelected = cafe.id === selectedCafe;

        return (
          <button
            key={cafe.id}
            onClick={() => onCafeSelect(cafe.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <div
              className={`relative ${
                isSelected ? "scale-125" : "scale-100 hover:scale-110"
              } transition-transform`}
            >
              <div
                className={`rounded-full p-2 shadow-lg ${
                  isSelected
                    ? "bg-amber-600 ring-4 ring-amber-200"
                    : "bg-white ring-2 ring-slate-300"
                }`}
              >
                <MapPin
                  className={`w-5 h-5 ${
                    isSelected ? "text-white" : "text-amber-600"
                  }`}
                  fill={isSelected ? "white" : "#d97706"}
                />
              </div>
              {isSelected && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs">
                  {cafe.name}
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* User location indicator */}
      <div className="absolute bottom-[45%] left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75" />
        </div>
      </div>
    </div>
  );
}
