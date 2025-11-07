import { ArrowLeft, Coffee, Heart, MapPin, TrendingUp, Award, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Cafe {
  id: string;
  name: string;
  distance: string;
}

interface Bean {
  id: string;
  name: string;
  origin: string;
}

interface OrderEntry {
  id: string;
  date: string;
  tasteProfile: string[];
}

interface UserProfileProps {
  userName: string;
  favoriteCafes: Set<string>;
  favoriteBeans: Set<string>;
  orders: OrderEntry[];
  allCafes: Cafe[];
  allBeans: { [key: string]: Bean };
  onBack?: () => void;
  onCafeClick: (cafeId: string) => void;
  onBeanClick: (beanId: string) => void;
}

export function UserProfile({
  userName,
  favoriteCafes,
  favoriteBeans,
  orders,
  allCafes,
  allBeans,
  onBack,
  onCafeClick,
  onBeanClick,
}: UserProfileProps) {
  // Get user initials
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate favorite taste profile from orders
  const tasteProfileCounts: { [key: string]: number } = {};
  orders.forEach((order) => {
    order.tasteProfile.forEach((taste) => {
      tasteProfileCounts[taste] = (tasteProfileCounts[taste] || 0) + 1;
    });
  });

  const sortedTasteProfiles = Object.entries(tasteProfileCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([taste]) => taste);

  const topTasteProfile = sortedTasteProfiles[0] || "Not enough data";

  // Get favorite cafes and beans details
  const favoriteCafesList = Array.from(favoriteCafes)
    .map((id) => allCafes.find((c) => c.id === id))
    .filter((c): c is Cafe => c !== undefined);

  const favoriteBeansList = Array.from(favoriteBeans)
    .map((id) => allBeans[id])
    .filter((b): b is Bean => b !== undefined);

  // Calculate all unique flavor preferences from favorites
  const allFlavorPreferences = new Set<string>();
  favoriteBeansList.forEach((bean) => {
    orders
      .filter((o) => o.id.includes(bean.id))
      .forEach((o) => {
        o.tasteProfile.forEach((taste) => allFlavorPreferences.add(taste));
      });
  });

  const flavorPreferenceTags = Array.from(allFlavorPreferences).concat(
    sortedTasteProfiles.filter((t) => !allFlavorPreferences.has(t))
  );

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b bg-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h2>Profile</h2>
        </div>

        {/* User Info Card */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 bg-amber-600 text-white">
              <AvatarFallback className="bg-amber-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="mb-1">{userName}</h2>
              <p className="text-sm text-slate-600">Coffee Enthusiast</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Stats Grid */}
          <div>
            <h3 className="mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-slate-600">Orders</span>
                </div>
                <p className="text-slate-900">{orders.length}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-slate-600">Top Taste</span>
                </div>
                <p className="text-slate-900 truncate">{topTasteProfile}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-slate-600">Fav Beans</span>
                </div>
                <p className="text-slate-900">{favoriteBeansList.length}</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-slate-600">Fav Cafés</span>
                </div>
                <p className="text-slate-900">{favoriteCafesList.length}</p>
              </Card>
            </div>
          </div>

          {/* Flavor Preferences */}
          {flavorPreferenceTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-amber-600" />
                <h3>Flavor Preferences</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {flavorPreferenceTags.slice(0, 12).map((taste, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-amber-100 text-amber-800"
                  >
                    {taste}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Favorite Beans */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>Favorite Beans</h3>
              <Badge variant="secondary" className="bg-slate-100">
                {favoriteBeansList.length}
              </Badge>
            </div>

            {favoriteBeansList.length === 0 ? (
              <Card className="p-6 text-center">
                <Coffee className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">
                  No favorite beans yet
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Tap the heart on bean details to save
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {favoriteBeansList.map((bean) => (
                  <Card
                    key={bean.id}
                    className="overflow-hidden cursor-pointer hover:border-amber-300 transition-colors"
                    onClick={() => onBeanClick(bean.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Coffee className="w-4 h-4 text-amber-600" />
                            <h4>{bean.name}</h4>
                          </div>
                          <p className="text-sm text-slate-600">{bean.origin}</p>
                        </div>
                        <Heart className="w-5 h-5 fill-amber-600 text-amber-600 flex-shrink-0" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Favorite Cafés */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>Favorite Cafés</h3>
              <Badge variant="secondary" className="bg-slate-100">
                {favoriteCafesList.length}
              </Badge>
            </div>

            {favoriteCafesList.length === 0 ? (
              <Card className="p-6 text-center">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">
                  No favorite cafés yet
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Tap the heart on café details to save
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {favoriteCafesList.map((cafe) => (
                  <Card
                    key={cafe.id}
                    className="overflow-hidden cursor-pointer hover:border-amber-300 transition-colors"
                    onClick={() => onCafeClick(cafe.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-amber-600" />
                            <h4>{cafe.name}</h4>
                          </div>
                          <p className="text-sm text-slate-600">{cafe.distance} away</p>
                        </div>
                        <Heart className="w-5 h-5 fill-amber-600 text-amber-600 flex-shrink-0" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="h-6" />
        </div>
      </ScrollArea>
    </div>
  );
}
