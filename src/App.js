import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import UserRegisterPage from "./pages/UserRegisterPage";
import AdminRegisterPage from "./pages/AdminRegisterPage.jsx";
import LoginPage from "./pages/LoginPage";
import PublicPetitionForm from "./pages/PublicPetitionForm";
import CorruptionForm from "./pages/CorruptionForm";
import Footer from "./components/Footer.js";
import Navbar from "./components/Navbar";

import SearchPage from "./pages/SearchPage";
import Categories from "./components/Categories";
import UserDashboard from "./pages/UserDashboard.jsx";


import AdminDashboard from "./pages/AdminDashboard.jsx";
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
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/corruption-form" element={<CorruptionForm />} />  
          <Route path="/public-petition" element={<PublicPetitionForm />} /> 

        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
