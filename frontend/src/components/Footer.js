import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <footer>
      <div className='container'>
        <div className='cards'>
          <div className='icons'>
            <a
              href="https://t.me/moviesfreewatchbot?start"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти"
            >
              <i className="fa-brands fa-telegram"></i>
            </a>
            <a
              href="https://www.tiktok.com/@moviesfreewatch7?_r=1&_t=ZP-92pUOxCmZJP"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a
              href="https://youtube.com/@about-moviee?si=0i5ikLgjNS3NDIjV"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a
              href="https://www.instagram.com/moviefreewatch?igsh=MTkzM2E0eHJvZmN6bQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

          </div>
          <div>
            <Link to="/movies">Фильмы</Link>
            <button disabled>О нас</button>
            <button disabled>Категории</button>
            <button disabled>Контакты</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer