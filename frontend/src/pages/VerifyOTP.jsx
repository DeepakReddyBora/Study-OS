import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import API from "../api/axios.js";

export default function VerifyOTP() {

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  // TIMER
  useEffect(() => {

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  // REDIRECT IF EMAIL NOT FOUND
  useEffect(() => {

    if (!email) {
      navigate("/register");
    }

  }, [email, navigate]);

  // VERIFY OTP
  const handleVerify = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");
    setSuccess("");

    try {

      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setSuccess(res.data.message);

      // REDIRECT
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "OTP verification failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // RESEND OTP
  const handleResendOTP = async () => {

    try {

      setResendLoading(true);

      setError("");
      setSuccess("");

      const res = await API.post(
        "/auth/resend-otp",
        { email }
      );

      setSuccess(res.data.message);

      // RESET TIMER
      setTimeLeft(300);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Failed to resend OTP"
      );

    } finally {

      setResendLoading(false);

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
            mb-6
          ">
            Enter the OTP sent to your email.
          </p>

          {/* TIMER */}
          <p className="
            text-center
            text-sm
            text-zinc-400
            mb-6
          ">

            OTP expires in{" "}

            <span className="
              text-violet-400
              font-semibold
            ">

              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60)
                .toString()
                .padStart(2, "0")}

            </span>

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

          {/* SUCCESS */}
          {success && (
            <div className="
              bg-green-500/10
              border
              border-green-500/20
              text-green-400
              text-sm
              p-3
              rounded-xl
              mb-5
            ">
              {success}
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

              {loading
                ? "Verifying..."
                : "Verify OTP"}

            </button>

          </form>

          {/* RESEND OTP */}
          <div className="mt-5 text-center">

            <button
              onClick={handleResendOTP}
              disabled={timeLeft > 0 || resendLoading}
              className="
                text-sm
                text-violet-400
                hover:text-violet-300
                disabled:text-zinc-600
                transition
              "
            >

              {resendLoading
                ? "Sending..."
                : "Resend OTP"}

            </button>

          </div>

        </div>

      </div>
    </div>
  );
}