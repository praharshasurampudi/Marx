import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthProvider";
const Model = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
    const {signUpWithGmail, login} = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");

    // redirecting to home page or specifig page
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
  

  const onSubmit = (data) => {
    console.log(data);
    const email = data.email;
    const password = data.password;
    // console.log(email, password)
    login(email, password).then((result) => {
      const user = result.user;
      alert("Login successfull");
      document.getElementById("my_modal_5").close()
      navigate(from, {replace: true})
    }).catch((error) => {
      const errorMessage = error.message;
      setErrorMessage("Provide a correct email and password!")
    })
  };

    // google signin
    const handleLogin = () => {
      signUpWithGmail().then((result) => {
        const user = result.user;
        
        alert("Login successfull!")
        navigate(from, {replace: true})
      }).catch((error) => console.log(error))
    }

    const handleFacebookLogin = () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          alert("Facebook Login successful!");
          navigate(from, { replace: true });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex flex-col justify-center mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body" method="dialog">
            <h3 className="font-bold text-lg">Please Login!</h3>

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
            {
              errorMessage ? <p className="text-red text-xs italic">{errorMessage}</p> : ""
            }

            {/* login btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                value="Login"
                className="btn btn-outline"
              />
              </div>
                <p className="text-center my-2">
                Don't have an account?{" "}
                <button className="underline text-red ml-1"
                onClick={() => document.getElementById("my_modal_5").close()}
                >
                  Signup Now
                  </button>{" "}
              </p>

            <button 
            htmlFor="my_modal_5"
            onClick={() => document.getElementById("my_modal_5").close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</button>
          </form>

          {/* social sign in */}
          <div className="text-center space-x-3 mb-5">
            <button
              className="btn btn-outline"
              onClick={() => window.open("https://www.facebook.com", "_blank")}
            >
              <FaFacebookF /> Facebook
            </button>
            <button className="btn btn-outline" onClick={handleLogin}>
              <FaGoogle /> Google
            </button>
            <button className="btn btn-outline"
              onClick={() => window.open("https://www.github.com", "_blank")}
            >
            <FaGithub /> Github
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Model;