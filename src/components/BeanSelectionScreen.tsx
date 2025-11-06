import { ArrowLeft, Coffee, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";

interface Bean {
  id: string;
  name: string;
  origin: string;
  roaster: string;
  flavorNotes: string[];
  roastLevel: string;
}

interface BeanSelectionScreenProps {
  cafeName: string;
  beans: Bean[];
  onBack: () => void;
  onBeanSelect: (beanId: string) => void;
}

export function BeanSelectionScreen({
  cafeName,
  beans,
  onBack,
  onBeanSelect,
}: BeanSelectionScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b bg-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-slate-600">Order from</p>
            <h2>{cafeName}</h2>
          </div>
        </div>
      </div>

      {/* Bean List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Coffee className="w-5 h-5 text-amber-600" />
            <h3>Select Your Coffee Bean</h3>
          </div>

          <div className="space-y-3">
            {beans.map((bean) => (
              <button
                key={bean.id}
                onClick={() => onBeanSelect(bean.id)}
                className="w-full text-left"
              >
                <Card className="p-4 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="mb-1">{bean.name}</h4>
                      <p className="text-sm text-slate-600">{bean.origin}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Roaster:</span>
                      <span className="text-xs text-slate-900">{bean.roaster}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Roast:</span>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 text-xs"
                      >
                        {bean.roastLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {bean.flavorNotes.slice(0, 3).map((note, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-amber-100 text-amber-800 text-xs"
                      >
                        {note}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </button>
            ))}
          </div>

          <div className="h-6" />
        </div>
      </ScrollArea>
    </div>
  );
}
