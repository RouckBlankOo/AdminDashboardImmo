
import React from 'react';
import { Building, DollarSign, Home, Eye } from 'lucide-react';

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
  image: string;
  dateAdded: string;
  featured: boolean;
  description: string;
  tags: string[];
  isRental: boolean;
}

interface DashboardProps {
  properties: Property[];
}

export const Dashboard = ({ properties }: DashboardProps) => {
  const stats = {
    totalProperties: properties.length,
    forSale: properties.filter(p => p.status === 'À Vendre').length,
    forRent: properties.filter(p => p.status === 'À Louer').length,
    featured: properties.filter(p => p.featured).length
  };

  console.log('Dashboard stats:', stats);

  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 lg:mb-8">
          Tableau de Bord
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Propriétés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">À Vendre</p>
                <p className="text-2xl font-bold text-gray-900">{stats.forSale}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">À Louer</p>
                <p className="text-2xl font-bold text-gray-900">{stats.forRent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Vedette</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full">
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Propriétés Récentes</h2>
          </div>
          <div className="p-4 lg:p-6">
            <div className="space-y-4">
              {properties.slice(0, 5).map(property => (
                <div key={property.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{property.location}</p>
                    <p className="text-sm font-medium text-red-600">{property.price}€{property.isRental ? '/mois' : ''}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    property.status === 'À Vendre' ? 'bg-green-100 text-green-800' :
                    property.status === 'À Louer' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
