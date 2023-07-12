import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import TrackOrder from "../components/Profile/TrackOrder";

const TrackOrderPage = () => {
  return (
    <>
      <Header />
        <TrackOrder />
        <Footer />
    </>
  )
}

export default TrackOrderPage