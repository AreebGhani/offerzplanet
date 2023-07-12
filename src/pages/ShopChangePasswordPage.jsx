import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopChangePassword from "../components/Shop/ShopChangePassword";

const ShopChangePasswordPage = () => {
  const navigate = useNavigate();
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isSeller, navigate])
  return (
    <ShopChangePassword />
  )
}

export default ShopChangePasswordPage;