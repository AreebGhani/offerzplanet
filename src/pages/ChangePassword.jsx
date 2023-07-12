import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChangePassword from "../components/Login/ChangePassword.jsx";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate])

  return (
    <ChangePassword />
  )
}

export default ChangePasswordPage;