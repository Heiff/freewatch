import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Movies from './components/Movies'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Movie from './components/Movie'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/movie/:id' element={<Movie/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App