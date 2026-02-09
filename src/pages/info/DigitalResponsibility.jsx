import React from "react";
import safeIcon from "../../assets/Images/safelcon.svg";
import dataControlIcon from "../../assets/Images/dataControl.svg";
import sustainabilityIcon from "../../assets/Images/sustainability.svg";
import likeIcon from "../../assets/Images/likeIcon.svg";
import Icon from "../../assets/Images/icon";
import starDesign from "../../assets/Images/starDesign.svg";
export default function DigitalResponsibility() {
  return (
    <>
      <section className="px-auto lg:px-12 pt-16 md:pt-24 flex items-center justify-center w-full bg-[#FAF8F4] pb-0">
        <div className="max-w-7xl px-6 w-full flex items-center justify-center flex-col gap-[24px]">
          <h1 className="font-normal text-[48px] md:text-[52px] lg:text-[72px] text-[#DDAE8C] text-center leading-[100%]">
            <span className="text-[#374151]">Digital Responsibility </span>{" "}
            <br />
            Statement
          </h1>
          <p className="font-normal md:text-[14px] leading-[29.25px] leading-[20px] sm:text-[16px] md:text-[18px] text-[#374151] text-center max-w-[748px]">
            At nAia, innovation and creativity go hand in hand with
            responsibility. We are committed to AI safety, conscious digital
            practices, transparent communication, and sustainable innovation
            across everything we build, create, and share.
          </p>
          <div className="mt-5">
            <div class=" w-[3px] h-[70px] sm:h-[100px] lg:h-[119px] h-1 mx-auto rounded-full  border-transparent bg-gradient-to-b from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
          </div>
        </div>
      </section>
      <section className="bg-[#faf7f4] md:py-12.5 py-7 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12.5">
            {/* Title */}
            <h2 className="font-normal text-[20px] sm:text-[30px] lg:text-[40px] text-[#374151] text-center whitespace-nowrap">
              "Crafted with <span className="text-[#DDAE8C]">Intention</span>"
            </h2>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] ">
            {/* CARD 1 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] md:p-8 p-7 flex gap-5">
              {/* Icon Box */}
              <img src={safeIcon} alt="" className="place-self-start md:h-[56px] h-[34px] md:w-[56px] w-[34px]" />

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle">
                  Safe and Ethical AI
                </h3>
                <p className="font-normal md:text-[16px] text-[14px] leading-[22.75px] align-middle text-[#374151]">
                  Our AI stylist and digital wardrobe tools are built with human
                  oversight and thoughtful design.
                </p>
                <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal md:text-[16px] text-[14px] leading-[20px] align-middle">
                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>Transparent recommendations with explainable AI</span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>No biometric profiling or facial recognition</span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Bias-aware styling across bodies, cultures, and aesthetics
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Your data is only used to enhance your experience — never
                      sold or shared
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] md:p-8 p-7 flex gap-5">
              {/* Icon Box */}
              <img src={dataControlIcon} alt="" className="place-self-start md:h-[56px] h-[34px] md:w-[56px] w-[34px]" />

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle">
                  Your Data, Your Control
                </h3>
                <p className="font-normal md:text-[16px] text-[14px] leading-[22.75px] align-middle text-[#374151]">
                  We prioritize privacy at every step of your journey with nAia.
                </p>
                <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal md:text-[16px] text-[14px] leading-[20px] align-middle">
                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>Clear consent and transparent data use policies</span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Secure storage for style profiles, avatars, and wardrobe
                      items
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Full control to edit or delete your data anytime
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Compliant with UAE regulations and global standards (GDPR)
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] md:p-8 p-7 flex gap-5">
              {/* Icon Box */}
              <img
                src={sustainabilityIcon}
                alt=""
                className="place-self-start md:h-[56px] h-[34px] md:w-[56px] w-[34px]"
              />

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle">
                  Digital Sustainability
                </h3>
                <p className="font-normal md:text-[16px] text-[14px] leading-[22.75px] align-middle text-[#374151]">
                  We use technology to reduce waste, not create more.
                </p>
                <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal md:text-[16px] text-[14px] leading-[20px] align-middle">
                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Digital sampling instead of excessive prototyping
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Virtual try-on to minimize returns and carbon footprint
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Preparing for Digital Product Passports (traceability)
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>Sustainable technology infrastructure choices</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.18)] md:p-8 p-7 flex gap-5">
              {/* Icon Box */}
              <img src={likeIcon} alt="" className="place-self-start md:h-[56px] h-[34px] md:w-[56px] w-[34px]" />

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle">
                  Inclusive, Conscious Design
                </h3>
                <p className="font-normal md:text-[16px] text-[14px] leading-[22.75px] align-middle text-[#374151]">
                  Our ecosystem is made for diverse bodies, moods, and
                  identities.
                </p>
                <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal md:text-[16px] text-[14px] leading-[20px] align-middle">
                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Multiple body shapes, skin tones, and styling preferences
                    </span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>Modest and culturally sensitive styling options</span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>Accessibility and ease of use across devices</span>
                  </li>

                  <li class="flex items-start gap-3">
                    <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                    <span>
                      Celebrating individuality in every recommendation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#faf7f4] py-7.5 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center flex items-center justify-center flex-col gap-[48px]">
            <div>
              {/* Title */}
              <h2 className="mb-4 font-normal text-[20px] sm:text-[30px] lg:text-[40px] text-[#374151] text-center whitespace-nowrap">
                "Transparency &{" "}
                <span className="text-[#DDAE8C]">Standards</span>"
              </h2>
              <p className="font-normal text-[14px]  md:text-[18px] text-[#374151] text-center max-w-[812px]">
                We align with leading AI governance frameworks and share how our
                AI works, how recommendations are ranked, and how we test our
                systems for fairness and accuracy.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* <!-- Card 1 --> */}
              <div class="bg-white p-5 rounded-lg flex flex-col items-center md:gap-3 gap-1">
                <div class="bg-[#E6B9991A] rounded-[12px] md:p-3 p-2">
                  <Icon name="globicon" />
                </div>
                <h3 class="font-normal md:text-[16px] text-[14px] leading-[28px] tracking-[0%] text-center align-middle text-[#374151]">
                  UAE National AI Strategy
                </h3>
              </div>

              {/* <!-- Card 2 --> */}
              <div class="bg-white p-5 rounded-lg flex flex-col items-center md:gap-3 gap-1">
                <div class="bg-[#E6B9991A] rounded-[12px] md:p-3 p-2">
                  <Icon name="lawIcon" />
                </div>
                <h3 class="font-normal md:text-[16px] text-[14px] leading-[28px] tracking-[0%] text-center align-middle text-[#374151]">
                  UAE AI & Advanced Technology Charter
                </h3>
              </div>

              {/* <!-- Card 3 --> */}
              <div class="bg-white p-5 rounded-lg flex flex-col items-center md:gap-3 gap-1">
                <div class="bg-[#E6B9991A] rounded-[12px] md:p-3 p-2">
                  <Icon name="saveIcon" />
                </div>
                <h3 class="font-normal md:text-[16px] text-[14px] leading-[28px] tracking-[0%] text-center align-middle text-[#374151]">
                  UNESCO AI Ethics Guidelines
                </h3>
              </div>

              {/* <!-- Card 4 --> */}
              <div class="bg-white p-5 rounded-lg flex flex-col items-center md:gap-3 gap-1">
                <div class="bg-[#E6B9991A] rounded-[12px] md:p-3 p-2">
                  <Icon name="profileIcon" />
                </div>
                <h3 class="font-normal md:text-[16px] text-[14px] leading-[28px] tracking-[0%] text-center align-middle text-[#374151]">
                  OECD AI Principles
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#faf7f4] py-12.5 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center flex items-center justify-center flex-col gap-[50px]">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center text-center ">
              {/* <!-- Card 1 --> */}
              <div class="flex flex-col items-center">
                <div class="p-[10px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] mb-2">
                  <Icon name="Transparent" class="text-white w-6 h-6" />
                </div>
                <span class="font-bold text-[16px] leading-[100%]  text-center align-middle uppercase text-[#374151]">
                  TRANSPARENT
                </span>
              </div>

              {/* <!-- Card 2 --> */}
              <div class="flex flex-col items-center">
                <div class="p-[10px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] mb-2">
                  <Icon name="Private" class="text-white w-6 h-6" />
                </div>
                <span class="font-bold text-[16px] leading-[100%]  text-center align-middle uppercase text-[#374151]">
                  PRIVATE
                </span>
              </div>

              {/* <!-- Card 3 --> */}
              <div class="flex flex-col items-center">
                <div class="p-[10px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] mb-2">
                  <Icon name="Sustainable" class="text-white w-6 h-6" />
                </div>
                <span class="font-bold text-[16px] leading-[100%]  text-center align-middle uppercase text-[#374151]">
                  SUSTAINABLE
                </span>
              </div>

              {/* <!-- Card 4 --> */}
              <div class="flex flex-col items-center">
                <div class="p-[10px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] mb-2">
                  <Icon name="Inclusive" class="text-white w-6 h-6" />
                </div>
                <span class="font-bold text-[16px] leading-[100%]  text-center align-middle uppercase text-[#374151]">
                  INCLUSIVE
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col gap-6">
            <img src={starDesign} alt="" />
            {/* Title */}
              <h2 className="font-normal leading-[36px] text-[20px] sm:text-[30px] lg:text-[40px] text-[#374151] text-center whitespace-nowrap">
                "Designed with{" "}
                <span className="text-[#DDAE8C]">Responsibility</span>"
              </h2>
              <p className="sm:text-[18px] md:text-[22px] font-normal text-center align-middle text-[#595959]">
                Every nAia experience — digital or physical — is crafted with <span className="font-bold text-[#374151]">care, clarity,</span> and <span className="font-bold text-[#374151]">respect.</span>
              </p>
              </div>
          </div>
        </div>
      </section>
    </>
  );
}
