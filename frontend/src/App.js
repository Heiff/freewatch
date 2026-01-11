import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

const Home = lazy(() => import("./components/Home"));
const Movies = lazy(() => import("./components/Movies"));
const Movie = lazy(() => import("./components/Movie"));

function App() {
  return (
    <Suspense fallback={<div style={{display:"flex",justifyContent:"center",minHeight:"100vh",alignItems:"center",flexDirection:"column"}}>Loading...</div>}>
      
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>

      <Footer />

    </Suspense>
  );
}

export default App;
