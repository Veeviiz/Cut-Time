import React from "react";
import { MdEmail } from "react-icons/md";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
const LoginPage = () => {
  return (
    <>
      <div className=" flex items-center justify-center min-h-screen ">
        <div
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md shadow-xl/30

 shadow-blue-500/50 "
        >
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-6">
            Sign in to manage your editing projects.
          </p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email Address
              </label>

              <div className="relative">
                <MdEmail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800  border border-slate-700 text-white rounded-lg focus:outline-none  focus:ring-sky-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Password
                </label>

                <p className="text-sm text-sky-600 cursor-pointer hover:text-gray-300">
                  Forgot Password?
                </p>
              </div>

              <div className="relative">
                <FaUnlockKeyhole
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none  focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Sign In Btn */}
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-5 rounded-lg shadow-lg  shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In
              <FaArrowRight className="text-white" />
            </button>
          </form>
          {/* Continue With */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600"></div>

            <span className="px-4 text-gray-400 text-sm capi">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          <div className="flex gap-4">
            {/* Google */}
            <button className="w-full text-white hover:bg-slate-800 text-gray-800 font-medium py-3 px-5 rounded-lg border border-slate-700 transition flex items-center justify-center gap-3">
              <svg viewBox="0 0 48 48" width="22" height="22">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.15 0 5.94 1.09 8.16 3.23l6.1-6.1C34.23 2.91 29.55 1 24 1 14.62 1 6.51 6.73 2.9 14.99l7.46 5.8C12.13 14.2 17.59 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.64-.15-3.21-.43-4.72H24v9h12.68c-.55 2.97-2.23 5.48-4.76 7.18l7.33 5.7C43.99 37.5 46.5 31.57 46.5 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.36 28.79A14.5 14.5 0 019.5 24c0-1.67.29-3.28.86-4.79l-7.46-5.8A23.95 23.95 0 000 24c0 3.88.93 7.55 2.9 10.59l7.46-5.8z"
                />
                <path
                  fill="#34A853"
                  d="M24 47c6.48 0 11.92-2.15 15.89-5.84l-7.33-5.7c-2.03 1.37-4.63 2.17-8.56 2.17-6.41 0-11.87-4.7-13.64-11.29l-7.46 5.8C6.51 41.27 14.62 47 24 47z"
                />
              </svg>
              Google
            </button>

            {/* Facebook */}
            <button className="w-full text-white hover:bg-slate-800 text-gray-800 font-medium py-3 px-5 rounded-lg border border-slate-700 transition flex items-center justify-center gap-3">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                <path d="M22 12a10 10 0 10-11.5 9.87v-6.99h-2.7V12h2.7V9.8c0-2.67 1.6-4.14 4.05-4.14 1.17 0 2.4.2 2.4.2v2.64h-1.35c-1.33 0-1.75.83-1.75 1.68V12h3l-.48 2.88h-2.52v6.99A10 10 0 0022 12z" />
              </svg>
              Facebook
            </button>
          </div>
          {/* Sign Up Link */}
          <p className="text-sm text-gray-400 mt-6 text-center">
            Don't have an account?{" "}
            <span className="text-sky-600 cursor-pointer hover:text-gray-300">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
