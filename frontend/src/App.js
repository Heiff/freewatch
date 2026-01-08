import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
const Home = lazy(() => import('./components/Home'));
const Movies = lazy(() => import('./components/Movies'));
const Movie = lazy(() => import('./components/Movie'));
const App = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        } />
        <Route path="/movies" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Movies />
          </Suspense>
        } />
        <Route path="/movie/:id" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Movie />
          </Suspense>
        } />


      </Routes>

      <Footer />
    </div>
  )
}

export default App