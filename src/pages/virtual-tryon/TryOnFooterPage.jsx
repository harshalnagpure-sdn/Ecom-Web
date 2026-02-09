import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TyrOnFooterPagebg from "../../assets/images/ui/TyrOnFooterPagebg.png";
import styleJourneyImg from "../../assets/images/ui/styleJourneyImg.webp";
import chooseIcon from "../../assets/images/ui/chooseIcon.svg";
import personalizeIcon from "../../assets/images/ui/personalizeIcon.svg";
import tryOnIcon from "../../assets/images/ui/tryOnIcon.svg";
import matchIcon from "../../assets/images/ui/matchIcon.svg";
import loveItSectionImg from "../../assets/images/ui/loveItSectionImg.jpg";
import realIcon from "../../assets/images/ui/realIcon.svg";
import seamlessIcon from "../../assets/images/ui/seamlessIcon.svg";
import sustainableIcon from "../../assets/images/ui/sustainableIcon.svg";
import choiceIcon from "../../assets/images/ui/choiceIcon.svg";

const TyrOnFooterPage = () => {
  console.log("Harshal 16");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const handleCreateAvatar = () => {
    if (user) {
      // User is logged in - redirect to edit avatar page
      navigate("/edit-avatar");
    } else {
      // User is not logged in - redirect to login page with redirect parameter
      navigate("/login?redirect=/edit-avatar");
    }
  };
  const heroBg =
    "https://images.pexels.com/photos/8472655/pexels-photo-8472655.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const coupleImg =
    "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const modelTallImg =
    "https://images.pexels.com/photos/7671161/pexels-photo-7671161.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <>
      {/* Hero section*/}
      <section
        className="
          relative w-full bg-cover bg-center bg-no-repeat
          min-h-[450px] md:min-h-[520px]
          before:absolute before:inset-0  before:z-0 "
        //   className ="before:bg-black/50"
        style={{ backgroundImage: `url(${TyrOnFooterPagebg})` }}
      >
        <div className=" relative z-0 flex flex-col items-start justify-center text-start  min-h-[450px] md:min-h-[520px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="font-bold  text-[#F5F1EB] mb-[12px] text-[32px] leading-[38px]      /* Mobile */
                sm:text-[42px] sm:leading-[48px] md:text-[58px] md:leading-tight"
          >
            See Yourself in
            <br />
            Every Design
          </h1>

          <p
            className="font-normal  text-[#F5F1EB] text-[12px]           /* Mobile */
              sm:text-[16.5px] sm:leading-[16px]  /* Tablet */
              md:text-[18.4px] md:leading-[18px]  /* Desktop (original) */"
          >
            Experience fashion that feels personal — and perfectly you.{" "}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleCreateAvatar}
              className="inline-flex items-center justify-center rounded-full 
    bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]
    px-6 py-3 sm:px-8 sm:py-4
    font-bold text-lg sm:text-xl text-white
    transition-transform duration-200 hover:scale-105"
            >
              Create Avatar
            </button>

            {/* Button 2 */}
            <button
              onClick={() => navigate("/collections/all")}
              className="inline-flex items-center justify-center rounded-full 
    bg-white/95 border border-[#374151] text-[#374151]
    px-6 py-3 sm:px-8 sm:py-4
    font-bold text-lg sm:text-xl
    transition-transform duration-200 hover:scale-105 hover:bg-white"
            >
              Try Virtual Fitting
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT TEXT BLOCK */}
            <div className="max-w-xl text-center lg:text-left">
              {/* Title */}
              <h2
                className="
            font-normal 
            text-[32px] leading-[38px]        /* 📱 Mobile */
            sm:text-[42px] sm:leading-[50px]  /* 📱 Tablet */
            lg:text-[54px] lg:leading-[120%]  /* 💻 Desktop (original) */
            text-[#374151]
            tracking-normal
          "
              >
                Your Style Journey
                <br />
                Becomes Immersive
              </h2>

              {/* Underline */}
              <div className="mt-2 mb-5 sm:mb-6 lg:mb-8 flex justify-center lg:justify-start">
                <div
                  className="
              w-[200px] h-1             /* 📱 Mobile */
              sm:w-[260px]              /* 📱 Tablet */
              lg:w-[335px]              /* 💻 Desktop (original) */
              rounded-full  
              border-b-[3px] border-transparent 
              bg-gradient-to-r 
              from-[#2B2B2B] to-[#DDAE8C] 
              bg-clip-border
            "
                ></div>
              </div>

              {/* Paragraph */}
              <p
                className="
            text-[#444] 
            text-[15px] leading-[22px]          /* 📱 Mobile */
            sm:text-[16px] sm:leading-[24px]    /* Tablet */
            lg:text-lg lg:leading-relaxed        /* Desktop original */
            tracking-wide
            text-center lg:text-left
          "
              >
                At nAia, your style journey becomes immersive through our Avatar
                & Virtual Try-On experience. Choose an avatar that mirrors your
                body shape, customize its details, and explore how each modular
                piece fits, moves, and transforms — all before buying.
              </p>
            </div>

            {/* RIGHT IMAGE CARD */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="
            w-full 
            max-w-sm sm:max-w-md lg:max-w-xl  /* Mobile → Tablet → Desktop scaling */
            rounded-3xl 
            overflow-hidden 
            shadow-[0_25px_60px_-10px_rgba(0,0,0,0.20)]
            bg-white
          "
              >
                <img
                  src={styleJourneyImg}
                  alt="Couple Fashion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf7f4] py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            {/* Title */}
            <h2 className="font-normal text-[32px] sm:text-[40px] lg:text-[54px] text-[#374151] text-center whitespace-nowrap">
              How It Works
            </h2>

            {/* Orange underline */}
            <div className="mt-2 mb-8">
              <div className="w-[180px] sm:w-[220px] lg:w-[241px] h-1 mx-auto rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
            </div>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] mx-[80px]">
            {/* CARD 1 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] p-8 flex gap-6">
              {/* Icon Box */}
              <img src={chooseIcon} alt="" className="place-self-start" />

              {/* Text */}
              <div>
                <h3 className="font-bold text-[20px] text-[#30261D] mb-2">
                  Choose Your Body Shape
                </h3>
                <p className="font-normal text-[16px] text-[#847262] leading-[26px] tracking-normal">
                  Select the avatar that best represents you — from petite and
                  curvy to tall or athletic. Each base model is designed using
                  real-body proportions to ensure authentic, inclusive
                  representation.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] p-8 flex gap-6">
              {/* Icon Box */}
              <img src={personalizeIcon} alt="" className="place-self-start" />
              <div>
                <h3 className="font-bold text-[20px] text-[#30261D] mb-2">
                  Personalize Your Avatar
                </h3>
                <p className="font-normal text-[16px] text-[#847262] leading-[26px] tracking-normal">
                  Refine your look with your skin tone, hair color, and eye
                  color. Your avatar becomes your virtual mirror — realistic,
                  expressive, and beautifully yours.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] p-8 flex gap-6">
              {/* Icon Box */}
              <img src={tryOnIcon} alt="" className="place-self-start" />
              <div>
                <h3 className="font-bold text-[20px] text-[#30261D] mb-2">
                  Try On Virtually
                </h3>
                <p className="font-normal text-[16px] text-[#847262] leading-[26px] tracking-normal">
                  Browse nAia’s modular collection — reversible blazers,
                  adjustable trousers, and convertible dresses — and watch how
                  each piece moves naturally with your body shape.
                </p>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] p-8 flex gap-6">
              {/* Icon Box */}
              <img src={matchIcon} alt="" className="place-self-start" />
              <div>
                <h3 className="font-bold text-[20px] text-[#30261D] mb-2">
                  Mix, Match & Style
                </h3>
                <p className="font-normal text-[16px] text-[#847262] leading-[26px] tracking-normal">
                  Combine your favorite nAia pieces with your uploaded wardrobe
                  inside your digital closet. Experiment with textures, tones,
                  and silhouettes to find your perfect look.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="font-normal text-[54px] text-[#374151] leading-[120%] tracking-normal">
              Why You&apos;ll Love It
            </h2>

            {/*  underline */}
            <div className="mt-2 mb-8">
              <div className="w-[335px] h-1  mx-auto rounded-full  border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT BENEFITS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] p-8 border border-[#f1f1f1]">
                <img src={realIcon} alt="" />

                <h3
                  className="mt-4 text-lg font-extrabold text-[#1f2937]"
                  style={{ fontFamily: "Eurostile, Orbitron, sans-serif" }}
                >
                  Real Fit Visualization
                </h3>

                <p className="mt-2 text-[#555] text-[15px] leading-relaxed">
                  See how each piece drapes and adapts to your form.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] p-8 border border-[#f1f1f1]">
                <img src={choiceIcon} alt="" />

                <h3
                  className="mt-4 text-lg font-extrabold text-[#1f2937]"
                  style={{ fontFamily: "Eurostile, Orbitron, sans-serif" }}
                >
                  Confidence in Every Choice
                </h3>

                <p className="mt-2 text-[#555] text-[15px] leading-relaxed">
                  Make styling decisions that feel intuitive and authentic.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] p-8 border border-[#f1f1f1]">
                <img src={sustainableIcon} alt="" />

                <h3
                  className="mt-4 text-lg font-extrabold text-[#1f2937]"
                  style={{ fontFamily: "Eurostile, Orbitron, sans-serif" }}
                >
                  Sustainable Try-Ons
                </h3>

                <p className="mt-2 text-[#555] text-[15px] leading-relaxed">
                  Less returns. Less waste. Just better fashion decisions.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] p-8 border border-[#f1f1f1]">
                <img src={seamlessIcon} alt="" />

                <h3
                  className="mt-4 text-lg font-extrabold text-[#1f2937]"
                  style={{ fontFamily: "Eurostile, Orbitron, sans-serif" }}
                >
                  Seamless Integration
                </h3>

                <p className="mt-2 text-[#555] text-[15px] leading-relaxed">
                  Your avatar connects directly to your AI stylist and wardrobe.
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)]">
                <img
                  src={loveItSectionImg}
                  alt="Model in suit"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#2d221a] py-24 md:py-28 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <h2 className="font-normal text-[48px] text-white text-center">
            Fashion That Mirrors You
          </h2>

          {/* Subheading */}
          <p className="text-center font-normal text-[16px] text-white max-w-2xl mx-auto">
            Your avatar is more than a digital twin — it’s your connection{" "}
            <br />
            between creativity and consciousness.
          </p>

          {/* Supporting Text + Button */}
          <div className="mt-14 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left Supporting Paragraph */}
            <div className="text-left max-w-3xl">
              <p className="font-normal text-[20px] leading-[28px] align-middle text-white text-white/90 leading-relaxed tracking-wide">
                Every click, color, and fit choice brings you closer to fashion
                that understands you. Because personalization isn’t just about
                style — it’s about seeing yourself in what you wear.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCreateAvatar}
              className="
              bg-white text-[#1b1b1b]
              rounded-full 
              px-10 py-4 
              text-sm md:text-base 
              font-extrabold tracking-wide
              shadow-[0_8px_25px_rgba(0,0,0,0.30)]
              hover:bg-[#f5f5f5]
              transition
            "
              style={{ fontFamily: "Eurostile, Orbitron, sans-serif" }}
            >
              Create Your Avatar
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TyrOnFooterPage;
