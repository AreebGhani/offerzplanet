import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import { getAllEvents } from "../redux/actions/event";
import { server } from "../server";
import axios from "axios";

const EventsPage = () => {
  const dispatch = useDispatch();
  const imagePerRow = 3;
  const [next, setNext] = useState(imagePerRow);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dispatch(getAllEvents);
  }, [dispatch]);
  const { allEvents } = useSelector((state) => state.events);
  const handleMoreProducts = () => {
    setNext(next + imagePerRow);
  };

  useEffect(() => {
    axios.get(`${server}/event/get-all-events`).then((res) => setIsLoading(false)).catch((e) => setIsLoading(false))
  }, []);

  return (
    <>
      <Header activeHeading={4} />
      <br />
      <br />
      {isLoading ?
        <div className="flex justify-center items-center w-full h-screen">
          <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
        </div>
        :
        <div className={`${styles.section}`}>
          {allEvents && allEvents?.length === 0 ? (
            <h1 className="text-center w-full pb-[100px] text-[20px] mt-12">
              No Event Found!
            </h1>
          ) :
            allEvents?.slice(0, next)?.map((data, index) => {
              const { start_Date, Finish_Date } = data;
              const currentDate = new Date();
              const isActive = currentDate >= new Date(start_Date) && currentDate <= new Date(Finish_Date);
              if (isActive) {
                return (<EventCard key={index} data={data} />)
              } else {
                return "";
              }
            })
          }
          {allEvents && next < allEvents?.length && (
            <div className="flex justify-center items-center">
              <button
                className={`w-[200px] h-[40px] border border-[#ec1c2c] text-center text-[#ec1c2c] hover:bg-[#ec1c2c] hover:text-white rounded-[3px] my-8 cursor-pointer`}
                onClick={handleMoreProducts}
              >
                Load more
              </button>
            </div>
          )}
        </div>
      }
      <Footer />
    </>
  );
};

export default EventsPage;
