import React, { useContext } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import Model from "./SignupModel";
import { AuthContext } from "../context/AuthProvider";
import { useState, useEffect } from 'react';
import useDarkMode from '../hooks/useDarkMode';
import marxLogoLight from '../assets/marx-website-light.png';
import marxLogoDark from '../assets/marx-website-dark.png';
import logoprop from '../assets/marx-prop.png';
import { MdOutlineNightlight, MdOutlineWbSunny } from 'react-icons/md';
import { motion } from "framer-motion";

const SignUp = () => {
  const [theme, setTheme] = useDarkMode();
  const logo = theme === 'dark' ? marxLogoDark : marxLogoLight;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const {createUser, login} = useContext(AuthContext);
          // redirecting to home page or specifig page
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

      const onSubmit = (data) => {
        const email = data.email;
        const password = data.password;
        createUser(email, password).then((result) => {
          // Signed up 
          const user = result.user;
          alert("Account creation successfully done!")
          document.getElementById("my_modal_5").close()
          navigate(from, {replace: true})
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        })
      }
  return (
    <div className="">
      <div
        className="absolute top-8 right-1 transform -translate-x-1/2 flex items-center space-x-2 z-20 cursor-pointer transition-all duration-500 ease-in-out hover:scale-110"
        onClick={toggleTheme}
      > <span className="text-lg font-semibold select-none">THEME</span>
        {theme === 'dark' ? (
          <MdOutlineWbSunny size={30} color="white" />
        ) : (
          <MdOutlineNightlight size={30} color="black" />
        )}        

      </div>
{/* 
          <div className="absolute top-4 left-5 w-80 h-100 overflow-hidden">
        <img
          src={logoprop}
          alt="MARX Prop"
          className="w-full h-full object-cover"
          style={{ userDrag: "none", WebkitUserDrag: "none" }}
        />
      </div> */}
      <div className="max-w-md border border-slate-500 shadow-md rounded-lg shadow 
      w-full mx-auto flex items-center justify-center my-20 mr-20 mt-40 z-0
      transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <div className="modal-action flex flex-col justify-center mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body" method="dialog">
            <h3 className="font-bold text-lg">Connect with MARX!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password")}
              />
            </div>

            {/* error */}

            {/* login btn */}
            <div className="form-control mt-6">
              <input
                type="submit"
                value="Signup"
                className="btn btn-outline"
              />
            </div>

            <p className="text-center my-2">
              Have an account?{" "}
              <button className="underline text-red ml-1"
               onClick={() => document.getElementById("my_modal_5").showModal()}
              >
                Login
              </button>{" "}
            </p>
          </form>

          {/* social sign in */}
          <div className="text-center space-x-3 mb-5">
          <button
              className="btn btn-outline"
              onClick={() => window.open("https://www.facebook.com", "_blank")}
            >
              <FaFacebookF />
            </button>
            <button className="btn btn-outline">
              <FaGoogle />
            </button>

            <button className="btn btn-outline"
              onClick={() => window.open("https://www.github.com", "_blank")}
            >
            <FaGithub />
            </button>
          </div>
        </div>
        <Model/>
      
    </div>
    <div>
      {/* Logo Section */}
      <motion.div
        initial={{ scale: 4, x: "-60%", y: "-60%", top: "45%", left: "37%" }}
        animate={{ scale: 4, top: "45%", left: "32%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute z-10 pointer-events-none select-none"
      >
        <div className="w-64 h-16 overflow-hidden">
          <img
            src={logo}
            alt="MARX Logo"
            className="w-full h-full object-cover"
            style={{ userDrag: "none", WebkitUserDrag: "none" }}
          />
        </div>
      </motion.div>
      {/* Theme Toggle Button */}
    </div>
    </div>
  )
}

export default SignUp