import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../Context';
import { Helmet } from 'react-helmet-async';

const Movie = () => {
    const { api } = useContext(Context);
    const { id } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const res = await axios.get(`${api}/film/${id}`);
                setData([res.data]); // data array holatida saqlanmoqda
            } catch (error) {
                console.log(error);
            }
        };
        getMovie();
    }, [id]);

    return (
        <div className='movie-page'>
            {
                data.map((el) => {
                    return (
                        <Helmet>
                            <title>{el.film} {el.yil}</title>
                            <meta name="description" content={`${el.film} У нас вы найдете более 1000 фильмов в отличном качестве! Забудьте про надоедливую рекламу — всё доступно только через Telegram. Выберите любой фильм и наслаждайтесь просмотром прямо сейчас. Легко, удобно и бесплатно — идеальный способ провести время с любимыми фильмами в любое время и в любом месте.`} />
                            <meta name="keywords" content={`${el.film},фильмы, смотреть фильмы онлайн, новые фильмы, кино 2025, сериалы, смотреть сериалы, кино онлайн, лучшие фильмы, новинки кино, HD фильмы, фильмы в хорошем качестве, русские фильмы, зарубежные фильмы, боевики, комедии, ужасы, триллеры, драмы, мелодрамы, фантастика, мультфильмы, онлайн кинотеатр`} />
                            <meta property="og:title" content={`Смотреть ${el.film} бесплатно`} />
                            <meta property="og:description" content={`${el.film} У нас вы найдете более 1000 фильмов в отличном качестве!`} />
                            <meta property="og:type" content="website" />
                        </Helmet>
                    )
                })
            }
            <div className='box'>
                {data.map((el, index) => (
                    <div className='cards' key={index}>
                        <img src={el.thumb_url} alt={el.film} />
                        <div>
                            <h1>Film: {el.film}</h1>
                            <h2>Yil: {el.yil}</h2>
                            <h2>Janr: {el.janr}</h2>
                            <p>С нашим ботом вы можете смотреть любимые фильмы бесплатно! Никакой рекламы, никаких ограничений — только через Telegram, в любое время и в любом месте. Удобство и свобода просмотра — наш приоритет.</p>
                            <a
                                href={`https://t.me/moviesfreewatchbot?start=${encodeURIComponent(el.film)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bot-btn"
                            >
                                Смотреть фильм <span className="arrow">➡</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Movie;
