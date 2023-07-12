import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {

  const { id } = useParams();

  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i) => i._id === id);
      setData(data);
    }
  }, [allProducts, allEvents, id, eventData]);

  return (
    <>
      <Header />
        {
          data == null ?
            <h1 className="text-center w-full py-[100px] text-[20px]">
              No Product Found!
            </h1> :
            <ProductDetails data={data} />
        }
        {
          !eventData && (
            <>
              {data && <SuggestedProduct data={data} />}
            </>
          )
        }
        <Footer />
    </>
  );
};

export default ProductDetailsPage;
