import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) :
     <div>
      <Header activeHeading={4} />
      <br />
      <br />
      <div className={`${styles.section}`}>
	{allEvents && allEvents.length === 0 ? (
          <h1 className="text-center w-full pb-[100px] text-[20px] mt-12">
            No Event Found!
          </h1>
        ) : 
	allEvents.map((data, index) => {
            return (<EventCard active key={index} data={data} />)
	  })
	}
      </div>
      <Footer />
    </div>
      }
    </>
  );
};

export default EventsPage;
