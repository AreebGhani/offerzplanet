import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import { server } from "../server";
import axios from "axios";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  const imagePerRow = 20;
  const [next, setNext] = useState(imagePerRow);
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    setData(sortedData);
  }, [allProducts]);

  const handleMoreProducts = () => {
    setNext(next + imagePerRow);
  };

  useEffect(() => {
    axios.get(`${server}/product/get-all-products`).then((res) => setIsLoading(false)).catch((e) => setIsLoading(false))
  }, []);

  return (
    <>
      <Header activeHeading={2} />
      <br />
      <br />
      {isLoading ?
        <div className="flex justify-center items-center w-full h-screen">
          <div className="rounded-full border-t-4 border-b-4 border-red-600 h-20 w-20 animate-spin"></div>
        </div>
        :
        <div className={`${styles.section}`}>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data && data?.slice(0, next)?.map((i, index) => <ProductCard data={i} key={index} />)}
          </div>
          {data && next < data?.length && (
            <div className="flex justify-center items-center">
              <button
                className={`w-[200px] h-[40px] border border-[#ec1c2c] text-center text-[#ec1c2c] hover:bg-[#ec1c2c] hover:text-white rounded-[3px] my-8 cursor-pointer`}
                onClick={handleMoreProducts}
              >
                Load more
              </button>
            </div>
          )}
          {data && data.length === 0 ? (
            <h1 className="text-center w-full pb-[100px] text-[20px]">
              No Product Found!
            </h1>
          ) : null}
        </div>
      }
      <Footer />
    </>
  );
};

export default BestSellingPage;
