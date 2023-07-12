import React, { useState, useEffect } from 'react';
import Lottie from "react-lottie";
import animationData from "../../Assests/animations/24151-ecommerce-animation.json";
import axios from "axios";
import { backend_url, server } from '../../server';
import { toast } from "react-toastify";

const Loader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const connectWithServer = async () => {
    try {
      await axios.get(`${backend_url}test`);
      await axios.get(`${server}/sponsors/get-all-sponsors`);
      await axios.get(`${server}/brands/get-all-brands`);
      return true;
    } catch (error) {
      toast.error("Failed to connect with server, Retry Later!");
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const connected = await connectWithServer();
      setIsLoading(!connected);
    };

    fetchData();

    return () => {
      setIsLoading(false);
    };
  }, []);

  if (isLoading) {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Lottie options={defaultOptions} width={300} height={300} />
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default Loader;
