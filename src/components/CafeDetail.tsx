import { ArrowLeft, Heart, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Bean {
  id: string;
  name: string;
  origin: string;
  roaster: string;
  flavorNotes: string[];
}

interface CafeDetailProps {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  openingHours: {
    day: string;
    hours: string;
  }[];
  beans: Bean[];
  imageUrl: string;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onBeanClick?: (beanId: string) => void;
}

export function CafeDetail({
  name,
  rating,
  reviews,
  address,
  phone,
  openingHours,
  beans,
  imageUrl,
  isFavorite,
  onBack,
  onToggleFavorite,
  onBeanClick,
}: CafeDetailProps) {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header with Image */}
      <div className="relative h-64 flex-shrink-0">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        
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
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Cafe Name and Rating */}
          <div>
            <h1 className="mb-2">{name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-lg">⭐</span>
                <span>{rating}</span>
              </div>
              <span className="text-slate-600">({reviews} reviews)</span>
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              Location
            </h3>
            <p className="text-slate-700 mb-2">{address}</p>
            <p className="text-slate-600 mb-3">{phone}</p>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank')}
            >
              <span>View on Map</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <Separator />

          {/* Opening Hours */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Opening Hours
            </h3>
            <div className="space-y-2">
              {openingHours.map((schedule) => (
                <div
                  key={schedule.day}
                  className={`flex justify-between p-2 rounded-lg ${
                    schedule.day === currentDay ? "bg-amber-50" : ""
                  }`}
                >
                  <span className={schedule.day === currentDay ? "" : "text-slate-600"}>
                    {schedule.day}
                  </span>
                  <span className={schedule.day === currentDay ? "" : "text-slate-700"}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Coffee Beans Available */}
          <div>
            <h3 className="mb-3">Coffee Beans Available</h3>
            <div className="space-y-3">
              {beans.map((bean, index) => (
                <Card
                  key={index}
                  className={`p-4 border-slate-200 ${onBeanClick ? "cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-all" : ""}`}
                  onClick={() => onBeanClick && onBeanClick(bean.id)}
                >
                  <h4 className="mb-2">{bean.name}</h4>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-slate-600 min-w-[70px]">Origin:</span>
                      <span className="text-sm text-slate-900">{bean.origin}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-slate-600 min-w-[70px]">Roaster:</span>
                      <span className="text-sm text-slate-900">{bean.roaster}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600 mb-2 block">Flavor Notes:</span>
                    <div className="flex flex-wrap gap-1">
                      {bean.flavorNotes.map((note, noteIndex) => (
                        <Badge
                          key={noteIndex}
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                        >
                          {note}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
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
          {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
        </Button>
      </div>
    </div>
  );
}
