import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../logo.webp'
const Navbar = () => {
  return (
    <nav>
        <div className='container'>
            <div className='cards'>
                <Link to="/"><img src={logo} alt='watch movie'/></Link>
                <div>
                    <Link to="/movies">Фильмы</Link>
                    <button disabled>О нас</button>
                    <button disabled>Категории</button>
                    <button disabled>Контакты</button>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar