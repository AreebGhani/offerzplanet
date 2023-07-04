import React, { useState, useEffect } from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import axios from "axios";
import { server } from '../server';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${server}/sponsors/get-all-sponsors`, { withCredentials: true }).then((res) => {
        setLoading(false);
    })
  }, []);

  if(loading){
    return <Loader/>;
  }

  return (
    <div>
        <Header activeHeading={1} />
        <Hero />
        <Categories />
        <BestDeals />
        <Events />
        <FeaturedProduct />
        <Sponsored />
        <Footer />
    </div>
  )
}

export default HomePage