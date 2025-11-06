import { useState } from "react";
import { ArrowLeft, Coffee, Star, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface BrewMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface BrewOrderScreenProps {
  cafeName: string;
  beanName: string;
  beanOrigin: string;
  flavorNotes: string[];
  onBack: () => void;
  onComplete: (brewMethod: string, rating?: number, note?: string) => void;
}

const brewMethods: BrewMethod[] = [
  { id: "espresso", name: "Espresso", icon: "☕", description: "Rich & intense" },
  { id: "pour-over", name: "Pour Over", icon: "🫗", description: "Clean & nuanced" },
  { id: "french-press", name: "French Press", icon: "🫖", description: "Full-bodied" },
  { id: "cold-brew", name: "Cold Brew", icon: "🧊", description: "Smooth & sweet" },
  { id: "aeropress", name: "AeroPress", icon: "⚗️", description: "Versatile & quick" },
  { id: "chemex", name: "Chemex", icon: "🔬", description: "Bright & clear" },
];

export function BrewOrderScreen({
  cafeName,
  beanName,
  beanOrigin,
  flavorNotes,
  onBack,
  onComplete,
}: BrewOrderScreenProps) {
  const [selectedBrewMethod, setSelectedBrewMethod] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [note, setNote] = useState("");

  const handleComplete = () => {
    if (selectedBrewMethod) {
      onComplete(selectedBrewMethod, rating || undefined, note || undefined);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-slate-600">{cafeName}</p>
            <h3>{beanName}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Bean Info */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <Coffee className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">{beanOrigin}</p>
                <div className="flex flex-wrap gap-1">
                  {flavorNotes.map((note, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-amber-600 text-white text-xs"
                    >
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Brew Method Selection */}
          <div>
            <h3 className="mb-3">Select Brew Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {brewMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedBrewMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedBrewMethod === method.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{method.icon}</span>
                    {selectedBrewMethod === method.id && (
                      <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="mb-1">{method.name}</p>
                  <p className="text-xs text-slate-600">{method.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Rating */}
          <div>
            <h4 className="mb-3">Rate Your Experience (Optional)</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <h4 className="mb-3">Add a Note (Optional)</h4>
            <Textarea
              placeholder="How did it taste? Any thoughts to remember for next time..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none h-24"
            />
          </div>

          <div className="h-6" />
        </div>
      </ScrollArea>

      {/* Fixed Bottom Button */}
      <div className="p-4 border-t bg-white flex-shrink-0">
        <Button
          onClick={handleComplete}
          disabled={!selectedBrewMethod}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300"
          size="lg"
        >
          {rating || note ? "Save Tasting Note" : "Complete Order"}
        </Button>
      </div>
    </div>
  );
}
