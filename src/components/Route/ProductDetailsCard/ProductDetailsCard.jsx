import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [productProperties, setProductProperties] = useState([]);

  const handleMessageSubmit = () => { };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    if (data.stock > count) {
      setCount(count + 1);
    }
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const areAllPropertiesSelected = data.properties.every(props => {
          const p = JSON.parse(props);
          const property = productProperties.find(prop => prop.name === p.name);
          return property && property.value !== '';
        });
        if (!areAllPropertiesSelected) {
          toast.error("Please select product properties!");
        } else {
          const cartData = { ...data, qty: count, selectedProperties: productProperties };
          dispatch(addTocart(cartData));
          toast.success("Item added to cart successfully!");
        }
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  function setProductProp(propName, value) {
    const existingProperty = productProperties.find(prop => prop.name === propName);
    if (existingProperty) {
      setProductProperties(prev => {
        const updatedProperties = prev.map(prop => {
          if (prop.name === propName) {
            return { ...prop, value: value };
          }
          return prop;
        });
        return updatedProperties;
      });
    } else {
      setProductProperties(prev => ([
        ...prev,
        {
          name: propName,
          value: value
        }
      ]));
    }
  }

  return (
    <div className="bg-[#fff] cursor-default">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-10 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute cursor-pointer right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}${data.images && data.images[0]}`}
                  alt=""
                  className="p-10"
                />
                <div className="flex flex-col justify-start pt-8 ml-5">
                  <div>
                    <div className="flex item-center">
                      <Link to={`/shop/preview/${data?.shop._id}`}>
                        <img
                          src={`${backend_url}${data?.shop?.avatar}`}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full mr-2"
                        />
                      </Link>
                      <Link to={`/shop/preview/${data?.shop._id}`}>
                        <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                          {data.shop.name}
                        </h3>
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
                <h5 className="text-[16px] text-[red] ml-5 mt-5">({data.sold_out}) Sold out</h5>
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice : null}
                  </h3>
                </div>
                <div className="mt-7 capitalize text-center">
                  {data.properties.length !== 0 && data.properties.map((props, index) => {
                    let p = JSON.parse(props);
                    let values = p.values.trim().split(/[ ,]+/);
                    return (
                      <div key={index} className="flex items-center justify-start gap-5 my-3">
                        <label>{p.name}: </label>
                        <div>
                          <select
                            value={productProperties.find(prop => prop.name === p.name)?.value}
                            onChange={ev => setProductProp(p.name, ev.target.value)}
                            className="capitalize borderh-[35px] rounded-[5px]"
                          >
                            <option value="">Choose {p.name}</option>
                            {values?.map((v, i) => (
                              <option key={i} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center mt-5 justify-between pr-3">
                  {
                    data.stock > 0 ?
                      <div>
                        <button
                          className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                          onClick={decrementCount}
                        >
                          -
                        </button>
                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                          {count}
                        </span>
                        <button
                          className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                          onClick={incrementCount}
                        >
                          +
                        </button>
                      </div>
                      : "Sorry product is not available!"
                  }
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center ${data.stock < 1 && "!cursor-not-allowed !bg-[darkgray]"}`}
                  onClick={() => data.stock > 0 && addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    {data.stock > 0 ? (<>Add to Cart<AiOutlineShoppingCart className="ml-1" /></>) : "Out Of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
