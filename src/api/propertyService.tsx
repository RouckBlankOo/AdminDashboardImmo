import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api";

// Update the Property interface
export interface Property {
  _id?: string;
  id?: number; // Add this line to support both _id and id
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

// Create a configured axios instance for API requests
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      authService.logout();
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Property service with API functions
export const propertyService = {
  // Get all properties
  async getAllProperties(): Promise<Property[]> {
    try {
      const response = await apiClient.get("/properties");
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await apiClient.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new property (handles file uploads)
  async createProperty(propertyData: FormData): Promise<Property> {
    try {
      const response = await apiClient.post(
        "/properties/create",
        propertyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  // Update an existing property
  async updateProperty(id: string, propertyData: FormData): Promise<Property> {
    try {
      const response = await apiClient.put(`/properties/${id}`, propertyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a property
  async deleteProperty(id: string): Promise<void> {
    try {
      await apiClient.delete(`/properties/${id}`);
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error);
      throw error;
    }
  },
};

export default propertyService;
