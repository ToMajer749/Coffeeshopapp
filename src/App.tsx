import { useState } from "react";
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
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

// Mock bean details data
const beanDetails = {
  "ethiopian-yirgacheffe": {
    id: "ethiopian-yirgacheffe",
    name: "Ethiopian Yirgacheffe",
    origin: "Yirgacheffe, Ethiopia",
    roaster: "Blue Bottle Coffee",
    flavorNotes: ["Floral", "Citrus", "Blueberry", "Tea-like"],
    description:
      "A delicate and complex coffee with bright acidity and distinctive floral aromatics. This washed Ethiopian coffee showcases the signature characteristics of the Yirgacheffe region, known for producing some of the world's finest specialty coffees.",
    roastLevel: "Light",
    process: "Washed",
    altitude: "1,700-2,200m",
    imageUrl:
      "https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzYyNDE5MTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    cafesOffering: [
      {
        id: "1",
        name: "Artisan Coffee Lab",
        distance: "0.3 mi",
        rating: 4.8,
        isOpen: true,
      },
      {
        id: "3",
        name: "Brew & Co.",
        distance: "0.7 mi",
        rating: 4.9,
        isOpen: true,
      },
      {
        id: "7",
        name: "Morning Glory Coffee",
        distance: "1.5 mi",
        rating: 4.8,
        isOpen: true,
      },
    ],
  },
  "colombian-supremo": {
    id: "colombian-supremo",
    name: "Colombian Supremo",
    origin: "Huila, Colombia",
    roaster: "Intelligentsia",
    flavorNotes: ["Chocolate", "Caramel", "Nutty", "Balanced"],
    description:
      "A classic Colombian coffee with smooth body and sweet chocolate notes. Supremo grade beans are the largest and most prized from Colombia, offering a consistently delicious cup with balanced acidity and rich, full-bodied character.",
    roastLevel: "Medium",
    process: "Fully Washed",
    altitude: "1,500-1,800m",
    imageUrl:
      "https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzYyNDE5MTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    cafesOffering: [
      {
        id: "1",
        name: "Artisan Coffee Lab",
        distance: "0.3 mi",
        rating: 4.8,
        isOpen: true,
      },
      {
        id: "3",
        name: "Brew & Co.",
        distance: "0.7 mi",
        rating: 4.9,
        isOpen: true,
      },
    ],
  },
  "kenyan-aa": {
    id: "kenyan-aa",
    name: "Kenyan AA",
    origin: "Nyeri, Kenya",
    roaster: "Counter Culture",
    flavorNotes: ["Blackcurrant", "Winey", "Bright", "Complex"],
    description:
      "Vibrant and bold with intense fruity acidity. AA is the highest grade of Kenyan coffee, featuring large beans and exceptional cup quality. This coffee delivers a wine-like complexity with layers of berry flavors and a crisp, bright finish.",
    roastLevel: "Light-Medium",
    process: "Washed",
    altitude: "1,600-2,100m",
    imageUrl:
      "https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzYyNDE5MTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
    cafesOffering: [
      {
        id: "1",
        name: "Artisan Coffee Lab",
        distance: "0.3 mi",
        rating: 4.8,
        isOpen: true,
      },
      {
        id: "7",
        name: "Morning Glory Coffee",
        distance: "1.5 mi",
        rating: 4.8,
        isOpen: true,
      },
    ],
  },
};

// Mock detailed cafe data
const cafeDetails = {
  "1": {
    address: "123 Mission Street, San Francisco, CA 94103",
    phone: "(415) 555-0123",
    imageUrl:
      "https://images.unsplash.com/photo-1716808681381-52cf8055b02d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsdHklMjBjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYyNDYwODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    openingHours: [
      { day: "Monday", hours: "7:00 AM - 6:00 PM" },
      { day: "Tuesday", hours: "7:00 AM - 6:00 PM" },
      { day: "Wednesday", hours: "7:00 AM - 6:00 PM" },
      { day: "Thursday", hours: "7:00 AM - 8:00 PM" },
      { day: "Friday", hours: "7:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "8:00 AM - 8:00 PM" },
      { day: "Sunday", hours: "8:00 AM - 6:00 PM" },
    ],
    beans: [
      {
        id: "ethiopian-yirgacheffe",
        name: "Ethiopian Yirgacheffe",
        origin: "Yirgacheffe, Ethiopia",
        roaster: "Blue Bottle Coffee",
        flavorNotes: [
          "Floral",
          "Citrus",
          "Blueberry",
          "Tea-like",
        ],
      },
      {
        id: "colombian-supremo",
        name: "Colombian Supremo",
        origin: "Huila, Colombia",
        roaster: "Intelligentsia",
        flavorNotes: [
          "Chocolate",
          "Caramel",
          "Nutty",
          "Balanced",
        ],
      },
      {
        id: "kenyan-aa",
        name: "Kenyan AA",
        origin: "Nyeri, Kenya",
        roaster: "Counter Culture",
        flavorNotes: [
          "Blackcurrant",
          "Winey",
          "Bright",
          "Complex",
        ],
      },
    ],
  },
};

// Mock data for cafes
const mockCafes = [
  {
    id: "1",
    name: "Artisan Coffee Lab",
    distance: "0.3 mi",
    beans: [
      "Ethiopian Yirgacheffe",
      "Colombian Supremo",
      "Kenyan AA",
    ],
    rating: 4.8,
    reviews: 234,
    isOpen: true,
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: "2",
    name: "The Daily Grind",
    distance: "0.5 mi",
    beans: [
      "Brazilian Santos",
      "Guatemalan Antigua",
      "Sumatra Mandheling",
    ],
    rating: 4.6,
    reviews: 187,
    isOpen: true,
    lat: 37.7739,
    lng: -122.4312,
  },
  {
    id: "3",
    name: "Brew & Co.",
    distance: "0.7 mi",
    beans: [
      "Costa Rican Tarrazu",
      "Ethiopian Sidamo",
      "Colombian Huila",
    ],
    rating: 4.9,
    reviews: 412,
    isOpen: true,
    lat: 37.7829,
    lng: -122.4089,
  },
  {
    id: "4",
    name: "Third Wave Roasters",
    distance: "0.9 mi",
    beans: [
      "Kenyan Peaberry",
      "Yemeni Mocha",
      "Panama Geisha",
      "Java Estate",
    ],
    rating: 4.7,
    reviews: 298,
    isOpen: false,
    lat: 37.7689,
    lng: -122.4272,
  },
  {
    id: "5",
    name: "Espresso Yourself",
    distance: "1.1 mi",
    beans: [
      "Brazilian Cerrado",
      "Ethiopian Harrar",
      "Colombian Nariño",
    ],
    rating: 4.5,
    reviews: 156,
    isOpen: true,
    lat: 37.7799,
    lng: -122.4163,
  },
  {
    id: "6",
    name: "Bean Scene",
    distance: "1.3 mi",
    beans: ["Guatemalan Huehuetenango", "Costa Rican Tarrazu"],
    rating: 4.6,
    reviews: 203,
    isOpen: true,
    lat: 37.7659,
    lng: -122.4231,
  },
  {
    id: "7",
    name: "Morning Glory Coffee",
    distance: "1.5 mi",
    beans: [
      "Ethiopian Limu",
      "Kenyan Nyeri",
      "Burundi Kayanza",
    ],
    rating: 4.8,
    reviews: 342,
    isOpen: true,
    lat: 37.7819,
    lng: -122.4124,
  },
  {
    id: "8",
    name: "Roast & Toast",
    distance: "1.7 mi",
    beans: [
      "Colombian Popayan",
      "Brazilian Mogiana",
      "Tanzanian Peaberry",
    ],
    rating: 4.4,
    reviews: 127,
    isOpen: false,
    lat: 37.7709,
    lng: -122.4352,
  },
];

// Mock order history data
const mockOrderHistory = [
  {
    id: "order-1",
    date: "2025-11-06T09:30:00",
    cafeName: "Artisan Coffee Lab",
    cafeId: "1",
    beanName: "Ethiopian Yirgacheffe",
    beanId: "ethiopian-yirgacheffe",
    brewMethod: "Pour Over",
    rating: 5,
    notes:
      "Incredible floral notes, very bright and clean. Best pour over I've had in weeks!",
    tasteProfile: ["Floral", "Citrus", "Blueberry"],
  },
  {
    id: "order-2",
    date: "2025-11-06T14:15:00",
    cafeName: "Brew & Co.",
    cafeId: "3",
    beanName: "Colombian Supremo",
    beanId: "colombian-supremo",
    brewMethod: "Espresso",
    rating: 4,
    notes: "Smooth and balanced with nice chocolate notes",
    tasteProfile: ["Chocolate", "Caramel", "Nutty"],
  },
  {
    id: "order-3",
    date: "2025-11-05T10:00:00",
    cafeName: "Artisan Coffee Lab",
    cafeId: "1",
    beanName: "Kenyan AA",
    beanId: "kenyan-aa",
    brewMethod: "Chemex",
    rating: 5,
    notes:
      "Bright acidity with amazing berry flavors. Complex and delicious.",
    tasteProfile: ["Blackcurrant", "Winey", "Bright"],
  },
  {
    id: "order-4",
    date: "2025-11-05T15:30:00",
    cafeName: "The Daily Grind",
    cafeId: "2",
    beanName: "Colombian Supremo",
    beanId: "colombian-supremo",
    brewMethod: "French Press",
    notes: "Good body, very smooth",
    tasteProfile: ["Chocolate", "Balanced"],
  },
  {
    id: "order-5",
    date: "2025-11-04T08:45:00",
    cafeName: "Brew & Co.",
    cafeId: "3",
    beanName: "Ethiopian Yirgacheffe",
    beanId: "ethiopian-yirgacheffe",
    brewMethod: "AeroPress",
    rating: 4,
    tasteProfile: ["Floral", "Tea-like"],
  },
];

export default function App() {
  const [selectedCafe, setSelectedCafe] = useState<
    string | undefined
  >();
  const [viewingCafeDetail, setViewingCafeDetail] = useState<
    string | undefined
  >();
  const [viewingBeanDetail, setViewingBeanDetail] = useState<
    string | undefined
  >();
  const [favoriteCafes, setFavoriteCafes] = useState<
    Set<string>
  >(new Set());
  const [favoriteBeans, setFavoriteBeans] = useState<
    Set<string>
  >(new Set());
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  
  // Bottom navigation state
  const [activeTab, setActiveTab] = useState<"map" | "scan" | "history" | "profile">("map");

  // QR Code flow states
  const [qrFlowActive, setQrFlowActive] = useState(false);
  const [qrFlowStep, setQrFlowStep] = useState<
    "scan" | "bean-select" | "brew-order"
  >("scan");
  const [qrScannedCafeId, setQrScannedCafeId] = useState<
    string | undefined
  >();
  const [qrSelectedBeanId, setQrSelectedBeanId] = useState<
    string | undefined
  >();
  const [orderHistory, setOrderHistory] =
    useState(mockOrderHistory);

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
    setViewingCafeDetail(id);
  };

  const handleToggleFavoriteCafe = (id: string) => {
    setFavoriteCafes((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleToggleFavoriteBean = (id: string) => {
    setFavoriteBeans((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // Bottom nav handler
  const handleTabChange = (tab: "map" | "scan" | "history" | "profile") => {
    if (tab === "scan") {
      // Start QR flow
      setQrFlowActive(true);
      setQrFlowStep("scan");
    } else {
      setActiveTab(tab);
    }
  };

  // QR Flow handlers
  const handleStartQRFlow = () => {
    setQrFlowActive(true);
    setQrFlowStep("scan");
  };

  const handleQRScanComplete = (cafeId: string) => {
    setQrScannedCafeId(cafeId);
    setQrFlowStep("bean-select");
  };

  const handleBeanSelect = (beanId: string) => {
    setQrSelectedBeanId(beanId);
    setQrFlowStep("brew-order");
  };

  const handleBrewOrderComplete = (
    brewMethod: string,
    rating?: number,
    note?: string,
  ) => {
    // Add to order history
    if (qrScannedCafeId && qrSelectedBeanId) {
      const cafe = mockCafes.find(
        (c) => c.id === qrScannedCafeId,
      );
      const details =
        cafeDetails[
          qrScannedCafeId as keyof typeof cafeDetails
        ];
      const bean = details?.beans.find(
        (b) => b.id === qrSelectedBeanId,
      );

      if (cafe && bean) {
        const newOrder = {
          id: `order-${Date.now()}`,
          date: new Date().toISOString(),
          cafeName: cafe.name,
          cafeId: cafe.id,
          beanName: bean.name,
          beanId: bean.id,
          brewMethod,
          rating,
          notes: note,
          tasteProfile: bean.flavorNotes,
        };

        setOrderHistory((prev) => [newOrder, ...prev]);
      }
    }

    toast.success("Order saved!", {
      description: `${brewMethod} brewing method recorded${rating ? ` with ${rating} stars` : ""}`,
    });

    // Reset QR flow and return to map
    setQrFlowActive(false);
    setQrFlowStep("scan");
    setQrScannedCafeId(undefined);
    setQrSelectedBeanId(undefined);
    setActiveTab("map");
  };

  // QR Flow screens
  if (qrFlowActive) {
    if (qrFlowStep === "scan") {
      return (
        <QRScanScreen
          onBack={() => setQrFlowActive(false)}
          onScanComplete={handleQRScanComplete}
        />
      );
    }

    if (qrFlowStep === "bean-select" && qrScannedCafeId) {
      const cafe = mockCafes.find(
        (c) => c.id === qrScannedCafeId,
      );
      const details =
        cafeDetails[
          qrScannedCafeId as keyof typeof cafeDetails
        ];

      if (cafe && details) {
        return (
          <BeanSelectionScreen
            cafeName={cafe.name}
            beans={details.beans}
            onBack={() => setQrFlowStep("scan")}
            onBeanSelect={handleBeanSelect}
          />
        );
      }
    }

    if (
      qrFlowStep === "brew-order" &&
      qrScannedCafeId &&
      qrSelectedBeanId
    ) {
      const cafe = mockCafes.find(
        (c) => c.id === qrScannedCafeId,
      );
      const details =
        cafeDetails[
          qrScannedCafeId as keyof typeof cafeDetails
        ];
      const bean = details?.beans.find(
        (b) => b.id === qrSelectedBeanId,
      );

      if (cafe && bean) {
        return (
          <BrewOrderScreen
            cafeName={cafe.name}
            beanName={bean.name}
            beanOrigin={bean.origin}
            flavorNotes={bean.flavorNotes}
            onBack={() => setQrFlowStep("bean-select")}
            onComplete={handleBrewOrderComplete}
          />
        );
      }
    }
  }



  // If viewing a bean detail, show the bean detail screen
  if (
    viewingBeanDetail &&
    beanDetails[viewingBeanDetail as keyof typeof beanDetails]
  ) {
    const bean =
      beanDetails[
        viewingBeanDetail as keyof typeof beanDetails
      ];

    return (
      <BeanDetail
        {...bean}
        isFavorite={favoriteBeans.has(bean.id)}
        onBack={() => {
          setViewingBeanDetail(undefined);
        }}
        onToggleFavorite={() =>
          handleToggleFavoriteBean(bean.id)
        }
        onCafeClick={(cafeId) => {
          setViewingBeanDetail(undefined);
          setViewingCafeDetail(cafeId);
        }}
      />
    );
  }

  // If viewing a cafe detail, show the detail screen
  if (
    viewingCafeDetail &&
    cafeDetails[viewingCafeDetail as keyof typeof cafeDetails]
  ) {
    const cafe = mockCafes.find(
      (c) => c.id === viewingCafeDetail,
    );
    const details =
      cafeDetails[
        viewingCafeDetail as keyof typeof cafeDetails
      ];

    if (cafe && details) {
      return (
        <CafeDetail
          id={cafe.id}
          name={cafe.name}
          rating={cafe.rating}
          reviews={cafe.reviews}
          address={details.address}
          phone={details.phone}
          openingHours={details.openingHours}
          beans={details.beans}
          imageUrl={details.imageUrl}
          isFavorite={favoriteCafes.has(cafe.id)}
          onBack={() => setViewingCafeDetail(undefined)}
          onToggleFavorite={() =>
            handleToggleFavoriteCafe(cafe.id)
          }
          onBeanClick={(beanId) => {
            setViewingCafeDetail(undefined);
            setViewingBeanDetail(beanId);
          }}
        />
      );
    }
  }

  // Main screen content based on active tab
  const renderMainContent = () => {
    if (activeTab === "history") {
      return (
        <div className="h-screen w-full bg-white flex flex-col max-w-md mx-auto">
          <div className="flex-1 min-h-0">
            <OrderHistory
              orders={orderHistory}
              onBeanClick={(beanId) => {
                setViewingBeanDetail(beanId);
              }}
              onCafeClick={(cafeId) => {
                setViewingCafeDetail(cafeId);
              }}
            />
          </div>
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      );
    }

    if (activeTab === "profile") {
      return (
        <div className="h-screen w-full bg-white flex flex-col max-w-md mx-auto">
          <div className="flex-1 min-h-0">
            <UserProfile
              userName="Alex Johnson"
              favoriteCafes={favoriteCafes}
              favoriteBeans={favoriteBeans}
              orders={orderHistory}
              allCafes={mockCafes}
              allBeans={beanDetails}
              onBeanClick={(beanId) => {
                setViewingBeanDetail(beanId);
              }}
              onCafeClick={(cafeId) => {
                setViewingCafeDetail(cafeId);
              }}
            />
          </div>
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      );
    }

    // Default: Map view
    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden max-w-md mx-auto">
        {/* Map Section */}
        <div className="flex-1 relative min-h-0">
          <MapView
            cafes={mockCafes}
            selectedCafe={selectedCafe}
            onCafeSelect={setSelectedCafe}
          />
        </div>

        {/* Pull-up Panel - reduced height to account for bottom nav */}
        <div className="h-[45vh] flex-shrink-0">
          <CafeListPanel
            cafes={mockCafes}
            selectedCafe={selectedCafe}
            onCafeSelect={handleCafeSelect}
            onFilterClick={() => setFilterSheetOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Filter Sheet */}
        <FilterSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearFilters}
        />

        {/* Toast notifications */}
        <Toaster />
      </div>
    );
  };

  return renderMainContent();
}