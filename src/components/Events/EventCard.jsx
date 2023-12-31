import React from "react";
import { backend_url } from "../../server";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { Timer } from "./Timer";

const EventCard = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { length } = Timer({ data });

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const selectedProperties = data.properties.map(item => {
          let p = JSON.parse(item);
          let values = p.values.split(',').map(value => value.trim());
          return { name: p.name, value: values[0] };
        });
        const cartData = { ...data, qty: 1, selectedProperties: selectedProperties };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  }
  return (
    <div
      className={`w-full block p-5 bg-white mb-12 rounded-lg lg:flex`}
    >
      <div className="w-full lg:-w[50%] m-auto flex justify-center items-center">
        <img src={`${backend_url}${data.images[0]}`} className="h-[50vh]" alt="" />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data.name}</h2>
        <p>{data.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data.originalPrice}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {data.discountPrice}$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data.sold_out} sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div className={`${styles.button} text-[#fff] ml-5 ${(data.stock < 1 || !length) && "!cursor-not-allowed !bg-[darkgray]"}`} onClick={() => (data.stock > 0 && length) && addToCartHandler(data)}>
            {(data.stock < 1 || !length) ? "Out Of Stock" : "Add to cart"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
