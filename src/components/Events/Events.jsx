import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import styles from '../../styles/styles'
import EventCard from "./EventCard";
import Loader from "../Layout/Loader";

const Events = () => {
  const {allEvents,isLoading} = useSelector((state) => state.events);  

   if(isLoading){
      return <Loader/>;
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
          allEvents.length !== 0 && allEvents.map((data, index) => {
            return (<EventCard key={index} data={data} />)
	  })
         }
         <h4>{
           allEvents?.length === 0 && (
            'No Events have!'
           )
          }

         </h4>
      </div>
     
    </div>
      )
     }
  </div>
  )
}

export default Events