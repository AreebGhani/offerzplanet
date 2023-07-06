import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from "./EventCard";
import Loader from "../Layout/Loader";
import { getAllEvents } from "../../redux/actions/event";

const Events = () => {
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(getAllEvents);
  }, [dispatch]);

  const { allEvents, isLoading } = useSelector((state) => state.events);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {
        !isLoading && (
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Popular Events</h1>
            </div>

            <div className="w-full grid">
              {
                allEvents?.length === 0 ? (
                  <h4>No Events available!</h4>
                ) : (
                  allEvents.length !== 0 && allEvents?.map((data, index) => {
                    return (<EventCard key={index} data={data} />)
                  })
                )
              }
            </div>

          </div>
        )
      }
    </div>
  );
}

export default Events;
