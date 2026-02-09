import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/ui/welcome-screen-bg.webp";
import HeroiconsSparkle from "../../assets/images/ui/HeroiconsSparkle.svg";

export default function Landing() {
  console.log("Harshal 6");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/basicinfo");
  };

  return (
    <section 
      className="welcome-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 py-24 sm:py-32 w-full"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        {/* Card */}
        <div
          className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl 
                    p-6 sm:p-10 md:p-12 lg:p-[49px] 
                    flex flex-col items-center text-center w-full max-w-[600px]"
        >
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-[38px] font-semibold text-[#374151] tracking-wide">
            Welcome to nAia
          </h1>

          {/* Subtext */}
          <p className="text-[#374151] mt-2 text-lg sm:text-xl">
            Your personalized AI fashion journey <br /> begins here
          </p>

          {/* Icon */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
                      rounded-full flex items-center justify-center mt-8 mb-6 
                      shadow-[0px_4px_6px_0px_#0000001A]"
          >
            <img src={HeroiconsSparkle} alt="" className="w-8 sm:w-10" />
          </div>

          {/* Description */}
          <p className="text-[#374151] leading-relaxed mb-8 text-lg sm:text-xl">
            Let’s create your unique 3D avatar. This <br />
            will represent you across the platform.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="py-3 sm:py-4 px-6 sm:px-8 rounded-full 
                         bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
                         text-white font-medium shadow-lg 
                         flex items-center justify-center gap-2 
                         hover:opacity-95 transition text-base sm:text-lg"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 12l-6.75 6.75m0-13.5L17.25 12m0 0H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
