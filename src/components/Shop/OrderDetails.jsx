import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { FcImageFile } from "react-icons/fc";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { backend_url, server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { Country, State } from "country-state-city";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    setLoading(true);
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        dispatch(getAllOrdersOfShop(seller._id));
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });

  };

  const refundOrderUpdateHandler = async (e) => {
    setLoading(true);
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        dispatch(getAllOrdersOfShop(seller._id));
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  }

  const statusOptions = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "Received",
    "On the way",
    "Delivered",
  ];

  const statusRefundOptions = [
    "Processing refund",
    "Refund Success",
    "Refund Denied",
  ]

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start border-t" key={index}>
            <Image item={item} />
            <div className="w-full ml-5 my-8">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                Rs.{item.discountPrice} x {item.qty}
              </h5>
              <div>
                {item?.selectedProperties?.length !== 0 && item?.selectedProperties?.map((p, i) => {
                  return (
                    <div className="pl-3 text-[15px] text-[#00000091] capitalize" key={i}>
                      <b>{p?.name}:</b> {p?.value}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>Rs.{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[18px]">Name: {data?.user?.name}</h4>
          <h4 className="text-[18px]">Contact: {data?.user?.phoneNumber}</h4>
          <h4 className="text-[18px]">
            Address 1: {data?.shippingAddress.address1}
            <br />
            Address 2: {data?.shippingAddress.address2}
          </h4>
          <h4 className=" text-[18px]">State: {State.getStateByCodeAndCountry(data?.shippingAddress.state, data?.shippingAddress.country)?.name}</h4>
          <h4 className=" text-[18px]">Country: {Country.getCountryByCode(data?.shippingAddress.country)?.name}</h4>
          <h4 className=" text-[18px]">Zip Code: {data?.shippingAddress.zipCode}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      {data?.status !== "Processing refund" && data?.status !== "Refund Success" && data?.status !== "Refund Denied" && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {
            statusOptions.slice(statusOptions.indexOf(data?.status), statusOptions.indexOf(data?.status) + 2)
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))
          }
        </select>
      )}
      {
        data?.status === "Processing refund" || data?.status === "Refund Success" || data?.status === "Refund Denied" ? (
          <select value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
          >
            {statusRefundOptions
              .slice(statusRefundOptions.indexOf(data?.status), statusRefundOptions.indexOf(data?.status) + 2)
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        ) : null
      }

      <div
        className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
        onClick={data?.status !== "Processing refund" && data?.status !== "Refund Success" && data?.status !== "Refund Denied" ? orderUpdateHandler : refundOrderUpdateHandler}
      >
        {loading ? "Loading..." : "Update Status"}
      </div>
    </div>
  );
};

export default OrderDetails;

const Image = ({ item }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        await axios.get(`${backend_url}${item.images[0]}`);
        setIsImageLoaded(true);
      } catch (error) {
        setIsImageLoaded(false);
      }
    };

    fetchImage();
  }, [item.images]);

  return (
    <div>
      {isImageLoaded ? (
        <img
          src={`${backend_url}${item.images[0]}`}
          alt=""
          className="w-[80x] h-[80px] my-8"
          style={{ aspectRatio: '1/1' }}
        />
      ) : (
        <div className="w-[80x] h-[80px] my-8 flex justify-center align-middle" style={{ aspectRatio: '1/1' }}>
          <FcImageFile size={60} />
        </div>
      )}
    </div>
  );
};
