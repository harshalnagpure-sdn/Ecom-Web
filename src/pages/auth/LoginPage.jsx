import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import login from "../assets/login.webp";
import { loginUser, googleLogin, clearError } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../../store/slices/cartSlice";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import loginBgImg from "../../assets/Images/login.png";
import signInImg from "../../assets/images/ui/signIn-Image.png";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

const Login = () => {
  console.log("Harshal 2");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  //Get redirect parameter and check if it's checkout ro soemthing
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");


  const prevLoadingRef = useRef(loading);
  
  useEffect(() => {
    if (user) {
      if (cart?.items?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSumbmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLogin({ id_token: credentialResponse.credential }));
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
  };

  return (
    // <div className="flex">
    //   <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
    //     <form
    //       onSubmit={handleSumbmit}
    //       className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
    //     >
    //       <div className="flex justify-center mb-6">
    //         <h2 className="text-xl font-medium">naAi</h2>
    //       </div>
    //       <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
    //       <p className="text-center mb-6">
    //         Enter your username and assword to Login
    //       </p>
    //       <div className="mb-4">
    //         <label className="block text-sm font-semibold mb-2">Email</label>
    //         <input
    //           type="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           className="w-full p-2 border rounded"
    //           placeholder="Enter your email address"
    //         />
    //       </div>
    //       <div className="mb-4">
    //         <label className="block text-sm font-semibold mb-2">Password</label>
    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           className="w-full p-2 border rounded"
    //           placeholder="Enter your Password"
    //         />
    //       </div>
    //       <button
    //         type="submit"
    //         className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
    //       >
    //         {loading ? "Loading..." : "Sign In"}
    //       </button>
    //       <p className="mt-6 text-center text-sm">
    //         Don't Have an account?{" "}
    //         <Link
    //           to={`/register?redirect=${encodeURIComponent(redirect)}`}
    //           className="text-blue-500"
    //         >
    //           Register
    //         </Link>
    //       </p>
    //     </form>
    //   </div>
    //   <div className="hidden md:block w-1/2 bg-gray-800">
    //     <div className="h-full flex flex-col justify-center items-center">
    //       <img
    //         src={login}
    //         alt="Login ro Account"
    //         className="h-[750px] w-full object-cover"
    //       />
    //     </div>
    //   </div>
    // </div>

    <section 
      className="signin-section flex items-center justify-center bg-black/5 px-auto lg:px-12 py-[42px] w-full h-auto"
      style={{ backgroundImage: `url(${loginBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="pt-[30px] pr-[49px] pb-[30px] pl-[49px] gap-[32px]  bg-white/60 backdrop-blur-xl opacity-100 rounded-[24px] border border-[#FFFFFFB2] grid grid-cols-1 md:grid-cols-2  md:gap-10 lg:gap-12 md:m-4 lg:m-0">
        <div>
          <p className="font-bold text-[30px] leading-[36px] tracking-normal mb-4 ">
            Welcome Back
          </p>
          <p className="font-normal text-[16px] leading-[24px] tracking-normal text-[#4B5563] mb-8">
            Sign in to your account and continue your <br />
            fashion journey
          </p>
          <form onSubmit={handleSumbmit}>
            <div className="mb-[26px]">
              <label className="block font-normal text-[14px] leading-[100%] tracking-normal text-[#374151] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) dispatch(clearError());
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                className={`flex items-center pl-4 w-full h-[48px] rounded-[50px] bg-white border ${
                  errors.email ? "border-red-300" : "border-[#E5E7EB]"
                } focus:outline focus:outline-1 focus:outline-[#4B5563]`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="mb-[26px]">
              <label className="block font-normal text-[14px] leading-[100%] tracking-normal text-[#374151] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearError());
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                  className={`flex items-center pl-4 pr-12 w-full h-[48px] rounded-[50px] bg-white border ${
                    errors.password ? "border-red-300" : "border-[#E5E7EB]"
                  } focus:outline focus:outline-1 focus:outline-[#4B5563]`}
                  placeholder="Enter your Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#374151] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between w-full mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#374151] rounded"
                />
                <span className="font-normal text-[14px] text-[#4B5563]">
                  Remember me
                </span>
              </label>
              <button className="font-medium text-[14px] text-[#C98A5C] hover:text-[#c38f6e] transition">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-[50px] bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] border border-[#E5E7EB] font-bold text-[18px] leading-[100%] text-center text-white w-full h-[48px] mb-6"
            >
              <FaSignInAlt className="w-6 h-6 text-white" />
              {loading ? "Loading..." : "Sign In"}
            </button>

            <div className="flex items-center gap-4 w-full mb-6">
              <div className="flex-1 h-px bg-[#4B5563]/40"></div>

              <span className="text-[14px] font-normal text-[#4B5563]">or</span>

              <div className="flex-1 h-px bg-[#4B5563]/40"></div>
            </div>

            {/* <div className="flex items-center justify-center gap-3 w-full h-[48px] rounded-[50px] bg-white border border-[#E5E7EB] mb-6"> */}
            <div className="w-full mb-6 flex items-center justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
              />
            </div>
            <p className="font-normal text-[14px] leading-[100%] tracking-normal text-center text-[#4B5563]">
              Don't Have an account?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="font-normal text-[14px] leading-[20px] text-center text-[#C98A5C]"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={signInImg}
            alt="Login ro Account"
            className=" rounded-[16px] border border-[#E5E7EB]"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
