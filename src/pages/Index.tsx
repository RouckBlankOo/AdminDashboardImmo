import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Dashboard } from "../components/Dashboard";
import { PropertiesPage } from "../components/PropertiesPage";
import { PropertyForm } from "../components/PropertyForm";
import LoginPage from "../components/LoginPage";
import authService from "../api/authService";
import propertyService, { Property } from "../api/propertyService";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated]);

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await propertyService.getAllProperties();

      // The propertyService already processes the images, so we don't need to do it again
      console.log("Fetched properties:", data);
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const handleCreateProperty = async (propertyData: FormData) => {
    try {
      const newProperty = await propertyService.createProperty(propertyData);

      // The propertyService already processes the property, including images
      setProperties((prev) => [...prev, newProperty]);
      setShowPropertyForm(false);
      return true;
    } catch (error) {
      console.error("Error creating property:", error);
      return false;
    }
  };

  const handleUpdateProperty = async (id: string, propertyData: FormData) => {
    try {
      const updatedProperty = await propertyService.updateProperty(
        id,
        propertyData
      );

      // The propertyService already processes the property, including images
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? updatedProperty : p))
      );
      setShowPropertyForm(false);
      setEditingProperty(null);
      return true;
    } catch (error) {
      console.error("Error updating property:", error);
      return false;
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      setIsLoading(true);

      console.log(`Attempting to delete property with ID: ${id}`);

      await propertyService.deleteProperty(id);

      setProperties((prev) => prev.filter((p) => p._id !== id));

      console.log(`Property with ID ${id} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error);

      setError(
        `Failed to delete property. ${
          error instanceof Error ? error.message : "Please try again later."
        }`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Tableau de Bord";
      case "properties":
        return "Gestion des Propriétés";
      default:
        return "Dashboard";
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col w-full min-w-0 ${
          sidebarOpen ? "lg:ml-64" : ""
        } transition-all duration-300`}
      >
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40 flex-shrink-0 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 w-full">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-800">
                  {getPageTitle()}
                </h1>
                {isLoading && (
                  <span className="text-sm text-gray-500">
                    Chargement des données...
                  </span>
                )}
                {error && <span className="text-sm text-red-500">{error}</span>}
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-sm text-gray-600">
                  {"Bienvenue, Admin"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto w-full">
          <div className="h-full w-full">
            {showPropertyForm && (
              <PropertyForm
                properties={properties}
                setProperties={setProperties}
                showPropertyForm={showPropertyForm}
                setShowPropertyForm={setShowPropertyForm}
                editingProperty={editingProperty}
                setEditingProperty={setEditingProperty}
                onCreateProperty={handleCreateProperty}
                onUpdateProperty={handleUpdateProperty}
              />
            )}

            {currentPage === "dashboard" && (
              <Dashboard
                properties={properties.map((prop) => ({
                  ...prop,
                  id: prop._id,
                  image: Array.isArray(prop.image) ? prop.image[0] : prop.image,
                  isRental: prop.isRental ?? false,
                }))}
              />
            )}

            {currentPage === "properties" && (
              <PropertiesPage
                properties={properties}
                setProperties={setProperties}
                setShowPropertyForm={setShowPropertyForm}
                setEditingProperty={setEditingProperty}
                onDeleteProperty={handleDeleteProperty}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
