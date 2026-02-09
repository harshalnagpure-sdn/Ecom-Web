import React from "react";
import heroImg from "../../assets/images/ui/herobanner.webp";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      {/* HERO IMAGE */}
      <img
        src={heroImg}
        alt="nAia"
        className="
      w-full 
      h-[320px] 
      sm:h-[400px] 
      md:h-[550px] 
      lg:h-[700px] 
      xl:h-[780px]
      object-cover
    "
      />

      {/* CONTENT OVERLAY */}
      <div className="absolute inset-0 bg-black/10 flex items-end justify-end">
        <div
          className="
        text-right text-white 
        p-6 
        sm:p-10 
        md:p-16 
        lg:p-24 
        xl:p-32
      "
        >
          <h1
            className="
          font-bold 
          text-[32px] 
          leading-[40px]
          sm:text-[42px] sm:leading-[50px]
          md:text-[52px] md:leading-[60px]
          lg:text-[62px] lg:leading-[70px]
          xl:text-[70px] xl:leading-[78px]
          uppercase 
          [text-shadow:0px_4px_4px_#00000040]
          mb-6
        "
          >
            stylist picks
            <br />
            beat the heat
          </h1>

          <Link
            to='/collections/:collection'
            className="
          font-bold 
          text-base
          sm:text-lg
          md:text-xl
          px-6 py-3 sm:px-8 sm:py-4
          uppercase
          text-[#374151]
          hover:bg-[#374151] hover:text-white
          duration-300 transition-all 
          rounded-full 
          border border-[#374151] 
          bg-white
        "
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
