// If you need to define the Property type inline
interface Property {
    id: number;
    title: string;
    location: string;
    price: string;
    type: string;
    status: string;
    beds?: number;
    baths?: number;
    sqft: number;
    image?: string;
    planImage?: string;
    dateAdded?: string;
    featured: boolean;
    description: string;
    tags: string[];
    isRental?: boolean;
  }
  
  // Then use it in your state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);