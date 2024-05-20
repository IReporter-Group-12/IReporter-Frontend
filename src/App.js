import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PublicPetitionForm from "./pages/PublicPetitionForm";
import CorruptionForm from "./pages/CorruptionForm";

import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import Categories from "./components/Categories";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CorruptionForm />} />
          <Route path="/create-listing" element={<PublicPetitionForm />} />
          <Route path="/" element={<Categories />} />
          <Route path="/corruption-form" element={<CorruptionForm />} />  
          <Route path="/" element={<Categories />} />
          <Route path="/public-petition" element={<PublicPetitionForm />} /> 
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
