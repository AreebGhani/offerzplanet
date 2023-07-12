import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from "../components/Login/ForgetPassword.jsx";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate])

  return (
    <ForgetPassword />
  )
}

export default ForgetPasswordPage;