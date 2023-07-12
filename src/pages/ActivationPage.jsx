import axios from "axios";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${server}/user/activation`, {
        activation_token,
      });
      setLoading(false);
      setSent(true);
    } catch (error) {
      setSent(true);
      setLoading(false);
      setError(true);
    }
  };

  return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {sent && error && (
          <>
            <p>Your token is expired!</p>
            <Link
              to="/sign-up"
              className="mt-5 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Sign Up
            </Link>
          </>
        )}
        {sent && !error && (
          <>
            <p>Your account has been created successfully!</p>
            <Link
              to="/login"
              className="mt-5 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Sign in
            </Link>
          </>
        )}
        {!sent && (
          <>
            <button
              onClick={handleSubmit}
              className="my-5 h-[40px] flex justify-center py-2 px-4 border border-red-700 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-700 hover:text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Activate Your Account"}
            </button>
            <p>– – – – – – OR – – – – – –</p>
            <Link
              to="/"
              className="mt-5 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Home
            </Link>
          </>
        )}
      </div>
  );
};

export default ActivationPage;
