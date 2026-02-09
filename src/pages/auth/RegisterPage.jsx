import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../../assets/register.webp";
import { registerUser, googleRegister, clearError } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../../store/slices/cartSlice";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import registerBgImg from "../../assets/Images/login.png";
import forgetpassImg from "../../assets/images/ui/forgetpassImg.png";
import setPasswordImg from "../../assets/images/ui/setPassword.png";
import SecureIcon from "../../assets/images/ui/secureIcon.svg";
import CommunityIcon from "../../assets/images/ui/communityIcon.svg";
import sendIcon from "../../assets/images/ui/sendIcon.svg";
import updatepasswordIcon from "../../assets/images/ui/updateIcon.svg";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { cleanEnvVar } from "../../utils/envUtils";

const Register = () => {
  console.log("Harshal 3");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Error states for form fields
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  //Get redirect parameter and check if it's checkout ro soemthing
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (cart?.items?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/welcome");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/welcome");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // Display error in toast when error changes
  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.error || error?.message || "Registration failed";
      toast.error(errorMessage, { duration: 3000 });
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleSumbmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", { duration: 2000 });
      return;
    }

    const role = cleanEnvVar(import.meta.env.VITE_DEFAULT_USER_ROLE) || "user";
    const result = await dispatch(
      registerUser({ email, password, role })
    );

    if (registerUser.rejected.match(result)) {
      const errorData = result.payload;
      if (errorData?.error) {
        if (errorData.error.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: errorData.error }));
        }
      }
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleRegister({ id_token: credentialResponse.credential }));
  };

  const handleGoogleError = () => {
    console.log("Google registration failed");
    toast.error("Google registration failed", { duration: 2000 });
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
    //         <label className="block text-sm font-semibold mb-2">Name</label>
    //         <input
    //           type="text"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //           className="w-full p-2 border rounded"
    //           placeholder="Enter your full name"
    //         />
    //       </div>
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
    //         {loading ? "Loading..." : "Sign Up"}
    //       </button>
    //       <p className="mt-6 text-center text-sm">
    //         Have an account?{" "}
    //         <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
    //           Login
    //         </Link>
    //       </p>
    //     </form>
    //   </div>
    //   <div className="hidden md:block w-1/2 bg-gray-800">
    //     <div className="h-full flex flex-col justify-center items-center">
    //       <img
    //         src={register}
    //         alt="Login ro Account"
    //         className="h-[750px] w-full object-cover"
    //       />
    //     </div>
    //   </div>
    // </div>

    <section 
      className="register-section  flex items-center justify-center bg-black/5 px-auto lg:px-12 py-[42px] w-full h-auto"
      style={{ backgroundImage: `url(${registerBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* register-section  */}
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h3 className="font-bold text-[30px] leading-[36px] tracking-normal mb-4 text-center">
          Join Our Fashion Community
        </h3>
        <p className="font-normal text-[20px] leading-[28px] text-center text-[#374151] [text-shadow:0px_4px_4px_#00000040] mb-[34px]">
          Create your account in seconds with secure authentication.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
          <div className="pt-[30px] pr-[49px] pb-[30px] pl-[49px] gap-[32px]  bg-white/60 backdrop-blur-xl opacity-100 rounded-[24px] border border-[#FFFFFFB2]">
            <div>
              <p className="font-normal text-[24px] leading-[32px] tracking-normal text-center text-[#1F2937] mb-2">
                Create Account
              </p>
              <p className="font-normal text-[16px] leading-[24px] tracking-normal text-center text-[#4B5563] mb-8">
                Start your fashion journey today
              </p>
              <form onSubmit={handleSumbmit}>
                {/* Email Field */}
                <div className="mb-[26px]">
                  <label className="block font-normal text-[14px] leading-[100%] tracking-normal text-[#374151] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    className={`flex items-center pl-4 w-full h-[48px] rounded-[50px] bg-white border ${
                      errors.email ? "border-red-500" : "border-[#E5E7EB]"
                    }  focus:outline focus:outline-1 focus:outline-[#4B5563]`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
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
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                      className={`flex items-center pl-4 pr-12 w-full h-[48px] rounded-[50px] bg-white border ${
                        errors.password ? "border-red-500" : "border-[#E5E7EB]"
                      }  focus:outline focus:outline-1 focus:outline-[#4B5563]`}
                      placeholder="Create a password"
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
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>
                  )}
                </div>
                <div className="mb-[26px]">
                  <label className="block font-normal text-[14px] leading-[100%] tracking-normal text-[#374151] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                        }
                      }}
                      className={`flex items-center pl-4 pr-12 w-full h-[48px] rounded-[50px] bg-white border ${
                        errors.confirmPassword ? "border-red-500" : "border-[#E5E7EB]"
                      }  focus:outline focus:outline-1 focus:outline-[#4B5563]`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#374151] transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="w-5 h-5" />
                      ) : (
                        <FaEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-[50px] bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] border border-[#E5E7EB] font-bold text-[18px] leading-[100%] text-center text-white w-full h-[48px] mb-6"
                >
                  <FaUserPlus className="w-6 h-6 text-white" />
                  {loading ? "Loading..." : "Create Account"}
                </button>

                <div className="flex items-center gap-4 w-full mb-6">
                  <div className="flex-1 h-px bg-[#4B5563]/40"></div>

                  <span className="text-[14px] font-normal text-[#4B5563]">
                    or continue with
                  </span>

                  <div className="flex-1 h-px bg-[#4B5563]/40"></div>
                </div>
                <div className="w-full mb-6 flex items-center justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signup_with"
                  />
                </div>

                <p className="font-normal text-[14px] leading-[100%] tracking-normal text-center text-[#4B5563]">
                  Already have an account?{" "}
                  <Link
                    to={`/login?redirect=${encodeURIComponent(redirect)}`}
                    className="font-normal text-[14px] leading-[20px] text-center text-[#C98A5C]"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <div className="flex flex-col gap-[38px] justify-center">
            {/* <div className="w-full max-w-[520px] 
    bg-white/20 backdrop-blur-xl 
    border border-[#FFFFFFB2] rounded-[24px]
    px-[49px] py-[30px] 
    flex flex-col gap-8"> */}

            {/* <!-- Row 1 --> */}
            <div
              className="flex flex-col gap-3 p-5 
            bg-white/60 backdrop-blur-xl rounded-[24px] 
            border border-[#FFFFFFB2]"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center 
                rounded-[12px] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l6 2.67v5.37c0 4.52-2.88 8.94-6 9.93-3.12-.99-6-5.41-6-9.93V5.85l6-2.67z" />
                  </svg> */}
                  <img src={SecureIcon} />
                </div>

                <h3 className="font-normal text-[20px] leading-[28px] text-right text-[#1F2937]">
                  Secure Authentication
                </h3>
              </div>
              <p className="font-normal text-[16px] leading-[24px] text-[#4B5563] ml-[60px]">
                Firebase-powered security with industry-standard encryption and
                session management.
              </p>
            </div>

            {/* <!-- Row 2 --> */}
            <div className="flex flex-col gap-3 p-5 bg-white/60 backdrop-blur-xl rounded-[24px]  border border-[#FFFFFFB2]">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center 
        rounded-[12px] bg-gradient-to-r from-[#14B8A6] to-[#6366F1]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2L3 14h9v8l10-12h-9z" />
                  </svg>
                </div>
                <h3 className="font-normal text-[20px] leading-[28px] text-right text-[#1F2937]">
                  Instant Access
                </h3>
              </div>
              <div>
                <p className="font-normal text-[16px] leading-[24px] text-[#4B5563] ml-[60px]">
                  Quick registration process with email verification and
                  seamless Google OAuth integration.
                </p>
              </div>
            </div>

            {/* <!-- Row 3 --> */}
            <div className="flex flex-col gap-3 p-5 bg-white/60 backdrop-blur-xl rounded-[24px]  border border-[#FFFFFFB2]">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center 
        rounded-[12px] bg-gradient-to-r from-[#F97316] to-[#EC4899]"
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    <path d="M19 8h2v2h-2v2h-2v-2h-2V8h2V6h2v2z" />
                  </svg> */}
                  <img src={CommunityIcon} />
                </div>
                <h3 className="font-normal text-[20px] leading-[28px] text-right text-[#1F2937]">
                  Community Access
                </h3>
              </div>
              <div>
                <p className="font-normal text-[16px] leading-[24px] text-[#4B5563] ml-[60px]">
                  Join thousands of fashion enthusiasts and unlock exclusive
                  features and content.
                </p>
              </div>
            </div>

            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Forgot Password Section  */}
      <div className="flex flex-col items-center justify-center hidden">
        <div className="my-[42px] mx-[144px] pt-[30px] pr-[49px] pb-[30px] pl-[49px] bg-white/60 backdrop-blur-xl opacity-100 rounded-[24px] border border-[#FFFFFFB2]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Section  */}
            <div>
              <p className="font-bold text-[30px] leading-[36px] mb-4">
                Forgot Password
              </p>

              <p className="font-normal text-[16px] leading-[24px] text-[#4B5563] mb-8">
                We’ll send a password reset link to your <br /> registered
                email.
              </p>

              <form>
                {/* <!-- Email Input --> */}
                <div className="mb-[26px]">
                  <label className="block font-normal text-[14px] leading-[100%] text-[#374151] mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="flex items-center pl-4 w-full h-[48px] rounded-[50px] bg-white border border-[#E5E7EB] focus:outline focus:outline-1 focus:outline-[#4B5563]"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* <!-- Submit Button --> */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-[50px] bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] border border-[#E5E7EB] font-bold text-[18px] leading-[100%] text-center text-white w-full h-[48px] mb-6"
                >
                  <img src={sendIcon} />
                  Send reset link
                </button>

                {/* <!-- Register Line --> */}
                <p className="font-normal text-[14px] text-center text-[#4B5563]">
                  <a
                    href="#"
                    className="font-normal text-[14px] leading-[20px] text-[#C98A5C]"
                  >
                    Back to login ?
                  </a>
                </p>
              </form>
            </div>

            {/* <!-- Right Section --> */}
            <div className="flex items-center justify-center">
              <img
                src={forgetpassImg}
                alt="Login ro Account"
                className=" rounded-[16px] border border-[#E5E7EB]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Section  */}
      <div className="flex flex-col items-center justify-center hidden">
        <div className="my-[42px] mx-[144px] pt-[30px] pr-[49px] pb-[30px] pl-[49px] bg-white/60 backdrop-blur-xl opacity-100 rounded-[24px] border border-[#FFFFFFB2]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Section  */}
            <div>
              <p className="font-bold text-[30px] leading-[36px] mb-4">
                Set New Password
              </p>

              <p className="font-normal text-[16px] leading-[24px] text-[#4B5563] mb-8">
                Enter and confirm your new password <br />
                to secure your account.
              </p>

              <form>
                <div className="mb-[26px]">
                  <label className="block font-normal text-[14px] leading-[100%] text-[#374151] mb-2">
                    Enter New Password
                  </label>

                  <input
                    type="password"
                    className="flex items-center pl-4 w-full h-[48px] rounded-[50px] bg-white border border-[#E5E7EB] focus:outline focus:outline-1 focus:outline-[#4B5563]"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="mb-[26px]">
                  <label className="block font-normal text-[14px] leading-[100%] text-[#374151] mb-2">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    className="flex items-center pl-4 w-full h-[48px] rounded-[50px] bg-white border border-[#E5E7EB] focus:outline focus:outline-1 focus:outline-[#4B5563]"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* <!-- Submit Button --> */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-[50px] bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] border border-[#E5E7EB] font-bold text-[18px] leading-[100%] text-center text-white w-full h-[48px] mb-6"
                >
                  <img src={updatepasswordIcon} />
                  Update Password
                </button>
              </form>
            </div>

            {/* <!-- Right Section --> */}
            <div className="flex items-center justify-center">
              <div className="w-[351px] h-[333px]">
                <img
                  src={setPasswordImg}
                  alt="Login to Account"
                  className=" rounded-[16px] border border-[#E5E7EB] "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
