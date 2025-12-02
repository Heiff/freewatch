import React, { useContext } from 'react'
import about from '../about-us.webp'
import { Context } from '../Context'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
const Home = () => {
    const { data } = useContext(Context);
  return (
    <div className='home'>
        <Helmet>
        <title>Смотреть фильмы</title>
        <meta name="description" content="У нас вы найдете более 1000 фильмов в отличном качестве! Забудьте про надоедливую рекламу — всё доступно только через Telegram. Выберите любой фильм и наслаждайтесь просмотром прямо сейчас. Легко, удобно и бесплатно — идеальный способ провести время с любимыми фильмами в любое время и в любом месте." />
        <meta name="keywords" content="фильмы, смотреть фильмы онлайн, новые фильмы, кино 2025, сериалы, смотреть сериалы, кино онлайн, лучшие фильмы, новинки кино, HD фильмы, фильмы в хорошем качестве, русские фильмы, зарубежные фильмы, боевики, комедии, ужасы, триллеры, драмы, мелодрамы, фантастика, мультфильмы, онлайн кинотеатр" />
        <meta property="og:title" content="Смотреть фильмы бесплатно" />
        <meta property="og:description" content="У нас вы найдете более 1000 фильмов в отличном качестве!" />
        <meta property="og:type" content="website" />
      </Helmet>
        <div className='container'>
            <div className='about-us'>
                <h1>О нас</h1>
                <div className='cards'>
                    <img src={about} fetchpriority="high" alt='watching movie'/>
                    <div>
                        <h2>Смотрите фильмы только в Telegram без рекламы.</h2>
                        <p>С нашим ботом вы можете смотреть любимые фильмы бесплатно! Никакой рекламы, никаких ограничений — только через Telegram, в любое время и в любом месте. Удобство и свобода просмотра — наш приоритет.</p>
                        <p>У нас вы найдете более 1000 фильмов в отличном качестве! Забудьте про надоедливую рекламу — всё доступно только через Telegram. Выберите любой фильм и наслаждайтесь просмотром прямо сейчас. Легко, удобно и бесплатно — идеальный способ провести время с любимыми фильмами в любое время и в любом месте.</p>
                        <a href="https://t.me/moviesfreewatchbot?start=PARAMETER" target="_blank" rel="noopener noreferrer" className="bot-btn"> Перейти в бот <span className="arrow">➡</span></a>
                    </div>
                </div>
            </div>

            <div className='movie'>
                <h1>Фильмы</h1>
                <div className='cards'>
                    {
                        data.slice(3,13).map(el =>{
                            console.log(el);
                            
                            return(
                                <Link to={`/movie/${el.id}`} key={el.id}>
                                    <h2>{el.film}</h2>
                                    <img src={el.thumb_url} alt={el.film}/>
                                    <div>
                                        <p>Janr: {el.janr}</p>
                                        <p>Yil: {el.yil}</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home