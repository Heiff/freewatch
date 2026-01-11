import React, { useContext, useEffect, Suspense, lazy } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SlidePc = lazy(() => import("./SlidePc"));
const SlideMb = lazy(() => import("./SlideMb"));


const Home = () => {
  const { data } = useContext(Context);

  // ✅ AOS faqat Home ochilganda yuklanadi
  useEffect(() => {
    import("aos/dist/aos.css");
    import("aos").then((AOS) => {
      AOS.default.init({
        duration: 500,
        easing: "ease-in-out",
        once: true,
      });
    });
  }, []);

  return (
    <main className="home">
        <Helmet>
          <title>Смотреть фильмы бесплатно | FreeWatch</title>
          <meta
            name="description"
            content="Смотрите фильмы бесплатно и без рекламы через Telegram. Более 1000 фильмов в хорошем качестве. FreeWatch — быстро, удобно и бесплатно."
          />
          <meta
            name="keywords"
            content="фильмы, смотреть фильмы онлайн, кино онлайн, новые фильмы, сериалы, HD фильмы, бесплатные фильмы, фильмы без рекламы, онлайн кинотеатр"
          />
          <meta property="og:title" content="FreeWatch — Смотреть фильмы бесплатно" />
          <meta
            property="og:description"
            content="Более 1000 фильмов без рекламы. Смотрите бесплатно через Telegram."
          />
          <meta property="og:type" content="website" />
        </Helmet>

      <div className="container">
        <section className="about-us">
          <h1>О нас</h1>
          <div className="cards">
            <img
              src="/about-us.webp"
              alt="watching movie"
              fetchpriority="high"
              decoding="async"
            />

            <div>
              <h2>Смотрите фильмы только в Telegram без рекламы.</h2>
              <p>
                С нашим ботом вы можете смотреть любимые фильмы бесплатно! Никакой
                рекламы, никаких ограничений — только через Telegram.
              </p>
              <p>
                Более 1000 фильмов в отличном качестве. Легко, удобно и бесплатно —
                идеальный способ провести время.
              </p>
              <a
                href="https://t.me/moviesfreewatchbot?start=PARAMETER"
                target="_blank"
                rel="noopener noreferrer"
                className="bot-btn"
              >
                Перейти в бот <span className="arrow">➡</span>
              </a>
            </div>
          </div>
        </section>

        <section className="movie">
          <h1>Фильмы</h1>
          <div className="cards">
            {data.slice(0, 10).map((el) => (
              <Link to={`/movie/${el.id}`} key={el.id}>
                <h2>{el.film}</h2>
                <img src={el.thumb_url} loading="lazy" alt={el.film} />
                <div>
                  <p>📌 Жанр: {el.janr}</p>
                  <p>📅 Год: {el.yil}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="slide">
          <Suspense fallback={<div>Loading slides...</div>}>
            <SlidePc />
            <SlideMb />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default Home;
