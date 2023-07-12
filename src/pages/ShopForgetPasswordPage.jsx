import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopForgetPassword from "../components/Shop/ShopForgetPassword";

const ShopForgetPasswordPage = () => {
  const navigate = useNavigate();
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isSeller, navigate])
  return (
    <ShopForgetPassword />
  )
}

export default ShopForgetPasswordPage;