import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Movies = () => {
  const { data, Filter, setByYear, setByJanr, newData } = useContext(Context);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // har page-da 6 ta film
  const uniqueJanrs = [...new Set(data.map(el => el.janr))];
  const uniqueYears = [...new Set(data.map(el => el.yil))];
  const sortedYears = uniqueYears.sort((a, b) => a - b)
  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newData.length / itemsPerPage);
  
  // Scroll tepaga har page o‘zgarganda
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  // Keywords for meta
  const keywords = data
    ?.slice(0, 60)
    ?.map(el => el.film)
    ?.join(", ");

  // Filter tugmasi bosilganda page 1 ga qaytadi
  const handleFilter = () => {
    Filter();
    setCurrentPage(1);
  };

  return (
    <div className='movies'>
      <Helmet>
        <title>Смотреть фильмы</title>
        <meta name="description" content={`Смотреть ${keywords}`} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content="Смотреть фильмы бесплатно" />
        <meta property="og:description" content="У нас вы найдете более 1000 фильмов в отличном качестве!" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className='container'>
        {/* FILTER */}
        <div className='filter'>
          <div>
            <label htmlFor="genre">Janrni tanlang:</label>
          <select id="genre" onChange={(e) => setByJanr(e.target.value)}>
            {uniqueJanrs.map((el,id) => <option key={id} value={el}>{el}</option>)}
            <option value={""}>All</option>
          </select>
          </div>

          <div>
            <label htmlFor="year">Yilni tanlang:</label>
            <select id="year" onChange={(e) => setByYear(e.target.value)}>
            {sortedYears.map((el,id) => <option key={id} value={el}>{el}</option>)}
            <option value={""}>All</option>
          </select>
          </div>

          <button onClick={handleFilter}>Press</button>
        </div>

        {/* MOVIES LIST */}
        <div className='box'>
          {currentItems.map((el) => (
            <Link data-aos="flip-left" to={`/movie/${el.id}`} key={el.id} className="movie-card">
              <h1>{el.film}</h1>
              
              <img src={el.thumb_url} fetchpriority="high" alt={el.film}/>
              <div>
                <h2>Yil: {el.yil}</h2>
                <h2>Janr: {el.janr}</h2>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        <div className='pagination'>
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span>{currentPage} / {totalPages}</span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Movies;
