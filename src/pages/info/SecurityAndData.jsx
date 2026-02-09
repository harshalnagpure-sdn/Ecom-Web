import React from "react";
import globSvg from "../../assets/Images/glob.svg";
import fileSvg from "../../assets/Images/file.svg";
import lawIcon from "../../assets/Images/lawicon.svg";
import personIcon from "../../assets/Images/personicon.svg";
import securityIcon from "../../assets/Images/securityIcon.svg";
import globalIcon from "../../assets/Images/globalIcon.svg";
import retentionIcon from "../../assets/Images/retentionIcon.svg";
import rightsIcon from "../../assets/Images/rightsIcon.svg";
import governanceIcon from "../../assets/Images/governanceIcon.svg";
import emailIcon from "../../assets/Images/email.svg";
export default function SecurityAndData() {
  return (
    <>
      <section className="px-auto lg:px-12  pt-16 md:pt-18.5 md:pb-27.5 pb-20 flex items-center justify-center w-full bg-[#FAF8F4]">
        <div className="max-w-7xl px-6 w-full flex items-center justify-center flex-col gap-8.5">
          <div className="flex items-center justify-center flex-col gap-5">
            <h1 className="font-normal text-[48px] md:text-[52px] lg:text-[72px] text-[#DDAE8C] text-center leading-[100%]">
              <span className="text-[#374151]">Security & Data</span> <br />
              Protection
            </h1>
            <p className="font-normal md:leading-[29.25px] leading-[20px] tracking-[0%] text-[#374151] align-middle text-[16px] md:text-[18px]  text-center max-w-[689px]">
              At nAia, protecting your personal data is a priority. We design
              our security and data handling practices to align with applicable
              data protection laws worldwide and based on user location.
            </p>
          </div>

          <div class="w-[150px] sm:w-[220px] lg:w-[241px] h-1 mx-auto rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>

          <div className="flex items-center justify-center gap-[7px] flex-row">
            <div className="bg-white shadow-md rounded-lg py-4 px-6 max-w-4xl flex items-center gap-3 font-normal text-[12px] lg:text-[16px]  md:text-[14px] leading-[22.75px] align-middle text-[#374151]">
              <span>
                <img src={globSvg} alt="" />
              </span>
              <p>EU General Data Protection Regulation (GDPR) </p>
            </div>
            <div className="bg-white shadow-md rounded-lg py-4 px-6 max-w-4xl flex items-center gap-3 font-normal text-[12px] lg:text-[16px]  md:text-[14px] leading-[22.75px] align-middle text-[#374151]">
              <span>
                <img src={fileSvg} alt="" />
              </span>
              <p>
                 UAE Personal Data Protection Law (PDPL – Federal Decree-Law No.
                45 of 2021) 
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className=" md:py-20 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center  flex items-center justify-center flex-col md:gap-16 gap-8">
            <div className="text-center flex items-center justify-center flex-col">
              {/* Title */}
              <h2 className="font-normal text-[30px]  md:text-[40px] text-[#374151] text-center whitespace-nowrap">
                Complete{" "}
                <span className="text-[#DDAE8C]">Security Details</span>
              </h2>
              <p className="font-normal text-[14px] sm:text-[16px] md:text-[18px] text-[#374151] text-center max-w-[812px]">
                Full transparency on how we handle, protect, and manage your
                data
              </p>
            </div>
            <div className="grid grid-cols-1  max-w-[896px]">
              {/* CARD 1 */}
              <div className="flex gap-4 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={lawIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Lawful Basis for Processing
                  </h3>
                  <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle">
                    <li class="flex items-start text-start gap-3">
                      We process personal data only where permitted under
                      applicable laws, including:
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Contractual necessity (processing orders and delivering
                      products)
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      User consent (marketing communications and optional
                      digital features)
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Legal obligations (regulatory, tax, and accounting
                      requirements)
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Legitimate interests (platform security, fraud prevention,
                      and service improvement)
                    </li>
                    <li class="flex items-start gap-3">
                      Consent may be withdrawn at any time where applicable.
                    </li>
                  </ul>
                </div>
              </div>
              {/* CARD 2 */}
              <div className="flex gap-4 py-[28px] border-b border-[#E7E2DA]">
                {/* Icon Box */}
                <img
                  src={personIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Personal Data We Protect
                  </h3>
                  <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[16px] leading-[20px] align-middle">
                    <li class="flex items-start gap-3 text-start">
                      Depending on how users interact with nAia, we protect:
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Identity and contact information
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Order and transaction details
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Account and website usage data
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      At this stage, nAia does not collect or process image
                      uploads, biometric data, or sensitive personal data.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 3 */}
              <div className="flex gap-4 py-[28px] border-b border-[#E7E2DA]">
                <img
                  src={securityIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] text-left">
                    Security Measures
                  </h3>

                  <ul className="space-y-[10px] text-[#797979] font-normal text-[14px] md:text-[16px] leading-[20px] text-start">
                    <li>
                      We implement appropriate technical and organizational
                      safeguards, including:
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Encrypted data transmission (SSL/TLS)
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Secure, access-controlled systems
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Restricted internal access on a need-to-know basis
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Continuous monitoring to detect unauthorized access
                    </li>

                    <li>
                      Payment transactions are processed by PCI-DSS compliant
                      providers. nAia does not store payment card information.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 4 */}
              <div className="flex gap-4 py-[28px] border-b border-[#E7E2DA]">
                <img
                  src={globalIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] text-left">
                    Data Sharing & International Transfers
                  </h3>

                  <ul className="space-y-[10px] text-[#797979] font-normal text-[14px] md:text-[16px] leading-[20px] text-start">
                    <li>
                      Personal data may be shared with trusted service providers
                      only where necessary to operate our services <br /> (e.g.,
                      payment processing, hosting, logistics).
                    </li>

                    <li>
                      As a global platform, data may be transferred across
                      borders. Where required, we apply safeguards consistent
                      with internationally recognized data protection standards,
                      including GDPR and PDPL principles.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 5 */}
              <div className="flex gap-4 py-[28px] border-b border-[#E7E2DA]">
                <img
                  src={retentionIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] text-left">
                    Data Retention
                  </h3>

                  <ul className="space-y-[10px] text-[#797979] font-normal text-[14px] md:text-[16px] leading-[20px] texyt-start">
                    <li className="text-start">
                      Personal data is retained only for as long as necessary
                      to:
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Fulfill contractual and operational purposes
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Meet legal and regulatory obligations
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Resolve disputes and enforce agreements
                    </li>

                    <li>
                      Data is securely deleted or anonymized when no longer
                      required.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 6  */}
              <div className="flex gap-4 py-[28px] border-b border-[#E7E2DA]">
                <img
                  src={rightsIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] text-left">
                    Your Rights
                  </h3>

                  <ul className="space-y-[10px] text-[#797979] font-normal text-[14px] md:text-[16px] leading-[20px] text-start">
                    <li>
                      Depending on your location, you may have rights including:
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Access to your personal data
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Correction of inaccurate information
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Deletion of personal data
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Restriction or objection to certain processing activities
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Withdrawal of consent, where applicable
                    </li>

                    <li>
                      Requests can be made by contacting{" "}
                      <span className="text-[#C98A5C]">support@naia.com</span>
                    </li>
                  </ul>
                </div>
              </div>
              {/* CARD 7 */}
              <div className="flex gap-4 py-[28px] ">
                <img
                  src={governanceIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col md:gap-[44px] gap-5">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] text-left">
                    Governance & Accountability
                  </h3>

                  <ul className="space-y-[10px] text-[#797979] font-normal text-[14px] md:text-[16px] leading-[20px] text-start">
                    <li>
                      nAia maintains internal governance practices to support:
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Accountability and transparency principles
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Compliance with applicable data protection laws worldwide
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Responsible and ethical use of digital and AI technologies
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#faf7f4] md:py-16 py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center  flex items-center justify-center flex-col gap-4">
            <h2 className="font-normal text-[40px] leading-[36px] tracking-[0%] text-center text-[#374151]">
              Contact Us
            </h2>
            <p className="font-normal text-[16px] leading-[24px] tracking-[0%] text-center text-[#676F7E]">
              For security or data protection inquiries, contact at
            </p>
            <span className="font-semibold text-[16px] leading-[24px] tracking-[0%] text-center align-middle text-[#F5F1EB] py-3 px-6 bg-[#1A1A1A] gap-[8px] rounded-full opacity-100 flex flex items-center justify-center">
              <span>
                <img src={emailIcon} alt="" />
              </span>
              support@naia.com
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
