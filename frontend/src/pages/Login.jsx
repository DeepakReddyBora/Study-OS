import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import API from '../api/axios.js'

export default function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)

    try {

      const res = await API.post('/auth/login', form)
      console.log(res.data)

      localStorage.setItem('token', res.data.token)

    localStorage.setItem('user', JSON.stringify(res.data.user))

    navigate('/')

  } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong')
    } finally {

      setLoading(false)

    }
  }

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
            shadow-lg
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
            tracking-tight
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

          <h1 className="
            text-3xl
            font-bold
            text-white
            mb-2
          ">
            Welcome back
          </h1>

          <p className="
            text-zinc-400
            text-sm
            mb-8
          ">
            Sign in to continue your study journey
          </p>

          {/* ERROR */}
          {error && (
            <div className="
              bg-red-500/10
              border
              border-red-500/20
              text-red-400
              p-3
              rounded-xl
              text-sm
              mb-6
            ">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label className="label">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <div className="
                flex
                items-center
                justify-between
                mb-2
              ">

                <label className="label mb-0">
                  Password
                </label>

                {/* FORGOT PASSWORD */}
                <Link
                  to="/forgot-password"
                  className="
                    text-sm
                    text-violet-400
                    hover:text-violet-300
                    transition
                  "
                >
                  Forgot Password?
                </Link>

              </div>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-field"
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                btn-primary
                w-full
                justify-center
                mt-2
              "
            >

              {loading ? (
                <span className="spinner"/>
              ) : (
                'Sign in'
              )}

            </button>

          </form>

          {/* DIVIDER */}
          <div className="
            flex
            items-center
            gap-3
            my-6
          ">

            <div className="flex-1 h-px bg-zinc-800"/>

            <span className="
              text-zinc-600
              text-xs
            ">
              or
            </span>

            <div className="flex-1 h-px bg-zinc-800"/>

          </div>

          {/* REGISTER LINK */}
          <p className="
            text-center
            text-zinc-500
            text-sm
          ">

            Don&apos;t have an account?{' '}

            <Link
              to="/register"
              className="
                text-violet-400
                hover:text-violet-300
                font-medium
                transition
              "
            >
              Create one
            </Link>

          </p>

        </div>

      </div>
    </div>
  )
}