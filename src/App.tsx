import { useState, useEffect } from "react";
import { MapView } from "./components/MapView";
import { CafeListPanel } from "./components/CafeListPanel";
import { FilterSheet } from "./components/FilterSheet";
import { CafeDetail } from "./components/CafeDetail";
import { BeanDetail } from "./components/BeanDetail";
import { QRScanScreen } from "./components/QRScanScreen";
import { BeanSelectionScreen } from "./components/BeanSelectionScreen";
import { BrewOrderScreen } from "./components/BrewOrderScreen";
import { OrderHistory } from "./components/OrderHistory";
import { UserProfile } from "./components/UserProfile";
import { BottomNav } from "./components/BottomNav";
import DraggableBottomSheet from "./components/DraggableBottomSheet";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { useAppContext } from "./context/AppContext";

export default function App() {
  const { orders: persistedOrders, favoriteCafes, favoriteBeans, toggleFavoriteCafe, toggleFavoriteBean, addOrder, allCafes, allBeans, activeTab, setActiveTab, viewingCafeDetail, setViewingCafeDetail, viewingBeanDetail, setViewingBeanDetail, qrFlowActive, qrFlowStep, qrScannedCafeId, qrSelectedBeanId, startQRFlow, cancelQRFlow, setQRScanComplete, setQRBeanSelect, setQRFlowStep, selectedCafe, setSelectedCafe, openCafe, openBean } = useAppContext();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState(persistedOrders);
 

  useEffect(() => {
    setOrderHistory(persistedOrders);
  }, [persistedOrders]);

  const [selectedFilters, setSelectedFilters] = useState({
    flavorNotes: [] as string[],
    origins: [] as string[],
    roasters: [] as string[],
    brewMethods: [] as string[],
  });

  const handleFilterChange = (
    category: string,
    value: string,
  ) => {
    setSelectedFilters((prev) => {
      const categoryFilters =
        prev[category as keyof typeof prev];
      const isSelected = categoryFilters.includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? categoryFilters.filter((item) => item !== value)
          : [...categoryFilters, value],
      };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      flavorNotes: [],
      origins: [],
      roasters: [],
      brewMethods: [],
    });
  };

  const activeFilterCount =
    selectedFilters.flavorNotes.length +
    selectedFilters.origins.length +
    selectedFilters.roasters.length +
    selectedFilters.brewMethods.length;

  const handleCafeSelect = (id: string) => {
  setSelectedCafe(id);
  openCafe(id);
  };

  const handleToggleFavoriteCafe = (id: string) => {
    // persist via Supabase
    toggleFavoriteCafe(id).catch(() => {
      toast.error('Failed to update favorite')
    })
  };

  const handleToggleFavoriteBean = (id: string) => {
    toggleFavoriteBean(id).catch(() => {
      toast.error('Failed to update favorite')
    })
  };

  // Bottom nav handler
  const handleTabChange = (tab: "map" | "scan" | "history" | "profile") => {
    // Always clear open detail screens when switching tabs so nav leads to main views
    setViewingCafeDetail(undefined)
    setViewingBeanDetail(undefined)

    if (tab === "scan") {
      // Start QR flow but keep nav visible
      startQRFlow()
    } else {
      // cancel any active QR flow and switch main tab
      cancelQRFlow()
      setActiveTab(tab)
      // if switching to map, clear selected cafe so map centers on default
      if (tab === 'map') setSelectedCafe(undefined)
    }
  };

  // QR Flow handlers
  const handleQRScanComplete = (cafeId: string) => setQRScanComplete(cafeId)
  const handleBeanSelect = (beanId: string) => setQRBeanSelect(beanId)

  const handleBrewOrderComplete = (
    brewMethod: string,
    rating?: number,
    note?: string,
  ) => {
    // Add to order history
    if (qrScannedCafeId && qrSelectedBeanId) {
      const cafe = allCafes.find((c: any) => c.id === qrScannedCafeId)
      const bean = allBeans[qrSelectedBeanId]

      if (cafe && bean) {
        // persist via Supabase
        addOrder({ cafeId: cafe.id, beanId: bean.id, method: brewMethod, rating, notes: note, tasteProfile: bean.flavorNotes }).catch(() => {
          toast.error('Failed to save order')
        })
      }
    }

    toast.success("Order saved!", {
      description: `${brewMethod} brewing method recorded${rating ? ` with ${rating} stars` : ""}`,
    });

  // Reset QR flow and return to map
  cancelQRFlow();
  setActiveTab("map");
  };

  // Determine the active screen content but always render the bottom nav fixed
  let screenContent: any = null

  // QR Flow screens
  if (qrFlowActive) {
    if (qrFlowStep === "scan") {
      screenContent = (
        <QRScanScreen onBack={() => cancelQRFlow()} onScanComplete={handleQRScanComplete} />
      )
    } else if (qrFlowStep === "bean-select" && qrScannedCafeId) {
      const cafe = allCafes.find((c) => c.id === qrScannedCafeId);
      const beansForCafe = Object.values(allBeans).filter((b: any) => b.cafeId === qrScannedCafeId);
      if (cafe) {
        screenContent = (
          <BeanSelectionScreen cafeName={cafe.name} beans={beansForCafe as any} onBack={() => startQRFlow()} onBeanSelect={handleBeanSelect} />
        )
      }
    } else if (qrFlowStep === "brew-order" && qrScannedCafeId && qrSelectedBeanId) {
      const cafe = allCafes.find((c) => c.id === qrScannedCafeId);
      const bean = allBeans[qrSelectedBeanId];
      if (cafe && bean) {
        screenContent = (
          <BrewOrderScreen
            cafeName={cafe.name}
            beanName={bean.name}
            beanOrigin={bean.origin}
            flavorNotes={bean.flavorNotes}
            onBack={() => setQRFlowStep('bean-select')}
            onComplete={handleBrewOrderComplete}
          />
        )
      }
    }
  }

  // If viewing a bean detail, show the bean detail screen
  if (!screenContent && viewingBeanDetail && allBeans[viewingBeanDetail]) {
    const bean = allBeans[viewingBeanDetail];
    screenContent = (
      <BeanDetail
        {...bean}
        isFavorite={favoriteBeans.has(bean.id)}
        onBack={() => setViewingBeanDetail(undefined)}
        onToggleFavorite={() => handleToggleFavoriteBean(bean.id)}
        onCafeClick={(cafeId) => { setViewingBeanDetail(undefined); openCafe(cafeId); }}
      />
    )
  }

  // If viewing a cafe detail, show the detail screen
  if (!screenContent && viewingCafeDetail) {
    const cafe = allCafes.find((c) => c.id === viewingCafeDetail);
    const beansForCafe = Object.values(allBeans).filter((b: any) => b.cafeId === viewingCafeDetail);
    if (cafe) {
      screenContent = (
        <CafeDetail
          id={cafe.id}
          name={cafe.name}
          rating={cafe.rating}
          reviews={cafe.reviews}
          address={cafe.address ?? ''}
          phone={cafe.phone ?? ''}
          openingHours={cafe.opening_hours ?? []}
          beans={beansForCafe as any}
          imageUrl={cafe.image_url ?? ''}
          isFavorite={favoriteCafes.has(cafe.id)}
          onBack={() => setViewingCafeDetail(undefined)}
          onToggleFavorite={() => handleToggleFavoriteCafe(cafe.id)}
          onBeanClick={(beanId) => { setViewingCafeDetail(undefined); openBean(beanId); }}
        />
      )
    }
  }

  // Main screen content based on active tab (used when no other screenContent was set)
  if (!screenContent) {
    if (activeTab === "history") {
      screenContent = (
        <div className="h-full w-full bg-white flex flex-col max-w-md mx-auto">
          <div className="flex-1 min-h-0">
            <OrderHistory orders={orderHistory} onBeanClick={(beanId) => openBean(beanId)} onCafeClick={(cafeId) => openCafe(cafeId)} />
          </div>
        </div>
      )
    } else if (activeTab === "profile") {
      screenContent = (
        <div className="h-full w-full bg-white flex flex-col max-w-md mx-auto">
          <div className="flex-1 min-h-0">
            <UserProfile userName="Alex Johnson" favoriteCafes={favoriteCafes} favoriteBeans={favoriteBeans} orders={orderHistory} allCafes={allCafes} allBeans={allBeans} onBeanClick={(beanId) => openBean(beanId)} onCafeClick={(cafeId) => openCafe(cafeId)} />
          </div>
        </div>
      )
    } else {
      // Map view
      screenContent = (
        <div className="h-full w-full bg-slate-100 flex flex-col overflow-hidden max-w-md mx-auto">
          <div className="flex-1 relative min-h-0">
            <MapView cafes={allCafes.map((c: any) => ({ id: c.id, name: c.name, lat: c.lat, lng: c.lng }))} selectedCafe={selectedCafe} onCafeSelect={(id) => { setSelectedCafe(id); openCafe(id); }} />
          </div>

          {/* Pull-up Panel - draggable sheet */}
          {/* Draggable sheet is fixed, render it once here */}
          <DraggableBottomSheet initialSnap={0.45} snaps={[0.25, 0.6, 0.95]}>
            <CafeListPanel cafes={allCafes} selectedCafe={selectedCafe} onCafeSelect={handleCafeSelect} onFilterClick={() => setFilterSheetOpen(true)} activeFilterCount={activeFilterCount} />
          </DraggableBottomSheet>
        </div>
      )
    }
  }

  // Render the app with a fixed bottom nav
  return (
    <div className="min-h-screen h-screen flex flex-col bg-white">
      {/* main content — grows to fill available space */}
      <div className="flex-1 relative overflow-auto">
        {screenContent}
      </div>

      {/* fixed bottom nav always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav activeTab={activeTab} onTabChange={(tab: "map" | "scan" | "history" | "profile") => handleTabChange(tab)} />
      </div>
    </div>
  )
}