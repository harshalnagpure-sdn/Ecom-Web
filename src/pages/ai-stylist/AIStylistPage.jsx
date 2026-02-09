import React from "react";
import AIStylistBg from "../../assets/images/ui/AIStylistBg.png"
import stars from "../../assets/images/ui/stars.svg";
import consciousIcon from "../../assets/images/ui/ConsciousIcon.svg";
import stylingIcon from "../../assets/images/ui/stylingIcon.svg";
import styleIcon from "../../assets/images/ui/styleIcon.svg"
import { useNavigate } from "react-router-dom";


const AIStylist = () => {
  console.log("Harshal 26");
  const navigate = useNavigate();
  
  const handleNavigate = (path) => {
    navigate(path)
  }
  return (
    <>

      <section className="
              relative w-full bg-cover bg-center bg-no-repeat
              min-h-[450px] md:min-h-[520px]
              before:absolute before:inset-0  before:z-0 "
        //   className ="before:bg-black/50"
        style={{ backgroundImage: `url(${AIStylistBg})` }}
      >
        <div className=" relative z-0 flex flex-col items-center justify-center text-start px-6 min-h-[450px] md:min-h-[520px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content */}

          {/* Gradient Badge */}
          <div className="
          mb-6
          gap-2 py-2 px-4 text-[#F5F1EB] rounded-full border border-[#E6B9994D] backdrop-blur-sm flex items-center justify-center
        "
          >
            <img src={stars} alt="" />
            AI-Powered Styling
          </div>

          {/* Heading */}
          <h1
            className="
            font-normal text-[56px] leading-[72px] text-center align-middle text-[#F5F1EB]"
          >
            Your Personal
            <br />
            Style Assistant
          </h1>

          {/* Subheading */}
          <p
            className=" 
            mt-6 
            font-normal text-[18.4px] leading-[28px] tracking-normal text-center align-middle text-[#F5F1EBE5] max-w-[724px]"
          >
            Discover perfectly curated outfits tailored to your mood, occasion, and style
            preferences
          </p>

          {/* Buttons */}

          <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={()=> handleNavigate("/aistylingquiz")} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] px-[37px] py-[16px] font-bold text-[21px] text-white hover:bg-[#ffffff] transition">
              Try AI Styling
            </button>
            <button onClick = {()=> handleNavigate("/aboutus")} className="inline-flex items-center justify-center rounded-full bg-white/95 px-[48px] py-[16px]  font-bold text-[21px] text-[#374151] border border-[#374151] hover:bg-white transition">
              Learn More
            </button>
          </div>

        </div>

      </section>
      <section className="bg-white py-20 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Gradient Title */}
          <h2
            className="
            font-normal text-[48px] leading-[48px] tracking-[-1.2px] text-center align-middle text-[#C98A5C]
          ">
            Personal. <span className="text-[#374151]">Intelligent. </span>Effortless.
          </h2>

          {/* Subheading */}
          <p
            className="mt-6  font-normal text-[20px] leading-[32.5px] text-center text-[#797979]"

          >
            At nAia, your wardrobe isn’t just digital — it’s intuitive.
          </p>

          {/* Description Paragraph */}
          <p
            className="
            mt-6 
            text-sm md:text-base 
            text-[#4f5a6e] 
            leading-relaxed 
            max-w-3xl 
            mx-auto
            tracking-wide
          "

          >
            Our AI Stylist learns your preferences, understands your body, and curates looks
            that reflect you. Powered by advanced styling algorithms and fashion psychology,
            the AI doesn’t just suggest outfits — it designs an experience tailored to your
            mood, lifestyle, and aesthetic.
          </p>
        </div>
      </section>
      <section className="bg-[#faf7f4] py-20 w-full">
        <div className="max-w-7xl mx-auto  text-center">

          {/* Heading */}
          <h2 className="font-normal text-[54px] leading-[120%] tracking-[0] text-[#374151]">
            How It Works
          </h2>

          {/*  underline */}
          <div className="mt-2 mb-8">
            <div className="w-[297px] h-1  mx-auto rounded-full  border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
          </div>
          {/* Cards Row */}
          <div className="mt-20 flex flex-col md:flex-row items-bottom justify-center gap-[72px] h-full">

            {/* CARD 1 */}
            <div className="
            w-[352px]  h-[460px]
            py-[43px] px-[42px] rounded-[16px] bg-white border border-[#E7E1DA]
            shadow-[0_4px_6px_-4px_#0000001A,0_10px_15px_-3px_#0000001A]
            border border-[#f1f1f1]
            gap-[26px]
            flex flex-col items-center justify-top 
          ">
              <div className="
              w-20 h-20 mx-auto rounded-xl 
              bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]
              flex items-center justify-center 
              text-white text-[36px] font-bold
            ">
                1
              </div>

              <h3 className="font-bold text-[20px] leading-[28px] text-[#30261D]">
                Take the Styling Quiz
              </h3>

              <p className="font-normal text-[16px] text-[#847262] leading-relaxed">
                Answer a few quick questions about your favorite silhouettes,
                colors, and moods. The AI analyzes your style psychology to
                understand what makes you feel most confident.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="
           w-[352px] h-[428px]
            py-[43px] px-[42px] rounded-[16px] bg-white border border-[#E7E1DA]
            shadow-[0_4px_6px_-4px_#0000001A,0_10px_15px_-3px_#0000001A]
            border border-[#f1f1f1]
            gap-[26px]
            flex flex-col items-center justify-top mt-auto
          ">
              <div className="
              w-20 h-20 mx-auto rounded-xl 
              bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]
              flex items-center justify-center 
              text-white text-[36px] font-bold
            ">
                2
              </div>

              <h3 className="font-bold text-[20px] leading-[28px] text-[#30261D]">
                Get Personalized<br />Suggestions
              </h3>

              <p className="font-normal text-[16px] text-[#847262] leading-relaxed">
                Based on your blueprint, the AI Stylist curates looks that suit
                your body type, color preferences, and occasions. Each
                recommendation blends psychology with technology.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="
             w-[352px]  h-[376px]
            py-[43px] px-[42px] rounded-[16px] bg-white border border-[#E7E1DA]
            shadow-[0_4px_6px_-4px_#0000001A,0_10px_15px_-3px_#0000001A]
            border border-[#f1f1f1]
            gap-[26px]
            flex flex-col items-center justify-center  mt-auto
          ">
              <div className="
              w-20 h-20 mx-auto rounded-xl 
              bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]
              flex items-center justify-center 
              text-white text-[36px] font-bold
            ">
                3
              </div>

              <h3 className="font-bold text-[20px] leading-[28px] text-[#30261D]">
                Try Before You Buy
              </h3>

              <p className="font-normal text-[16px] text-[#847262] leading-relaxed">
              Virtually try on curated pieces using personalized avatars and see how different pieces interact with your digital wardrobe.
              </p>
            </div>

          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">

          {/* Heading */}
          <h2 className="font-normal text-[54px] leading-[120%] tracking-[0] text-[#374151]">
            Why You'll Love It
          </h2>

          {/*  underline */}
          <div className="mt-2 mb-8">
            <div className="w-[413px] h-1  mx-auto rounded-full  border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
          </div>

          {/* Icon Row */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">

            {/* ITEM 1 */}
            <div className="flex flex-col items-center text-center">

              {/* Icon Box */}
              <img src={styleIcon} alt="" />

              {/* Title */}
              <h3 className="mt-6 text-lg font-semibold text-[#3a2f28]">
                Your Style DNA
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm text-[#847262] leading-relaxed max-w-[220px]">
                Understand your true aesthetic
              </p>
            </div>

            {/* ITEM 2 */}
            <div className="flex flex-col items-center text-center">
              <img src={stylingIcon} alt="" />

              <h3 className="mt-6 text-lg font-semibold text-[#3a2f28]">
                Intelligent Styling
              </h3>

              <p className="mt-3 text-sm text-[#847262] leading-relaxed max-w-[220px]">
                AI that learns from your choices
              </p>
            </div>

            {/* ITEM 3 */}
            <div className="flex flex-col items-center text-center">
              <img src={consciousIcon} alt="" />

              <h3 className="mt-6 text-lg font-semibold text-[#3a2f28]">
                Conscious Wardrobe
              </h3>

              <p className="mt-3 text-sm text-[#847262] leading-relaxed max-w-[240px]">
                Minimize waste, maximize versatility
              </p>
            </div>

          </div>

        </div>
      </section>
      <section className="relative bg-[#fdf8f4] py-20 overflow-hidden w-full">

        {/* Soft radial glow on left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#fff3e4] rounded-full blur-[180px] opacity-60"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">

          {/* Main Heading */}
          <h2 className="font-normal text-[54px] leading-[120%] tracking-[0] text-[#374151]">
            Fashion that Learns You
          </h2>

          {/*  underline */}
          <div className="mt-2 mb-8">
            <div className="w-[413px] h-1  mx-auto rounded-full  border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
          </div>

          {/* Subheading */}
          <p className="mt-6 font-normal text-[20px] leading-[32.5px] tracking-normal text-center align-middle text-[#666666] mx-auto">
            Your AI Stylist evolves with you — remembering what you love, adapting to
            your changing tastes, and helping you express yourself effortlessly.
          </p>

          {/* Emphasis Line */}
          <p className="mt-6 font-normal text-[24px] leading-[32px] text-center align-middle text-[#374151] mx-auto">
            Because true style isn't about following trends — it's about
            understanding yourself.
          </p>

          {/* CTA Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="
              px-[19px] py-[16px]
              rounded-full 
              
              bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]
              
              text-white
              transition
              font-bold text-[18px] leading-[28px] tracking-[0] text-center align-middle
            "
            >
              Start Your Style Journey
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default AIStylist;
