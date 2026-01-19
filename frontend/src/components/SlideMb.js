import React, { useContext, useRef, useEffect, useState } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";

const SlideMb = () => {
  const { data } = useContext(Context);
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);

  // card height ni data kelgandan keyin olamiz
  useEffect(() => {
    if (sliderRef.current && sliderRef.current.firstChild) {
      setCardHeight(sliderRef.current.firstChild.offsetHeight);
    }
  }, [data]);

  // autoplay
  useEffect(() => {
    if (!data || data.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [data]);

  // scroll
  useEffect(() => {
    if (sliderRef.current && cardHeight) {
      sliderRef.current.scrollTo({
        top: index * cardHeight,
        behavior: "smooth",
      });
    }
  }, [index, cardHeight]);

  // data hali kelmagan bo‘lsa
  if (!data || data.length === 0) {
    return (
      <div className="slide-mb">
        <h2 className="title">Последние новые фильмы</h2>
        <p style={{ textAlign: "center" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="slide-mb">
      <h2 className="title">Последние новые фильмы</h2>

      <div className="cards" ref={sliderRef}>
        {data.map((el) => (
          <Link to={`/movie/${el.id}`} key={el.id} className="card">
            <h2>{el.film}</h2>
            <img src={el.thumb_url} loading="lazy" alt={el.film} />
            <div>
              <p>📌 Жанр: {el.janr}</p>
              <p>📅 Год: {el.yil}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SlideMb;
