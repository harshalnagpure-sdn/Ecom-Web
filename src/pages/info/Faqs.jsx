import React, { useState } from "react";
import emailIcon from "../../assets/Images/email.svg";
import Icon from "../../assets/Images/icon";
export default function Faqs() {
  const [openIndex, setOpenIndex] = useState("0-0");

  const faqSections = [
    {
      category: "Product & Design",
      faqs: [
        {
          title: "What does modular clothing mean?",
          content:
            "Modular pieces are designed with adjustable or transformable elements, allowing one garment to be worn in multiple ways.",
        },
        {
          title: "What sizes do you offer?",
          content:
            "Our collections are available in S–L, designed with flexible fits. More sizes will be introduced in future drops. ",
        },
        {
          title: "Are your pieces true to size?",
          content:
            "Our pieces are designed to fit true to size, with fit notes provided on each product page.",
        },
        {
          title: "How do I choose the right size?",
          content:
            "Our AI recommends outfits based on your preferences, personality, body type, occasion, and lifestyle. ",
        },
        {
          title: "Do you offer virtual try-on?",
          content:
            "Yes. You can preview how garments look using our digital avatar try-on before purchasing.",
        },
        {
          title: "How do I choose the right size?",
          content:
            "Each product page includes fit guidance and sizing details. If you’re between sizes, choose the fit that best matches your preference. You can also contact us before ordering. ",
        },
        {
          title: "How should I care for my nAia pieces?",
          content:
            "Care instructions are provided on each product page and garment label. ",
        },
        
        
      ],
    },
    {
      category: "AI & Technology",
      faqs: [
       {
          title: "Do you ship internationally?",
          content:
            "Yes, we ship worldwide. Shipping options and costs appear at checkout.",
        },
         {
          title: "How long will my order take to arrive?",
          content:
            "Delivery times vary by location and item availability. Estimated timelines are shown at checkout.",
        },
         {
          title: "Can I return or exchange my order? ",
          content:
            "Returns or exchanges are accepted within 30 days of delivery, provided the item is unworn, unused, and in its original condition with all tags attached. Some items, including made-to-order pieces, may be non-returnable. Kindly contact us to arrange returns/exchanges on support@naiabynadine.com",
        },
      ],
    },
    {
      category: "Shipping & Returns",
      faqs: [
        {
          title: "Will you offer customization features in the future? ",
          content:
            "We’re continuously evolving nAia. New features and services may be introduced over time.",
        },
        {
          title: "Still Have a Question? ",
          content:
            "If your question isn’t covered here, we’re happy to help. ",
        },
         {
          title: "Contact us at: support@naiabynadine.com  ",
          content:
            "or use the Contact Us form on our website. We aim to respond as quickly as possible. ",
        },
      ],
    },
  ];

  return (
    <>
      <section className="px-auto lg:px-12 py-15 flex items-center justify-center w-full bg-[#FAF8F4]">
        <div className="max-w-7xl px-6 w-full flex items-center justify-center flex-col gap-5">
          <h1 className="font-normal text-[40px] sm:text-[48px] md:text-[56px] text-[#DDAE8C] text-center md:leading-[72px] leading-[100%]">
            <span className="text-[#374151]">Frequently</span> <br />
            Asked Questions
          </h1>
          <p className="font-normal leading-[29.25px] tracking-[0%] text-[#374151] align-middle text-[16px] md:text-[18px]  text-center max-w-[684px]">
            Everything you need to know about nAia — from our modular designs to
            AI styling and shipping.
          </p>

          <div className="w-full max-w-4xl space-y-8">
            {faqSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="font-normal text-[24px] text-[#374151] mb-4">
                  {section.category}
                </h2>
                <div className="space-y-1">
                  {section.faqs.map((faq, faqIndex) => {
                    const globalIndex = `${sectionIndex}-${faqIndex}`;
                    return (
                      <div
                        key={faqIndex}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <button
                          className="w-full py-4 flex justify-between items-center text-left text-gray-700 hover:text-gray-900"
                          onClick={() =>
                            setOpenIndex(
                              openIndex === globalIndex ? null : globalIndex,
                            )
                          }
                        >
                          <span className="font-medium">{faq.title}</span>
                          <svg
                            className={`w-4 h-4 transform transition-transform ${openIndex === globalIndex ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${openIndex === globalIndex ? "max-h-96 pb-4" : "max-h-0"}`}
                        >
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {faq.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="px-auto lg:px-12  md:py-15 py-12 flex items-center justify-center w-full bg-[#eee9e3]
"
      >
        <div className="max-w-7xl px-6 w-full flex items-center justify-center flex-col gap-5">
          <h1 className="font-normal text-[30px] text-[#374151] text-center ">
            Still Have a Question?
          </h1>
          <p className="text-[#595959] font-normal text-[16px] text-center">
            If your question isn't covered here, we're happy to help. We aim to
            respond as quickly as possible.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="font-semibold text-[16px] leading-[24px] tracking-[0%] text-center align-middle text-[#F5F1EB] py-3 px-6 bg-[#1A1A1A] gap-[8px] rounded-full opacity-100 flex flex items-center justify-center">
            <span>
              <img src={emailIcon} alt="" />
            </span>
            support@naia.com
          </span>
          <span className="font-semibold text-[16px] leading-[24px] tracking-[0%] text-center align-middle text-[#1A1A1A] py-3 px-6 bg-[#FFFFFF] gap-[8px] rounded-full opacity-100 flex flex items-center justify-center">
            <span>
              <Icon name="chatIcon" />
            </span>
            Contact Us
          </span>
          </div>
        </div>
      </section>
    </>
  );
}
