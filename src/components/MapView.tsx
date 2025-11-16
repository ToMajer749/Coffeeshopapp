import { useMemo, useEffect, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

// libraries left empty to avoid requiring Advanced Marker library or Map ID
const LIBRARIES: any[] = []

interface CafeLocation {
  id: string
  name: string
  lat?: number
  lng?: number
}

interface MapViewProps {
  cafes: CafeLocation[]
  selectedCafe?: string
  onCafeSelect: (id: string) => void
}

const containerStyle = {
  width: '100%',
  height: '100%', // ensure it fills the parent's flex-1 area
}

export function MapView({ cafes, selectedCafe, onCafeSelect }: MapViewProps) {
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

  // load the "marker" library for AdvancedMarkerElement
  const { isLoaded, loadError } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: mapsKey, libraries: LIBRARIES as any })
  const mapRef = useRef<any | null>(null)
  const markersRef = useRef<any[]>([])
  const [map, setMap] = useState<any | null>(null)

  // choose a fallback center from env or default to San Francisco
  const FALLBACK_CENTER = useMemo(() => {
    const lat = Number(import.meta.env.VITE_MAP_FALLBACK_LAT ?? NaN)
    const lng = Number(import.meta.env.VITE_MAP_FALLBACK_LNG ?? NaN)
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
    return { lat: 37.7749, lng: -122.4194 }
  }, [])

  const center = useMemo(() => {
    // prefer the first cafe with valid coords
    const first = cafes.find((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng))
    if (first) return { lat: first.lat!, lng: first.lng! }
    return FALLBACK_CENTER
  }, [cafes, FALLBACK_CENTER])

  useEffect(() => {
    if (!map) return

    // clear existing markers/overlays
    markersRef.current.forEach((m) => {
      try {
        if (m && typeof (m as any).setMap === 'function') (m as any).setMap(null)
      } catch (_) {}
    })
    markersRef.current = []

    const google = (window as any).google
    if (!google || !google.maps) return

    // create markers as DOM overlays so no Map ID or AdvancedMarkerElement is required
    cafes.forEach((c) => {
      if (!Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return
      try {
        const pinColor = '#f59e0b'
        const pinHtml = document.createElement('div')
        pinHtml.style.display = 'flex'
        pinHtml.style.alignItems = 'center'
        pinHtml.style.justifyContent = 'center'
        pinHtml.style.width = '36px'
        pinHtml.style.height = '36px'
        pinHtml.style.transform = 'translateY(-6px)'
        pinHtml.style.cursor = 'pointer'
        pinHtml.innerHTML = `
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z" fill="${pinColor}"/>
            <circle cx="12" cy="9" r="2.8" fill="white"/>
          </svg>
        `

        const Overlay = function(this: any) { this.div = null } as any
        Overlay.prototype = new google.maps.OverlayView()

        Overlay.prototype.onAdd = function(this: any) {
          const div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.transform = 'translate(-50%, -100%)'
          div.style.cursor = 'pointer'
          div.innerHTML = pinHtml.innerHTML
          this.div = div
          const panes = this.getPanes && this.getPanes()
          if (panes && panes.overlayMouseTarget) panes.overlayMouseTarget.appendChild(div)
          else if (panes && panes.overlayLayer) panes.overlayLayer.appendChild(div)
          div.addEventListener('click', () => onCafeSelect(c.id))
        }

        Overlay.prototype.draw = function(this: any) {
          if (!this.div) return
          const projection = this.getProjection()
          if (!projection) return
          const pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(c.lat, c.lng))
          if (!pos) return
          this.div.style.left = pos.x + 'px'
          this.div.style.top = pos.y + 'px'
        }

        Overlay.prototype.onRemove = function(this: any) {
          if (this.div && this.div.parentNode) this.div.parentNode.removeChild(this.div)
          this.div = null
        }

        const overlay = new Overlay()
        overlay.setMap(map)
        markersRef.current.push(overlay)
      } catch (err) {
        // ignore marker creation errors
      }
    })
  }, [map, cafes, onCafeSelect])

  const hasAnyValidCoord = cafes.some((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng))

  // Pan to selected cafe when it changes
  useEffect(() => {
    if (!map || !selectedCafe) return
    const target = cafes.find((c) => c.id === selectedCafe)
    if (target && Number.isFinite(target.lat) && Number.isFinite(target.lng)) {
      try {
        map.panTo({ lat: target.lat, lng: target.lng })
        map.setZoom(15)
      } catch (e) {}
    }
  }, [map, selectedCafe, cafes])

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="max-w-lg bg-white border border-rose-100 text-rose-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Google Maps failed to load</h3>
          <p className="text-sm mb-2">This usually means your API key or billing configuration isn't valid for this origin. Common causes:</p>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Missing or invalid <code>VITE_GOOGLE_MAPS_API_KEY</code>.</li>
            <li>Billed account not enabled for Maps JavaScript API or map requests blocked.</li>
            <li>HTTP referrer restrictions on the API key block this origin (localhost or file://).</li>
            <li>Missing or invalid Map ID when using Advanced Markers.</li>
          </ul>
          <p className="text-sm">Check your <a className="underline" href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer">Google Cloud credentials</a> and ensure the Maps JavaScript API is enabled. Set environment variables in <code>.env.local</code> and restart the dev server.</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) return <div className="w-full h-full bg-slate-100 flex items-center justify-center">Loading map…</div>

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={(m) => { setMap(m); mapRef.current = m }}
      />
    </div>
  )
}
