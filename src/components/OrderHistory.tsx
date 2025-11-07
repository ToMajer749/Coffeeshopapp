import { ArrowLeft, Coffee, Star, MapPin, Calendar, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface OrderEntry {
  id: string;
  date: string;
  cafeName: string;
  cafeId: string;
  beanName: string;
  beanId: string;
  brewMethod: string;
  rating?: number;
  notes?: string;
  tasteProfile: string[];
}

interface OrderHistoryProps {
  orders: OrderEntry[];
  onBack?: () => void;
  onBeanClick: (beanId: string) => void;
  onCafeClick: (cafeId: string) => void;
}

export function OrderHistory({
  orders,
  onBack,
  onBeanClick,
  onCafeClick,
}: OrderHistoryProps) {
  // Group orders by date
  const groupedOrders = orders.reduce((acc, order) => {
    const dateKey = new Date(order.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(order);
    return acc;
  }, {} as Record<string, OrderEntry[]>);

  const sortedDateKeys = Object.keys(groupedOrders).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 border-b bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
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
          <div>
            <h2>Order History</h2>
            <p className="text-sm text-slate-600">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {sortedDateKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Coffee className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="mb-2">No Orders Yet</h3>
              <p className="text-slate-600 max-w-xs">
                Scan a QR code at a café to start tracking your coffee journey
              </p>
            </div>
          ) : (
            sortedDateKeys.map((dateKey) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <h4 className="text-slate-700">{dateKey}</h4>
                </div>

                {/* Orders for this date */}
                <div className="space-y-3">
                  {groupedOrders[dateKey].map((order) => (
                    <Card key={order.id} className="overflow-hidden border-slate-200">
                      {/* Café Info */}
                      <button
                        onClick={() => onCafeClick(order.cafeId)}
                        className="w-full p-4 pb-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-600" />
                            <span className="text-slate-900">{order.cafeName}</span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(order.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </button>

                      {/* Bean & Order Details */}
                      <div className="p-4">
                        {/* Bean Name - Clickable */}
                        <button
                          onClick={() => onBeanClick(order.beanId)}
                          className="w-full text-left mb-3 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Coffee className="w-5 h-5 text-amber-600" />
                              <h4 className="group-hover:text-amber-600 transition-colors">
                                {order.beanName}
                              </h4>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                          </div>
                        </button>

                        {/* Brew Method */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-slate-600">Brew:</span>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {order.brewMethod}
                          </Badge>
                        </div>

                        {/* Rating */}
                        {order.rating && (
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= order.rating!
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Taste Profile Tags */}
                        {order.tasteProfile.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {order.tasteProfile.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-amber-100 text-amber-800 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* User Notes */}
                        {order.notes && (
                          <>
                            <Separator className="mb-3" />
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-sm text-slate-700 italic">
                                "{order.notes}"
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="h-6" />
        </div>
      </ScrollArea>
    </div>
  );
}
