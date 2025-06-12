import React from "react";
import {
  Building,
  BarChart3,
  Home,
  LogOut,
  MenuSquare,
  Menu,
} from "lucide-react";
import { MenubarArrow } from "@radix-ui/react-menubar";
import { MenubarCheckboxItem } from "./ui/menubar";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar = ({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}: SidebarProps) => {
  const handleLogout = () => {
    console.log("Logout clicked");
    onLogout();
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-2xl lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-gradient-to-r from-red-600 to-red-700 shadow-lg flex-shrink-0 space-x-2">
            <img
              src="/assets/logoS.png"
              alt="Say Allo Immo Logo"
              className="h-16 w-16 object-contain hover:scale-105 transition-transform"
            />
            <span className="text-white text-xl font-bold">Say Allo Admin</span>
          </div>

          <nav className="flex-1 mt-8 overflow-y-auto">
            <div className="px-4 space-y-2">
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={`w-full flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 ${
                  currentPage === "dashboard"
                    ? "bg-gray-700 text-white shadow-lg border-l-4 border-red-500"
                    : ""
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Tableau de Bord
              </button>

              <button
                onClick={() => setCurrentPage("properties")}
                className={`w-full flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 ${
                  currentPage === "properties"
                    ? "bg-gray-700 text-white shadow-lg border-l-4 border-red-500"
                    : ""
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                Propriétés
              </button>
            </div>
          </nav>

          <div className="px-4 pb-4 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out lg:hidden"
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  );
};
