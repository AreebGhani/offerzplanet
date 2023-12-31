import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { addTocart } from "../../redux/actions/cart";
import { getAllProducts } from "../../redux/actions/product";
import { getAllEvents } from "../../redux/actions/event";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {

  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    const checkProducts = () => {
      const validProductItems = wishlist.filter(wishListItem => {
        return allProducts.some(product => product._id === wishListItem._id);
      });
      if (validProductItems.length !== wishlist.length) {
        const invalidProductItems = wishlist.filter(wishListItem => {
          return !allProducts.some(product => product._id === wishListItem._id);
        });
        dispatch(removeFromWishlist(invalidProductItems));
      }
    };

    const checkEvents = () => {
      const validEventItems = wishlist.filter(wishListItem => {
        return allEvents.some(event => event._id === wishListItem._id);
      });
      if (validEventItems.length !== wishlist.length) {
        const invalidEventItems = wishlist.filter(wishListItem => {
          return !allEvents.some(event => event._id === wishListItem._id);
        });
        dispatch(removeFromWishlist(invalidEventItems));
      }
    };

    checkProducts();
    checkEvents();
  }, []);


  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

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
        removeFromWishlistHandler(data);
        setOpenWishlist(false);
        toast.success("Item added to cart successfully!");
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Nothing in Wishlist!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler} />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const totalPrice = data.discountPrice;

  return (
    <div className="border-b p-4">
      <div className="w-full 800px:flex items-center">
        <RxCross1 className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={`${backend_url}${data?.images[0]}`}
          alt=""
          className="w-[130px] p-5 h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
            Rs.{totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus size={20} className="cursor-pointer ml-5" tile="Add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
