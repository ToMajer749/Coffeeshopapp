import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface OrderEntry {
  id: string
  date: string
  cafeName: string
  cafeId: string
  beanName: string
  beanId: string
  brewMethod: string
  rating?: number
  notes?: string
  tasteProfile: string[]
}

interface AppContextValue {
  orders: OrderEntry[]
  favoriteCafes: Set<string>
  favoriteBeans: Set<string>
  toggleFavoriteCafe: (id: string) => Promise<void>
  toggleFavoriteBean: (id: string) => Promise<void>
  allCafes: Array<{ id: string; name: string; lat?: number; lng?: number; distance?: string; rating?: number; reviews?: number; isOpen?: boolean; image_url?: string }>
  allBeans: Record<string, any>
  // Navigation / UI state
  activeTab: 'map' | 'scan' | 'history' | 'profile'
  setActiveTab: (t: 'map' | 'scan' | 'history' | 'profile') => void
  viewingCafeDetail?: string | undefined
  setViewingCafeDetail: (id?: string) => void
  viewingBeanDetail?: string | undefined
  setViewingBeanDetail: (id?: string) => void
  selectedCafe?: string | undefined
  setSelectedCafe: (id?: string) => void
  // QR flow state
  qrFlowActive: boolean
  qrFlowStep: 'scan' | 'bean-select' | 'brew-order'
  qrScannedCafeId?: string | undefined
  qrSelectedBeanId?: string | undefined
  setQRFlowStep: (s: 'scan' | 'bean-select' | 'brew-order') => void
  startQRFlow: () => void
  cancelQRFlow: () => void
  setQRScanComplete: (cafeId: string) => void
  setQRBeanSelect: (beanId: string) => void
  addOrder: (o: { cafeId: string; beanId: string; method: string; rating?: number; notes?: string; tasteProfile?: string[] }) => Promise<void>
  reload: () => Promise<void>
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderEntry[]>([])
  const [favoriteCafes, setFavoriteCafes] = useState<Set<string>>(new Set())
  const [favoriteBeans, setFavoriteBeans] = useState<Set<string>>(new Set())

  // Cache for cafe/bean names
  const [cafesMap, setCafesMap] = useState<Record<string, string>>({})
  const [beansMap, setBeansMap] = useState<Record<string, { name: string; tasteProfile: string[] }>>({})
  const [allCafes, setAllCafes] = useState<any[]>([])
  const [allBeans, setAllBeans] = useState<Record<string, any>>({})
  const [selectedCafe, setSelectedCafe] = useState<string | undefined>(undefined)
  // Navigation / UI state
  const [activeTab, setActiveTabState] = useState<'map' | 'scan' | 'history' | 'profile'>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('coffeeapp.activeTab')
        if (v === 'map' || v === 'scan' || v === 'history' || v === 'profile') return v
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return 'map'
  })

  const setActiveTab = (t: 'map' | 'scan' | 'history' | 'profile') => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('coffeeapp.activeTab', t)
      }
    } catch (e) {
      // ignore
    }
    setActiveTabState(t)
  }
  const [viewingCafeDetail, setViewingCafeDetail] = useState<string | undefined>(undefined)
  const [viewingBeanDetail, setViewingBeanDetail] = useState<string | undefined>(undefined)
  // QR flow
  const [qrFlowActive, setQrFlowActive] = useState(false)
  const [qrFlowStep, setQrFlowStep] = useState<'scan' | 'bean-select' | 'brew-order'>('scan')
  const [qrScannedCafeId, setQrScannedCafeId] = useState<string | undefined>(undefined)
  const [qrSelectedBeanId, setQrSelectedBeanId] = useState<string | undefined>(undefined)

  const loadCaches = async () => {
    try {
      const { data: cafes } = await supabase.from('cafes').select('*')
      const cafeMap: Record<string, string> = {} as Record<string, string>
      ;(cafes ?? []).forEach((c: any) => { cafeMap[c.id] = c.name })
      setCafesMap(cafeMap)

      const { data: beans } = await supabase.from('beans').select('*')
      const beanMap: Record<string, any> = {} as Record<string, any>
  const beanDetails: Record<string, any> = {}
  const beansList = (beans ?? []) as any[]
      ;beansList.forEach((b: any) => {
        beanMap[b.id] = { name: b.name, tasteProfile: b.notes ? b.notes.split(',').map((s: string) => s.trim()) : [] }
        beanDetails[b.id] = {
          id: b.id,
          name: b.name,
          origin: b.origin ?? '',
          roaster: b.roaster ?? '',
          flavorNotes: b.notes ? b.notes.split(',').map((s: string) => s.trim()) : [],
          description: b.description ?? b.notes ?? '',
          roastLevel: b.roast_level ?? '',
          process: b.process ?? '',
          altitude: b.altitude ?? '',
          imageUrl: b.image_url ?? '',
          cafeId: b.cafe_id ?? null,
          cafesOffering: [],
        }
      })
      setBeansMap(beanMap)
      setAllBeans(beanDetails)

      // Group beans by cafe so each cafe object has a `beans` array of names
      const beansByCafe: Record<string, any[]> = {}
      beansList.forEach((b: any) => {
        const cafeId = b.cafe_id ?? b.cafeId ?? null
        if (!cafeId) return
        if (!beansByCafe[cafeId]) beansByCafe[cafeId] = []
        beansByCafe[cafeId].push(b)
      })

      const normalizedCafes = (cafes ?? []).map((c: any) => {
        // coerce lat/lng to numbers when possible (DB may return strings)
        const lat = c.lat !== undefined && c.lat !== null ? Number(c.lat) : undefined
        const lng = c.lng !== undefined && c.lng !== null ? Number(c.lng) : undefined
        return {
          // keep original cafe fields but ensure expected props exist
          id: c.id,
          name: c.name,
          lat: Number.isFinite(lat) ? lat : undefined,
          lng: Number.isFinite(lng) ? lng : undefined,
          image_url: c.image_url ?? c.imageUrl ?? null,
          distance: c.distance ?? '',
          rating: c.rating ?? 0,
          reviews: c.reviews ?? 0,
          isOpen: c.is_open ?? c.isOpen ?? true,
          beans: (beansByCafe[c.id] || []).map((b: any) => b.name || b.id),
        }
      })
      setAllCafes(normalizedCafes)

      // Populate cafésOffering on each beanDetail using normalized cafes
      const cafesById: Record<string, any> = {}
      normalizedCafes.forEach((c: any) => { cafesById[c.id] = c })
      Object.values(beanDetails).forEach((bd: any) => {
        const cafeId = bd.cafeId
        if (cafeId && cafesById[cafeId]) {
          bd.cafesOffering = [
            {
              id: cafesById[cafeId].id,
              name: cafesById[cafeId].name,
              distance: cafesById[cafeId].distance ?? '',
              rating: cafesById[cafeId].rating ?? 0,
              isOpen: cafesById[cafeId].isOpen ?? true,
            },
          ]
        }
      })
      setAllBeans(beanDetails)
    } catch (err) {
      console.warn('Failed to load cafes/beans cache', err)
    }
  }

  const loadFavorites = async () => {
    try {
      const { data } = await supabase.from('favorites').select('*')
      const cafes = new Set<string>()
      const beans = new Set<string>()
      ;(data ?? []).forEach((f: any) => {
        if (f.cafe_id) cafes.add(f.cafe_id)
        if (f.bean_id) beans.add(f.bean_id)
      })
      setFavoriteCafes(cafes)
      setFavoriteBeans(beans)
    } catch (err) {
      console.warn('Failed to load favorites', err)
    }
  }

  const loadOrders = async () => {
    try {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      const mapped: OrderEntry[] = (data ?? []).map((r: any) => ({
        id: r.id,
        date: (r.brewed_at ?? r.created_at) ?? new Date().toISOString(),
        cafeName: cafesMap[r.cafe_id] ?? r.cafe_id ?? 'Unknown Café',
        cafeId: r.cafe_id,
        beanName: beansMap[r.bean_id]?.name ?? r.bean_id ?? 'Unknown Bean',
        beanId: r.bean_id,
        brewMethod: r.method ?? r.brew_method ?? 'Unknown',
        rating: r.rating ?? undefined,
        notes: r.notes ?? undefined,
        tasteProfile: beansMap[r.bean_id]?.tasteProfile ?? [],
      }))
      setOrders(mapped)
    } catch (err) {
      console.warn('Failed to load orders', err)
    }
  }

  useEffect(() => {
    // Load caches then favorites and orders
    (async () => {
      await loadCaches()
      await Promise.all([loadFavorites(), loadOrders()])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync URL -> context on back/forward
  useEffect(() => {
    const onPop = (ev: PopStateEvent) => {
      try {
        const state: any = ev.state || {}
        if (state.view === 'cafe' && state.id) {
          setViewingBeanDetail(undefined)
          setViewingCafeDetail(state.id)
          setActiveTab('map')
          setSelectedCafe(state.id)
          return
        }
        if (state.view === 'bean' && state.id) {
          setViewingCafeDetail(undefined)
          setViewingBeanDetail(state.id)
          return
        }
        if (state.view === 'history') {
          setViewingCafeDetail(undefined)
          setViewingBeanDetail(undefined)
          setActiveTab('history')
          return
        }
        // default to map
        setViewingCafeDetail(undefined)
        setViewingBeanDetail(undefined)
        setActiveTab('map')
      } catch (e) { /* noop */ }
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const toggleFavoriteCafe = async (id: string) => {
    try {
      if (favoriteCafes.has(id)) {
        // delete favorite rows where cafe_id = id
        await supabase.from('favorites').delete().eq('cafe_id', id)
        setFavoriteCafes((prev) => {
          const copy = new Set(prev)
          copy.delete(id)
          return copy
        })
      } else {
        await supabase.from('favorites').insert({ cafe_id: id })
        setFavoriteCafes((prev) => new Set(prev).add(id))
      }
    } catch (err) {
      console.warn('Failed to toggle favorite cafe', err)
    }
  }

  const toggleFavoriteBean = async (id: string) => {
    try {
      if (favoriteBeans.has(id)) {
        await supabase.from('favorites').delete().eq('bean_id', id)
        setFavoriteBeans((prev) => {
          const copy = new Set(prev)
          copy.delete(id)
          return copy
        })
      } else {
        await supabase.from('favorites').insert({ bean_id: id })
        setFavoriteBeans((prev) => new Set(prev).add(id))
      }
    } catch (err) {
      console.warn('Failed to toggle favorite bean', err)
    }
  }

  const addOrder = async ({ cafeId, beanId, method, rating, notes, tasteProfile }: any) => {
    try {
      const payload: any = { cafe_id: cafeId, bean_id: beanId, method, notes, rating }
      const { data, error } = await supabase.from('orders').insert(payload).select().single()
      if (error) throw error

      const newOrder: OrderEntry = {
        id: data.id,
        date: (data.brewed_at ?? data.created_at) ?? new Date().toISOString(),
        cafeName: cafesMap[cafeId] ?? cafeId,
        cafeId,
        beanName: beansMap[beanId]?.name ?? beanId,
        beanId,
        brewMethod: method,
        rating: data.rating ?? rating,
        notes: data.notes ?? notes,
        tasteProfile: tasteProfile ?? beansMap[beanId]?.tasteProfile ?? [],
      }

      setOrders((prev) => [newOrder, ...prev])
    } catch (err) {
      console.warn('Failed to add order', err)
      throw err
    }
  }

  const reload = async () => {
    await loadCaches()
    await Promise.all([loadFavorites(), loadOrders()])
  }

  const startQRFlow = () => {
    setQrFlowActive(true)
    setQrFlowStep('scan')
  }

  const cancelQRFlow = () => {
    setQrFlowActive(false)
    setQrFlowStep('scan')
    setQrScannedCafeId(undefined)
    setQrSelectedBeanId(undefined)
  }

  const openCafe = (id?: string) => {
    setViewingBeanDetail(undefined)
    setViewingCafeDetail(id)
    try {
      if (id) history.pushState({ view: 'cafe', id }, '', `/cafe/${id}`)
      else history.pushState({ view: 'map' }, '', `/`)
    } catch (e) { /* noop in non-browser env */ }
  }

  const openBean = (id?: string) => {
    setViewingCafeDetail(undefined)
    setViewingBeanDetail(id)
    try {
      if (id) history.pushState({ view: 'bean', id }, '', `/bean/${id}`)
      else history.pushState({ view: 'map' }, '', `/`)
    } catch (e) { }
  }

  const setQRScanComplete = (cafeId: string) => {
    setQrScannedCafeId(cafeId)
    setQrFlowStep('bean-select')
  }

  const setQRBeanSelect = (beanId: string) => {
    setQrSelectedBeanId(beanId)
    setQrFlowStep('brew-order')
  }

  return (
    <AppContext.Provider
      value={{
        orders,
        favoriteCafes,
        favoriteBeans,
        toggleFavoriteCafe,
        toggleFavoriteBean,
        addOrder,
        reload,
        allCafes,
        allBeans,
        activeTab,
        setActiveTab,
        viewingCafeDetail,
        setViewingCafeDetail,
  openCafe,
  openBean,
        viewingBeanDetail,
        setViewingBeanDetail,
  selectedCafe,
  setSelectedCafe,
        qrFlowActive,
        qrFlowStep,
  qrScannedCafeId,
  qrSelectedBeanId,
  setQRFlowStep: (s: 'scan' | 'bean-select' | 'brew-order') => setQrFlowStep(s),
        startQRFlow,
        cancelQRFlow,
        setQRScanComplete,
        setQRBeanSelect,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// expose the context object as a named export for tooling/HMR compatibility
export { AppContext }
