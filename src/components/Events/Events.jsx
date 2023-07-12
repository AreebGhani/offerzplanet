import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from "./EventCard";
import { getAllEvents } from "../../redux/actions/event";

const Events = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEvents);
  }, [dispatch]);

  const { allEvents } = useSelector((state) => state.events);

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>
      <div className="w-full grid">
        {
          allEvents?.length === 0 ? (
            <h4>No Events available!</h4>
          ) : (
            allEvents?.length !== 0 && allEvents?.map((data, index) => {
              const { start_Date, Finish_Date } = data;
              const currentDate = new Date();
              const isActive = currentDate >= new Date(start_Date) && currentDate <= new Date(Finish_Date);
              if (isActive) {
                return (<EventCard key={index} data={data} />)
              } else {
                return "";
              }
            })
          )
        }
      </div>
    </div>
  );
}

export default Events;
