import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import propertyService, { Property } from "../api/propertyService";

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return (
      <div className="text-center text-gray-500">Propriété introuvable.</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        {property.title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {Array.isArray(property.image)
              ? property.image.map((img, index) => (
                  <img
                    key={index}
                    src={
                      img.startsWith("http")
                        ? img
                        : `https://api.sayalloimmo.com/${img}`
                    }
                    alt={`Image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))
              : property.image && (
                  <img
                    src={
                      property.image.startsWith("http")
                        ? property.image
                        : `https://api.sayalloimmo.com/${property.image}`
                    }
                    alt="Main Image"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Détails</h2>
          <p>
            <strong>Emplacement:</strong> {property.location}
          </p>
          <p>
            <strong>Prix:</strong> {property.price}DT
            {property.isRental ? "/mois" : ""}
          </p>
          <p>
            <strong>Type:</strong> {property.type}
          </p>
          <p>
            <strong>Statut:</strong> {property.status}
          </p>
          <p>
            <strong>Superficie:</strong> {property.sqft}m²
          </p>
          {property.beds && (
            <p>
              <strong>Chambres:</strong> {property.beds}
            </p>
          )}
          {property.baths && (
            <p>
              <strong>Salles de bain:</strong> {property.baths}
            </p>
          )}
          <p>
            <strong>Description:</strong> {property.description}
          </p>
          {property.tags && property.tags.length > 0 && (
            <p>
              <strong>Tags:</strong> {property.tags.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
