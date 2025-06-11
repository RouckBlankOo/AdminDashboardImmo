import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PropertyDetailsPage from "./components/PropertyDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />{" "}
        {/* Add route */}
      </Routes>
    </Router>
  );
}

export default App;
