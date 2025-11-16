import { ArrowLeft, QrCode, ScanLine } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState, useEffect } from 'react'

// load react-qr-reader dynamically in the browser to avoid using require()
// which isn't available in ESM/browser runtime
// QrReader will be set to the module's default export when loaded
// (keeps the component SSR-safe and avoids bundler issues)

interface QRScanScreenProps {
  onBack: () => void;
  onScanComplete: (cafeId: string) => void;
}

export function QRScanScreen({ onBack, onScanComplete }: QRScanScreenProps) {
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [QrReader, setQrReader] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    // dynamic import to avoid require() runtime error
    import('react-qr-reader')
      .then((mod) => {
  if (mounted) setQrReader(mod)
      })
      .catch((err) => {
        console.warn('Failed to load react-qr-reader', err)
        if (mounted) setQrReader(null)
      })
    return () => { mounted = false }
  }, [])

  const handleScan = (data: string | null) => {
    if (!data) return
    // Expect the QR payload to be a cafe id or a URL containing it. Try to extract numeric id.
    const trimmed = String(data).trim()
    // If payload looks like a URL with /cafe/:id, extract last path segment
    try {
      let id = trimmed
      try {
        const u = new URL(trimmed)
        id = u.pathname.split('/').filter(Boolean).pop() || trimmed
      } catch (_) {
        // not a URL
      }

      if (id) {
        onScanComplete(id)
      }
    } catch (err:any) {
      setError('Failed to parse QR payload')
    }
  }

  const handleError = (e: any) => {
  // ZXing can emit lots of stack traces during scanning; keep logs compact
  console.warn('QR Reader error', e?.message ?? e?.toString?.() ?? 'unknown')
  setError(e?.message ? String(e.message) : 'Scan error')
  }

  const handleManualSubmit = () => {
    if (!manualCode) return setError('Enter a cafe id')
    setError(null)
    onScanComplete(manualCode.trim())
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 max-w-md mx-auto">
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

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-sm aspect-square">
          <div className="absolute inset-0 border-4 border-white/30 rounded-3xl overflow-hidden">
            {(() => {
              // resolve actual component from the imported module
              if (!QrReader) return (
                <div className="w-full h-full flex items-center justify-center text-white/60">Camera unavailable</div>
              )

              let Scanner: any = null
              // Common shapes: default export is component, or named export 'QrReader' or 'default' is component
              if (typeof QrReader === 'function') Scanner = QrReader
              else if (QrReader?.default && typeof QrReader.default === 'function') Scanner = QrReader.default
              else if (QrReader?.QrReader && typeof QrReader.QrReader === 'function') Scanner = QrReader.QrReader
              else if (QrReader?.QrScanner && typeof QrReader.QrScanner === 'function') Scanner = QrReader.QrScanner

              if (!Scanner) {
                return <div className="w-full h-full flex items-center justify-center text-white/60">Camera unavailable</div>
              }

              // Prefer onResult API if available (v3) else fallback to onScan/onError
              return (
                // @ts-ignore - dynamic component
                <Scanner
                  style={{ width: '100%', height: '100%' }}
                  // v3 API
                  onResult={(result: any, error: any) => {
                    if (result) {
                      // result may be object with .text
                      const text = result?.text ?? result
                      handleScan(text)
                    }
                    if (error) handleError(error)
                  }}
                  // older API fallback
                  onScan={(data: any) => handleScan(data)}
                  onError={handleError}
                />
              )
            })()}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-3xl" />
          </div>
        </div>
      </div>

      <div className="p-6 pb-8 space-y-4">
        <Card className="p-4 bg-white/10 border-white/20 backdrop-blur">
          <div className="flex gap-3 text-white">
            <ScanLine className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="mb-1">Position the QR code within the frame</p>
              <p className="text-sm text-white/70">The code will be scanned automatically</p>
            </div>
          </div>
        </Card>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <div className="flex gap-2">
          <input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Enter cafe id manually" className="flex-1 p-2 rounded bg-white/5 text-white" />
          <Button onClick={handleManualSubmit} className="bg-amber-600 hover:bg-amber-700 text-white">Use</Button>
        </div>

        <p className="text-center text-white/60 text-sm">Find the QR code on your table or at the counter</p>
      </div>
    </div>
  )
}
