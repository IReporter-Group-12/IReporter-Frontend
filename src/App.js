import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import UserRegisterPage from "./pages/UserRegisterPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import LoginPage from "./pages/LoginPage";
import PublicPetitionForm from "./pages/PublicPetitionForm";
import CorruptionForm from "./pages/CorruptionForm";
import Navbar from "./components/Navbar";

import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import Categories from "./components/Categories";


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-register" element={<UserRegisterPage />} />
          <Route path="/admin-register" element={<AdminRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing-corruption" element={<CorruptionForm />} />
          <Route path="/create-listing-petition" element={<PublicPetitionForm />} />
          <Route path="/categories" element={<Categories />} />
          {/* <Route path="/corruption-form" element={<CorruptionForm />} />  
          <Route path="/public-petition" element={<PublicPetitionForm />} />  */}
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
