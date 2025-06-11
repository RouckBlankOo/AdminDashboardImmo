import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  AreaChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Property } from "../api/propertyService"; // Import Property interface from propertyService

interface PropertiesPageProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  setShowPropertyForm: (show: boolean) => void;
  setEditingProperty: (property: Property | null) => void;
  onDeleteProperty: (id: string) => Promise<boolean>; // Add onDeleteProperty prop
  isLoading: boolean;
}

// Image Carousel Component
const ImageCarousel = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">Aucune image</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[currentImageIndex]}
        alt={`${title} - Image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Navigation Buttons - Only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Image Indicators - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

export const PropertiesPage = ({
  properties,
  setProperties,
  setShowPropertyForm,
  setEditingProperty,
  onDeleteProperty,
  isLoading,
}: PropertiesPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const propertyTypes = [
    "Appartement",
    "Villa",
    "Maison",
    "Commerce",
    "Terrain",
    "Bureau",
  ];

  const handleEdit = (property: Property) => {
    console.log("Editing property:", property.id);
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ?")
    ) {
      console.log("Deleting property:", id);
      await onDeleteProperty(id);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || property.type === filterType;
    return matchesSearch && matchesFilter;
  });

  console.log("Filtered properties:", filteredProperties.length);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Gestion des Propriétés
        </h1>
        <button
          onClick={() => setShowPropertyForm(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter Propriété
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une propriété..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Tous les types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id} // Use string id derived from _id
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="relative h-48">
              <ImageCarousel
                images={
                  Array.isArray(property.image)
                    ? property.image
                    : [property.image]
                }
                title={property.title}
              />
              {property.featured && (
                <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg z-10">
                  En Vedette
                </span>
              )}
              <span
                className={`absolute top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full shadow-lg z-10 ${
                  property.status === "À Vendre"
                    ? "bg-green-500 text-white"
                    : property.status === "À Louer"
                    ? "bg-blue-500 text-white"
                    : property.status === "En Cours"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {property.status}
              </span>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                {property.location}
              </p>
              <p className="text-xl font-bold text-red-600 mb-4">
                {property.price}DT{property.isRental ? "/mois" : ""}
              </p>

              <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                {property.beds && (
                  <span className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.beds}
                  </span>
                )}
                {property.baths && (
                  <span className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.baths}
                  </span>
                )}
                <span className="flex items-center">
                  <AreaChart className="h-4 w-4 mr-1" />
                  {property.sqft}m²
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => handleEdit(property)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
