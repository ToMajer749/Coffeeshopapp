import { ArrowLeft, Heart, MapPin, Coffee } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CafeOffering {
  id: string;
  name: string;
  distance: string;
  rating: number;
  isOpen: boolean;
}

interface BeanDetailProps {
  id: string;
  name: string;
  origin: string;
  roaster: string;
  flavorNotes: string[];
  description: string;
  roastLevel: string;
  process: string;
  altitude: string;
  cafesOffering: CafeOffering[];
  imageUrl: string;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onCafeClick: (cafeId: string) => void;
}

export function BeanDetail({
  name,
  origin,
  roaster,
  flavorNotes,
  description,
  roastLevel,
  process,
  altitude,
  cafesOffering,
  imageUrl,
  isFavorite,
  onBack,
  onToggleFavorite,
  onCafeClick,
}: BeanDetailProps) {
  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header with Image */}
      <div className="relative h-64 flex-shrink-0">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-lg"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-700"}`}
          />
        </Button>

        {/* Bean name at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white mb-1">{name}</h1>
          <p className="text-white/90">{roaster}</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Origin</p>
              <p className="text-slate-900">{origin}</p>
            </Card>
            <Card className="p-3 border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Roast Level</p>
              <p className="text-slate-900">{roastLevel}</p>
            </Card>
            <Card className="p-3 border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Process</p>
              <p className="text-slate-900">{process}</p>
            </Card>
            <Card className="p-3 border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Altitude</p>
              <p className="text-slate-900">{altitude}</p>
            </Card>
          </div>

          <Separator />

          {/* Flavor Notes */}
          <div>
            <h3 className="mb-3">Flavor Profile</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {flavorNotes.map((note, index) => (
                <Badge
                  key={index}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1"
                >
                  {note}
                </Badge>
              ))}
            </div>
            <p className="text-slate-700">{description}</p>
          </div>

          <Separator />

          {/* Cafés Offering This Bean */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-600" />
              Available At ({cafesOffering.length})
            </h3>
            <div className="space-y-3">
              {cafesOffering.map((cafe) => (
                <button
                  key={cafe.id}
                  onClick={() => onCafeClick(cafe.id)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="pr-2">{cafe.name}</h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs">⭐</span>
                      <span className="text-xs">{cafe.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span>{cafe.distance}</span>
                    </div>
                    <span
                      className={`${
                        cafe.isOpen ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {cafe.isOpen ? "Open now" : "Closed"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom spacing for safe area */}
          <div className="h-6" />
        </div>
      </ScrollArea>

      {/* Fixed Bottom Button */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <Button
          onClick={onToggleFavorite}
          className={`w-full ${
            isFavorite
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-white" : ""}`} />
          {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
        </Button>
      </div>
    </div>
  );
}
