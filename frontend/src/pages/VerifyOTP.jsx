import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import API from "../api/axios.js";

export default function VerifyOTP() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  // REDIRECT IF EMAIL NOT FOUND
  useEffect(() => {

    if (!email) {
      navigate("/register");
    }

  }, [email, navigate]);

  const handleVerify = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(res.data.message);

      // REDIRECT TO DASHBOARD
      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "OTP verification failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-zinc-950
      px-4
    ">

      <div className="
        w-full
        max-w-md
      ">

        {/* LOGO */}
        <div className="
          flex
          items-center
          gap-3
          mb-10
          justify-center
        ">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-linear-to-br
            from-violet-600
            to-violet-400
            flex
            items-center
            justify-center
          ">

            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>

          </div>

          <span className="
            text-white
            font-bold
            text-2xl
          ">
            Study<span className="text-violet-400">OS</span>
          </span>

        </div>

        {/* CARD */}
        <div className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          shadow-2xl
          p-8
        ">

          <h2 className="
            text-3xl
            font-bold
            text-white
            text-center
            mb-2
          ">
            Verify OTP
          </h2>

          <p className="
            text-zinc-400
            text-center
            mb-8
          ">
            Enter the OTP sent to your email.
          </p>

          {/* ERROR */}
          {error && (
            <div className="
              bg-red-500/10
              border
              border-red-500/20
              text-red-400
              text-sm
              p-3
              rounded-xl
              mb-5
            ">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleVerify}>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-zinc-700
                bg-zinc-800
                text-white
                placeholder-zinc-500
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
                mb-5
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-violet-600
                hover:bg-violet-700
                text-white
                py-3
                rounded-xl
                font-semibold
                transition
                disabled:opacity-50
              "
            >

              {loading ? "Verifying..." : "Verify OTP"}

            </button>

          </form>

        </div>

      </div>
    </div>
  );
}