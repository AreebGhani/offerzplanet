import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css/autoplay';
import axios from "axios";
import { backend_url, server } from '../../server';

const Sponsored = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get(`${server}/brands/get-all-brands`).then((res) => {
      setBrands(res.data.brands);
    });
  }, []);
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between w-full">
        <Swiper
          spaceBetween={5}
          slidesPerView={brands ? 6 : 0}
          modules={[Autoplay]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          loop={true}
        >

          {
            brands &&
            brands.map((brand, i) => {
              return (
                <SwiperSlide key={brand._id}>
                  <img
                    src={`${backend_url}${brand.image}`}
                    alt={brand.name}
                    title={brand.name}
                    style={{ aspectRatio: "1/1" }}
                    width="150px"
                    height="150px"
                  />
                </SwiperSlide>
              )
            })
          }

        </Swiper>
      </div>
    </div>
  );
};

export default Sponsored;
