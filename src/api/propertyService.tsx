// propertyService.tsx - Updated with better error handling and debugging
import axios from "axios";
import authService from "./authService";

const API_URL = "http://localhost:5000/api";

export interface Property {
  _id?: string; // MongoDB ID
  id?: string; // Frontend ID derived from _id
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
  timeout: 30000, // 30 seconds timeout
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token attached to request:", token.substring(0, 20) + "...");
    } else {
      console.warn("No token found for authenticated request");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `API Response [${response.config.method?.toUpperCase()}] ${
        response.config.url
      }:`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error(
      `API Error [${error.config?.method?.toUpperCase()}] ${
        error.config?.url
      }:`,
      {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.message,
      }
    );

    if (error.response && error.response.status === 401) {
      console.warn("Authentication failed - redirecting to login");
      // Token expired or invalid
      authService.logout();
      window.location.href = "/";
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
      throw new Error("Failed to fetch properties");
    }
  },

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await apiClient.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw new Error("Failed to fetch property");
    }
  },

  // Create a new property (handles file uploads)
  async createProperty(propertyData: FormData): Promise<Property> {
    try {
      // Log FormData contents for debugging
      console.log("Creating property with data:");
      for (const [key, value] of propertyData.entries()) {
        console.log(key, value);
      }

      const response = await apiClient.post(
        "/properties/create",
        propertyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Property created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const message =
            error.response.data?.message || "Failed to create property";
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error("Network error - please check your connection");
        }
      }

      throw new Error("Failed to create property");
    }
  },

  // Update an existing property
  async updateProperty(id: string, propertyData: FormData): Promise<Property> {
    try {
      // Log FormData contents for debugging
      console.log(`Updating property ${id} with data:`);
      for (const [key, value] of propertyData.entries()) {
        console.log(key, value);
      }

      const response = await apiClient.put(`/properties/${id}`, propertyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Property updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message =
            error.response.data?.message || "Failed to update property";
          throw new Error(message);
        } else if (error.request) {
          throw new Error("Network error - please check your connection");
        }
      }

      throw new Error("Failed to update property");
    }
  },

  // Delete a property with improved error handling
  async deleteProperty(id: string): Promise<void> {
    try {
      // Check if we have a valid token before making the request
      const token = authService.getToken();
      if (!token) {
        throw new Error("Authentication required - please log in again");
      }

      console.log(`Sending DELETE request to: ${API_URL}/properties/${id}`);
      console.log(`Using token: ${token.substring(0, 20)}...`);

      // Make the delete request
      const response = await apiClient.delete(`/properties/${id}`);

      console.log("Delete property response:", response.data);
      console.log(`Successfully deleted property with ID: ${id}`);
    } catch (error) {
      console.error(
        `Error in propertyService.deleteProperty for ID ${id}:`,
        error
      );

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error
          const status = error.response.status;
          const message =
            error.response.data?.message || "Failed to delete property";

          if (status === 401) {
            throw new Error("Authentication failed - please log in again");
          } else if (status === 404) {
            throw new Error(
              "Property not found - it may have already been deleted"
            );
          } else if (status === 403) {
            throw new Error(
              "Permission denied - you don't have access to delete this property"
            );
          } else {
            throw new Error(`Server error (${status}): ${message}`);
          }
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(
            "Network error - please check your connection and try again"
          );
        } else {
          // Something happened in setting up the request
          throw new Error(`Request setup error: ${error.message}`);
        }
      }

      // Re-throw the error so it can be handled by the component
      throw error;
    }
  },
};

export default propertyService;
