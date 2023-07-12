import React, { useEffect } from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import { getAllProducts } from '../redux/actions/product';
import { useDispatch } from 'react-redux';
import { getAllEvents } from '../redux/actions/event';

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <>
      <Header activeHeading={1} />
      <Loader>
        <Hero />
        <Categories />
        <BestDeals />
        <Events />
        <FeaturedProduct />
        <Sponsored />
        <Footer />
      </Loader>
    </>
  )
}

export default HomePage