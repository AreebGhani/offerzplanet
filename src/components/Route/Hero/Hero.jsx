import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css/autoplay';
import axios from "axios";
import { backend_url, server } from '../../../server';

const Hero = () => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    axios.get(`${server}/sponsors/get-all-sponsors`, { withCredentials: true }).then((res) => {
      setSponsors(res.data.sponsors);
    })
  }, []);

  return (
    <Swiper
      spaceBetween={5}
      slidesPerView={sponsors ? 1 : 0}
      modules={[Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
    >
      {
        sponsors &&
        sponsors.map((sponsor, i) => {
          return (
            <SwiperSlide key={sponsor._id}>
              <div
                className={`${styles.noramlFlex} relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat`}
                style={{
                  backgroundImage:
                    `url(${backend_url}${sponsor.image})`,
		  backgroundSize: "100% 100%",
                }}
              >
                <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
                  <h1
                    className={`text-[35px] w-2/3 leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
                  >
                    {sponsor.title}
                  </h1>
                  <p className="pt-5 w-4/5 text-[16px] font-[Poppins] font-[400] text-[#000000ba] capitalize">
                    {sponsor?.description}
                  </p>
                  {
                    sponsor.buttonText &&
                    <Link to={sponsor?.buttonLink} className="inline-block">
                      <div className={`${styles.button} mt-5`}>
                        <span className="text-[#fff] font-[Poppins] capitalize text-[18px]">
                          {sponsor.buttonText}
                        </span>
                      </div>
                    </Link>
                  }
                </div>
              </div>
            </SwiperSlide>
          )
        })
      }
    </Swiper>
  );
};

export default Hero;
