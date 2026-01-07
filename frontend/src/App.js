import React,{ Suspense, lazy } from 'react'
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
      <Navbar/>
      <ScrollToTop />
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/movie/:id' element={<Movie/>}/>
      </Routes>
      </Suspense>
      <Footer/>
    </div>
  )
}

export default App