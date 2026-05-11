import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import API from "../api";

export default function VerifyOTP() {

  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  };

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      dark:bg-gray-900
      px-4
    ">

      <div className="
        bg-white
        dark:bg-gray-800
        p-8
        rounded-2xl
        shadow-lg
        w-full
        max-w-md
      ">

        <h2 className="
          text-3xl
          font-bold
          text-center
          mb-3
          text-gray-800
          dark:text-white
        ">
          Verify OTP
        </h2>

        <p className="
          text-center
          text-gray-500
          dark:text-gray-400
          mb-6
        ">
          Enter the OTP sent to your email.
        </p>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-gray-600
              bg-gray-50
              dark:bg-gray-700
              text-gray-800
              dark:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              mb-5
            "
          />

          <button
            type="submit"
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            Verify OTP
          </button>

        </form>

      </div>
    </div>
  );
}