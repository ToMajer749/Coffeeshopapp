import { ArrowLeft, QrCode, ScanLine } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface QRScanScreenProps {
  onBack: () => void;
  onScanComplete: (cafeId: string) => void;
}

export function QRScanScreen({ onBack, onScanComplete }: QRScanScreenProps) {
  // Simulate QR code scanning
  const handleScan = () => {
    // In a real app, this would use the device camera
    // For demo purposes, we'll simulate scanning "Artisan Coffee Lab"
    setTimeout(() => {
      onScanComplete("1");
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-white">Scan Café QR Code</h2>
      </div>

      {/* Camera View / Scanner Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-sm aspect-square">
          {/* Scanner Frame */}
          <div className="absolute inset-0 border-4 border-white/30 rounded-3xl">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-3xl" />
            
            {/* Scanning line animation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse" />
            </div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions and Action */}
      <div className="p-6 pb-8 space-y-4">
        <Card className="p-4 bg-white/10 border-white/20 backdrop-blur">
          <div className="flex gap-3 text-white">
            <ScanLine className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">Position the QR code within the frame</p>
              <p className="text-sm text-white/70">
                The code will be scanned automatically
              </p>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleScan}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          size="lg"
        >
          <QrCode className="w-5 h-5 mr-2" />
          Scan QR Code
        </Button>

        <p className="text-center text-white/60 text-sm">
          Find the QR code on your table or at the counter
        </p>
      </div>
    </div>
  );
}
