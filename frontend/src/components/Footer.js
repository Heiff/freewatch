import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as TelegramIcon } from "./tg.svg";
import { ReactComponent as TiktokIcon } from "./tiktok.svg";
import { ReactComponent as YoutubeIcon } from "./youtube.svg";
import { ReactComponent as InstaIcon } from "./insta.svg";
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
              <TelegramIcon width={28} height={28} className="i" />
            </a>
            <a
              href="https://www.tiktok.com/@moviesfreewatch7?_r=1&_t=ZP-92pUOxCmZJP"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти"
            >
              <TiktokIcon width={28} height={28} className="i" />
            </a>
            <a
              href="https://www.instagram.com/moviefreewatch?igsh=MTkzM2E0eHJvZmN6bQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Перейти"
            >
              <InstaIcon width={28} height={28} className="i" />
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