import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import("aos/dist/aos.css");

const Movies = () => {
  const { data, Filter, setByYear, setByJanr, newData,api } = useContext(Context);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const uniqueJanrs = [...new Set(data.map((el) => el.janr))];
  const uniqueYears = [...new Set(data.map((el) => el.yil))].sort((a, b) => a - b);

  // ✅ AOS faqat Movies sahifada yuklanadi
    useEffect(() => {
      AOS.init({
        duration: 500,
        easing: "ease-in-out",
      });
    }, [api]);
    useEffect(() => {
      AOS.refresh();
    }, [api]);

  // Scroll tepaga
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newData.length / itemsPerPage);

  const keywords = data.slice(0, 40).map((el) => el.film).join(", ");

  const handleFilter = () => {
    Filter();
    setCurrentPage(1);
  };

  return (
    <main className="movies">
      
        <Helmet>
          <title>Смотреть фильмы бесплатно | FreeWatch</title>
          <meta
            name="description"
            content="Смотрите фильмы бесплатно и без рекламы. Более 1000 фильмов в хорошем качестве. FreeWatch."
          />
          <meta name="keywords" content={keywords} />
          <meta property="og:title" content="FreeWatch — Смотреть фильмы бесплатно" />
          <meta
            property="og:description"
            content="Более 1000 фильмов без рекламы. Смотрите через Telegram."
          />
          <meta property="og:type" content="website" />
        </Helmet>

      <div className="container">
        {/* FILTER */}
        <section className="filter">
          <div>
            <label htmlFor="genre">Выберите жанр:</label>
            <select id="genre" onChange={(e) => setByJanr(e.target.value)}>
              <option value="">All</option>
              {uniqueJanrs.map((el, id) => (
                <option key={id} value={el}>{el}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year">Выберите год:</label>
            <select id="year" onChange={(e) => setByYear(e.target.value)}>
              <option value="">All</option>
              {uniqueYears.map((el, id) => (
                <option key={id} value={el}>{el}</option>
              ))}
            </select>
          </div>

          <button onClick={handleFilter}>Фильтр</button>
        </section>

        {/* MOVIES */}
        <section className="box">
          {currentItems.map((el) => (
            <Link
              data-aos="flip-left"
              to={`/movie/${el.id}`}
              key={el.id}
              className="movie-card"
            >
              <h1>{el.film}</h1>
              <img src={el.thumb_url} loading="lazy" alt={el.film} />
              <div>
                <h2>📅 Год: {el.yil}</h2>
                <h2>📌 Жанр: {el.janr}</h2>
              </div>
            </Link>
          ))}
        </section>

        {/* PAGINATION */}
        <section className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Предыдущая
          </button>

          <span>{currentPage} / {totalPages}</span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Следующая
          </button>
        </section>
      </div>
    </main>
  );
};

export default Movies;
