import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopForgetPassword from "../components/Shop/ShopForgetPassword";

const ShopForgetPasswordPage = () => {
  const navigate = useNavigate();
  const { isSeller,isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/dashboard`);
    }
  }, [isLoading,isSeller])
  return (
    <div>
        <ShopForgetPassword />
    </div>
  )
}

export default ShopForgetPasswordPage;