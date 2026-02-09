import React from "react";
import benefitIcon1 from "../../assets/images/ui/benefitIcon.svg";
import benefitIcon2 from "../../assets/images/ui/benefitIcon2.svg";
import benefitIcon3 from "../../assets/images/ui/benefitIcon3.svg";
import benefitIcon4 from "../../assets/images/ui/benefitIcon4.svg";
import benefitIcon5 from "../../assets/images/ui/benefitIcon5.svg";
import aboutusleft1 from "../../assets/images/ui/aboutusleft1.webp";
import aboutusleft2 from "../../assets/images/ui/aboutusleft2.webp";
import aboutusleft3 from "../../assets/images/ui/aboutusleft3.webp";
import aboutusleft4 from "../../assets/images/ui/aboutusleft4.webp";
export default function AboutPage() {
  console.log("Harshal 14");
  return (
    <>
      <section className="px-auto lg:px-12 py-15 flex items-center justify-center">
        <div className="max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-10 max-w-3xl px-4 sm:px-6">
            {/* ABOUT HEADING */}
            <div className="flex flex-col max-w-3xl">
              <h1 className="font-normal text-[40px] sm:text-[48px] md:text-[56px] text-[#374151]">
                <span className="text-[#C98A5C]">About </span>Us
              </h1>

              <p className="font-normal text-[16px] sm:text-[18px] md:text-[20px] text-[#797979]">
                nAia is a fashion-technology platform redefining how people discover, experience, and personalize fashion.
              </p>
              <br />
              <p className="font-normal text-[16px] sm:text-[18px] md:text-[20px] text-[#797979]" >
                We bring together design, technology, and human insight to build an intelligent fashion ecosystem that supports diverse brands and product categories.
              </p>
              <br />
              <p className="font-normal text-[16px] sm:text-[18px] md:text-[20px] text-[#797979]">
                At its core, nAia enables fashion to become more adaptive, data-driven, and user-centric through digital wardrobes, virtual try-ons, and AI-powered styling.
              </p>
            </div>

            {/* VISION & MISSION */}
            <div>
              <p className="font-normal text-[20px] sm:text-[22px] md:text-[24px] text-[#374151] mb-4 sm:mb-6">
                Vision & Mission
                <br />
                <span className="font-normal text-[20px] sm:text-[22px] md:text-[24px] text-[#C98A5C]">
                  Modularity. Sustainability Personalization.
                </span>
              </p>

              <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#797979]">
                At nAia, we’re redefining fashion for the modern world — one
                piece at a time.
              </p>

              <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#797979] mt-2">
                Our mission is to create intelligent, modular garments designed
                to evolve with you...
              </p>

              <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#797979] mt-2">
                Through digital wardrobes, virtual try-ons, and adaptive
                styling...
              </p>
            </div>

            {/* FOUNDER NOTE */}
            <div>
              <h2 className="font-normal text-[20px] sm:text-[22px] md:text-[24px] text-[#374151]">
                A Note from Our Founder
              </h2>

              <div className="bg-[#FFFFFF] border-l-4 border-[#C98A5C] px-4 sm:px-6 rounded-md mt-[20px] sm:mt-[30px]">
                <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#374151]">
                  “Fashion has always been a form of self-expression — but it’s
                  time it became self-aware.”
                </p>
                <p className="font-normal text-[16px] sm:text-[17px] md:text-[18px] text-[#797979] mt-2">
                  – Nadeen Abubebad, Founder & Product Director
                </p>
              </div>

              <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#797979] mt-6">
                As a Vogue-featured fashion designer, psychologist, and AI consultant, Nadeen brings a multidisciplinary perspective to building fashion technology products.
              </p>
              <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#797979] mt-2">
                nAia was created to address a broader industry gap: the absence of intelligent infrastructure connecting fashion, data, and user experience. By applying AI, behavioral insight, and digital product design, nAia moves fashion beyond static collections toward adaptive, personalized platforms that can support brands, creators, and consumers alike.
              </p>

              {/* <p className="font-normal text-[14px] sm:text-[15px] md:text-[16px] text-[#797979] mt-2">
                From sustainable modular designs to digital experiences...
              </p> */}
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {/* <!-- LEFT COLUMN --> */}
            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-3xl h-72"></div>

              <img
                src={aboutusleft2}
                className="rounded-t-3xl w-full h-[189px] object-cover"
              />

              <img
                src={aboutusleft1}
                className="rounded-b-3xl w-full h-[299px] object-cover"
              />
            </div>

            {/* <!-- RIGHT COLUMN --> */}
            <div className="flex flex-col gap-8">
              <img
                src={aboutusleft3}
                className="rounded-t-3xl w-full h-[299px] object-cover"
              />

              <img
                src={aboutusleft4}
                className="rounded-b-3xl w-full h-[189px] object-cover"
              />

              <div className="bg-white rounded-3xl h-72"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-auto lg:px-12 py-15 flex items-center justify-center bg-[#FDFAF8] w-full">
        <div className="max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-1 gap-12">
          <div className="flex flex-col items-center text-center ">
            <h2 className="font-normal text-[40px] sm:text-[48px] md:text-[56px] text-[#374151]">
              Our Values
            </h2>
            <div className="w-[180px] sm:w-[220px] lg:w-[241px] h-1  mx-auto rounded-full  border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-[17px] text-center mt-10 w-full">
              <div className="flex flex-col items-center gap-3">
                {/* <div className="w-14 h-14 rounded-full bg-gray-100 shadow-md flex items-center justify-center">Q</div> */}
                <img src={benefitIcon1} alt="" />
                <div>
                  <h3 className=" font-bold text-[16px] text-[#374151] mb-[10px]">
                    MINIMAL WASTE
                  </h3>
                  <p className="font-normal text-[16px] text-[#555555] ">
                    Technology-enabled efficiency that reduces overproduction and unnecessary inventory.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {/* <div className="w-14 h-14 rounded-full bg-gray-100 shadow-md flex items-center justify-center"></div> */}
                <img src={benefitIcon2} alt="" />
                <div>
                  <h3 className=" font-bold text-[16px] text-[#374151] mb-[10px]">
                   INTELLIGENT FASHION SYSTEMS
                  </h3>
                  <p className="font-normal text-[16px] text-[#555555]">
                   Design and data working together to improve fit, relevance, and longevity — not just aesthetics.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {/* <div className="w-14 h-14 rounded-full bg-gray-100 shadow-md flex items-center justify-center"></div> */}
                <img src={benefitIcon3} alt="" />
                <div>
                  <h3 className=" font-bold text-[16px] text-[#374151] mb-[10px]">
                    AI-POWERED PERSONALIZATION
                  </h3>
                  <p className="font-normal text-[16px] text-[#555555]">
                    Smart styling and recommendations tailored to real people, real bodies, and real wardrobes
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {/* <div className="w-14 h-14 rounded-full bg-gray-100 shadow-md flex items-center justify-center"></div> */}
                <img src={benefitIcon4} alt="" />
                <div>
                  <h3 className=" font-bold text-[16px] text-[#374151] mb-[10px]">
                   SUSTAINABLE FUTURE
                  </h3>
                  <p className="font-normal text-[16px] text-[#555555]">
                    Enabling more conscious fashion choices through better tools, insight, and design processes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {/* <div className="w-14 h-14 rounded-full bg-gray-100 shadow-md flex items-center justify-center"></div> */}
                <img src={benefitIcon5} alt="" />
                <div>
                  <p className=" font-bold text-[16px] text-[#374151] mb-[10px]">
                    HUMAN-CENTERED INNOVATION
                  </p>
                  <p className="font-normal text-[16px] text-[#555555]">
                    Building fashion technology at the intersection of psychology, behavior, and AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
