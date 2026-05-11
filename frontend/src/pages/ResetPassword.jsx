import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import API from "../api/axios.js";

export default function ResetPassword() {

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");
    setSuccess("");

    try {

      const res = await API.post(
        "/auth/reset-password",
        {
          email,
          otp: form.otp,
          newPassword: form.newPassword,
        }
      );

      setSuccess(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Reset failed"
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
          Reset Password
        </h1>

        <p className="
          text-zinc-400
          mb-6
        ">
          Enter OTP and new password
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
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
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
              ? "Resetting..."
              : "Reset Password"}

          </button>

        </form>

      </div>

    </div>
  );
}