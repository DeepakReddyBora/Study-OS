import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios.js";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");
    setSuccess("");

    try {

      const res = await API.post(
        "/auth/forgot-password",
        { email }
      );

      setSuccess(res.data.message);

      setTimeout(() => {

        navigate("/reset-password", {
          state: { email },
        });

      }, 1000);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="
      min-h-screen
      bg-zinc-950
      flex
      items-center
      justify-center
      px-4
    ">

      <div className="
        w-full
        max-w-md
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        shadow-2xl
        p-8
      ">

        <h1 className="
          text-3xl
          font-bold
          text-white
          mb-2
        ">
          Forgot Password
        </h1>

        <p className="
          text-zinc-400
          mb-6
        ">
          Enter your email to receive OTP
        </p>

        {error && (
          <div className="
            bg-red-500/10
            border
            border-red-500/20
            text-red-400
            p-3
            rounded-xl
            text-sm
            mb-5
          ">
            {error}
          </div>
        )}

        {success && (
          <div className="
            bg-green-500/10
            border
            border-green-500/20
            text-green-400
            p-3
            rounded-xl
            text-sm
            mb-5
          ">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="input-field"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              btn-primary
              w-full
              justify-center
            "
          >

            {loading
              ? "Sending..."
              : "Send OTP"}

          </button>

        </form>

      </div>

    </div>
  );
}