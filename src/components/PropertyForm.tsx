import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Property {
  _id?: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  beds?: number;
  baths?: number;
  sqft: number;
  description: string;
  tags: string[];
  featured: boolean;
  isRental?: boolean;
  images?: string[]; // Changed to array
  planImages?: string[]; // Changed to array
}

interface PropertyFormProps {
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  properties: Property[];
  showPropertyForm: boolean;
  setShowPropertyForm: (show: boolean) => void;
  editingProperty: Property | null;
  setEditingProperty: (property: Property | null) => void;
  onCreateProperty: (data: FormData) => Promise<boolean>;
  onUpdateProperty: (id: string, data: FormData) => Promise<boolean>;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  properties,
  setProperties,
  showPropertyForm,
  setShowPropertyForm,
  editingProperty,
  setEditingProperty,
  onCreateProperty,
  onUpdateProperty,
}) => {
  const [formData, setFormData] = useState<Property>({
    title: "",
    location: "",
    price: "",
    type: "Appartement",
    status: "À Vendre",
    beds: undefined,
    baths: undefined,
    sqft: 0,
    description: "",
    tags: [],
    featured: false,
    isRental: false,
    images: [],
    planImages: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [planFiles, setPlanFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");

  const propertyTypes = [
    "Appartement",
    "Villa",
    "Maison",
    "Commerce",
    "Terrain",
    "Bureau",
  ];

  const statusOptions = ["À Vendre", "À Louer", "Vendu", "Loué"];

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        ...editingProperty,
        beds: editingProperty.beds || undefined,
        baths: editingProperty.baths || undefined,
        tags: editingProperty.tags || [],
        images: editingProperty.images || [],
        planImages: editingProperty.planImages || [],
      });
      setImageFiles([]);
      setPlanFiles([]);
    } else {
      setFormData({
        title: "",
        location: "",
        price: "",
        type: "Appartement",
        status: "À Vendre",
        beds: undefined,
        baths: undefined,
        sqft: 0,
        description: "",
        tags: [],
        featured: false,
        isRental: false,
        images: [],
        planImages: [],
      });
      setImageFiles([]);
      setPlanFiles([]);
    }
  }, [editingProperty]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "price") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === "beds" || name === "baths") {
      const numValue = value === "" ? undefined : parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else if (name === "sqft") {
      const numValue = value === "" ? 0 : parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length + imageFiles.length > 10) {
        setError(
          "Vous pouvez télécharger jusqu'à 10 images maximum pour l'image principale."
        );
        return;
      }
      setImageFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length + planFiles.length > 5) {
        setError(
          "Vous pouvez télécharger jusqu'à 5 images maximum pour le plan."
        );
        return;
      }
      setPlanFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removePlanImage = (index: number) => {
    setPlanFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        throw new Error("Le titre est obligatoire");
      }
      if (!formData.location.trim()) {
        throw new Error("L'emplacement est obligatoire");
      }
      if (!formData.price.trim()) {
        throw new Error("Le prix est obligatoire");
      }
      if (formData.sqft <= 0) {
        throw new Error("La superficie doit être supérieure à 0");
      }

      const propertyFormData = new FormData();

      propertyFormData.append("title", formData.title.trim());
      propertyFormData.append("location", formData.location.trim());
      propertyFormData.append("price", formData.price);
      propertyFormData.append("type", formData.type);
      propertyFormData.append("status", formData.status);
      propertyFormData.append("sqft", formData.sqft.toString());
      propertyFormData.append("description", formData.description);
      propertyFormData.append("featured", formData.featured.toString());
      propertyFormData.append("isRental", formData.isRental.toString());

      if (formData.beds !== undefined) {
        propertyFormData.append("beds", formData.beds.toString());
      }
      if (formData.baths !== undefined) {
        propertyFormData.append("baths", formData.baths.toString());
      }

      formData.tags.forEach((tag) => {
        propertyFormData.append("tags", tag);
      });

      imageFiles.forEach((file) => {
        propertyFormData.append("images", file);
      });

      planFiles.forEach((file) => {
        propertyFormData.append("planImages", file);
      });

      let success = false;

      if (editingProperty && editingProperty._id) {
        success = await onUpdateProperty(editingProperty._id, propertyFormData);
      } else {
        success = await onCreateProperty(propertyFormData);
      }

      if (success) {
        setFormData({
          title: "",
          location: "",
          price: "",
          type: "Appartement",
          status: "À Vendre",
          beds: undefined,
          baths: undefined,
          sqft: 0,
          description: "",
          tags: [],
          featured: false,
          isRental: false,
          images: [],
          planImages: [],
        });
        setImageFiles([]);
        setPlanFiles([]);
        setCurrentTag("");
        setShowPropertyForm(false);
        setEditingProperty(null);
      } else {
        throw new Error("Une erreur est survenue lors de l'enregistrement");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
    setError(null);
    setCurrentTag("");
    setImageFiles([]);
    setPlanFiles([]);
  };

  if (!showPropertyForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {editingProperty
              ? "Modifier la propriété"
              : "Ajouter une propriété"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emplacement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (DT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ex: 250000"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de propriété
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isSubmitting}
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isSubmitting}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chambres
                </label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds === undefined ? "" : formData.beds}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salles de bain
                </label>
                <input
                  type="number"
                  name="baths"
                  value={formData.baths === undefined ? "" : formData.baths}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min="1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image principale (max 10)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isSubmitting}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {editingProperty?.images &&
                    editingProperty.images.length > 0 &&
                    imageFiles.length === 0 && (
                      <div className="relative">
                        <img
                          src={`http://localhost:5000/${editingProperty.images[0].replace(
                            /^\.\//,
                            ""
                          )}`}
                          alt="Existing Property"
                          className="h-20 w-20 object-cover rounded border"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder-image.jpg")
                          }
                        />
                      </div>
                    )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan / Image secondaire (max 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePlanChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={isSubmitting}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {planFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removePlanImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {editingProperty?.planImages &&
                    editingProperty.planImages.length > 0 &&
                    planFiles.length === 0 && (
                      <div className="relative">
                        <img
                          src={`http://localhost:5000/${editingProperty.planImages[0].replace(
                            /^\.\//,
                            ""
                          )}`}
                          alt="Existing Plan"
                          className="h-20 w-20 object-cover rounded border"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder-image.jpg")
                          }
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Décrivez la propriété..."
                disabled={isSubmitting}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ajouter un tag"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !currentTag.trim()}
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-600 hover:text-gray-800 font-bold"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Mettre en avant
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRental"
                  name="isRental"
                  checked={formData.isRental}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="isRental"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Location
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
