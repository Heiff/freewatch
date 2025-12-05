import React, { useContext, useRef, useEffect, useState } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";

const Footer = () => {
  const { data } = useContext(Context);
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const cardWidth = 250 + 20; // card width + gap (CSS bilan mos)

  // --- Scrollni yangilash ---
  const scrollTo = (i) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: i * cardWidth,
        behavior: "smooth",
      });
      setCurrent(i);
    }
  };

  // --- Auto-slide har 3 sekund ---
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (current + 1) % data.length; // loop qilish
      scrollTo(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [current, data.length]);

  return (
    <div className="footer">
      <div className="container">
        <div className="cards" ref={sliderRef}>
          {data.slice(10,20).reverse().map((el) => (
            <Link to={`/movie/${el.id}`} key={el.id} className="card-item">
              <h2>{el.film}</h2>
              <img src={el.thumb_url} alt="" />
              <div>
                <p>📌 Жанр: {el.janr}</p>
                <p>📅 Год: {el.yil}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
