import React from "react";
import globSvg from "../../assets/Images/glob.svg";
import fileSvg from "../../assets/Images/file.svg";
import personIcon from "../../assets/Images/personicon.svg";
import securityIcon from "../../assets/Images/securityIcon.svg";
import lawIcon from "../../assets/Images/lawicon.svg";
import globalIcon from "../../assets/Images/globalIcon.svg";
import retentionIcon from "../../assets/Images/retentionIcon.svg";
import rightsIcon from "../../assets/Images/rightsIcon.svg";
import governanceIcon from "../../assets/Images/governanceIcon.svg";
import emailIcon from "../../assets/Images/email.svg";
export default function TermsAndPrivacy() {
  return (
    <>
      <section className="px-auto lg:px-12 pt-16 md:pt-18.5 md:pb-27.5 pb-20 flex items-center justify-center w-full bg-[#FAF8F4]">
        <div className="max-w-7xl px-6 w-full flex items-center justify-center flex-col gap-8.5">
          <h1 className="font-normal text-[48px] md:text-[52px] lg:text-[72px] text-[#DDAE8C] text-center leading-[100%]">
            <span className="text-[#374151]">Privacy Policy &</span> <br />
            Terms
          </h1>
          <p className="font-normal md:leading-[29.25px] leading-[20px] tracking-[0%] text-[#374151] align-middle text-[16px] md:text-[18px]  text-center max-w-[929px]">
            nAia (“we”, “our”, “us”) is committed to protecting your privacy and
            handling personal data responsibly. We process personal data in
            accordance with applicable data protection laws worldwide, and based
            on user location.
          </p>
          
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
      <section className=" md:py-24 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center  flex items-center justify-center flex-col md:gap-16 gap-10">
            <div className="text-center flex items-center justify-center flex-col">
              {/* Title */}
              <h2 className="font-normal text-[30px] md:text-[40px] text-[#374151] text-center whitespace-nowrap">
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
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={personIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Scope of This Policy
                  </h3>
                  <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle">
                    <li class="flex items-start text-start gap-3">
                      This Privacy Policy applies to all users worldwide who
                      access or use the nAia website, services, and digital
                      platforms. 
                    </li>

                    <li class="flex items-start gap-3">
                      By using our website, you acknowledge that you have read
                      and understood this Privacy Policy.
                    </li>
                  </ul>
                </div>
              </div>
              {/* CARD 2 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA]">
                {/* Icon Box */}
                <img
                  src={securityIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className=" text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Personal Data We Protect
                  </h3>
                  <ul class="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[16px] leading-[20px] align-middle">
                    <li class="flex items-start gap-3 text-start">
                      Depending on how you interact with nAia, we may collect:
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      <p>
                        <span className="text-[#374151]">
                          Identity & Contact Data:
                        </span>{" "}
                        <br />
                        Name, email address, billing and shipping address, phone
                        number (if provided)
                      </p>
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      <p>
                        <span className="text-[#374151]">
                          Transaction Data:
                        </span>{" "}
                        <br />
                        Order details, purchase history, payment status(Payment
                        information is processed by third-party providers; nAia
                        does not store full payment card details.)
                      </p>
                    </li>

                    <li class="flex items-start gap-3 text-start">
                      <span class="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      <p>
                        <span className="text-[#374151]">
                          Technical & Usage Data:
                        </span>{" "}
                        <br />
                        IP address, browser type, device information, pages
                        visited, and cookies
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C]"></span>
                      Continuous monitoring to detect unauthorized access
                    </li>
                    <li class="flex items-start text-start">
                      <p>
                        At this stage, nAia{" "}
                        <span className="text-[#374151]">
                          {" "}
                          does not collect image uploads, biometric data, or
                          sensitive personal data.
                        </span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 3 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={lawIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Lawful Basis for Processing
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle">
                    <li className="flex items-start text-start gap-3">
                      We process personal data only where permitted under
                      applicable laws, including:
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Performance of a contract (order processing and delivery)
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Consent (marketing communications and optional features)
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Legal obligations (tax, accounting, regulatory
                      requirements)
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Legitimate interests (website security, fraud prevention,
                      and service improvement)
                    </li>

                    <li className="flex items-start gap-3">
                      You may withdraw consent at any time where consent is the
                      legal basis.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 4 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={globalIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    How We Use Your Data
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle">
                    <li className="flex items-start gap-3 text-start">
                      We use personal data to:
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Process and fulfill orders
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Communicate with you regarding purchases or inquiries
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Provide customer support
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Improve website performance and user experience
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Comply with legal and regulatory obligations
                    </li>

                    <li className="flex items-start gap-3">
                      We do not sell personal data.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 5 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={retentionIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Cookies & Tracking Technologies
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle text-start">
                    <li className="flex items-start gap-3 text-start">
                      We use cookies and similar technologies to:
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Enable core website functionality
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Analyze site usage and performance
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Improve user experience
                    </li>

                    <li className="flex items-start gap-3">
                      Where required by law, cookie consent mechanisms are
                      provided. You may manage cookies through your browser
                      settings.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 6 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={rightsIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Data Sharing
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle text-start">
                    <li className="flex items-start gap-3 text-start">
                      We may share personal data with trusted third parties only
                      where necessary, including:
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Payment service providers
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Logistics and delivery partners
                    </li>

                    <li className="flex items-start gap-3 text-start">
                      <span className="mt-2 w-2 h-2 rounded-full bg-[#DDAE8C] flex-shrink-0"></span>
                      Website hosting and IT service providers
                    </li>

                    <li className="flex items-start gap-3">
                      All third parties are required to process data securely
                      and in accordance with applicable data protection laws.
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 7 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={governanceIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    International Data Transfers
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle text-start">
                    <li class="flex items-start text-start">
                      <p>
                        As a global platform, personal data may be transferred
                        across borders. Where required, we ensure appropriate
                        safeguards are in place, including{" "}
                        <span className="text-[#374151]">
                          {" "}
                          contractual protections consistent with GDPR and UAE
                          PDPL principles.
                        </span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              {/* CAED 8 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA]">
                <img
                  src={governanceIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col gap-[44px]">
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
              {/* card 9  */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA]">
                <img
                  src={rightsIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                <div className="flex flex-col gap-[44px]">
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
               {/* card 10 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={governanceIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Data Security
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle text-start">
                    <li class="flex items-start text-start">
                      <p>
                        We implement appropriate {" "}
                        <span className="text-[#374151]">
                          {" "}
                          technical and organizational measures{" "}
                        </span>
                         to protect personal data, including encrypted connections, secure systems, and restricted internal access. 
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              {/* card 11 */}
              <div className="flex md:gap-[44px] md:gap-[44px] gap-5 py-[28px] border-b border-[#E7E2DA] ">
                {/* Icon Box */}
                <img
                  src={governanceIcon}
                  alt=""
                  className="place-self-start p-3 bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]  rounded-[12px] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
                />

                {/* Text */}
                <div className="flex flex-col gap-[44px]">
                  <h3 className="text-[#374151] font-normal md:text-[24px] text-[20px] leading-[28px] align-middle text-left">
                    Changes to This Policy
                  </h3>
                  <ul className="space-y-[10px] text-[#797979] leading-relaxed font-normal text-[14px] md:text-[16px] leading-[20px] align-middle text-start">
                    <li class="flex items-start text-start">
                      <p>
                        We may update this Privacy Policy to reflect legal, regulatory, or operational changes. The most current version will always be available on our website. 
                      </p>
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
                    <h2 className="font-normal text-[40px] leading-[36px] tracking-[0%] text-center text-[#374151]">Contact Us</h2>
                    <p className="font-normal text-[16px] leading-[24px] tracking-[0%] text-center text-[#676F7E]">For questions about this Privacy Policy or how your data is handled, please contact at</p>
                    <span className="font-semibold text-[16px] leading-[24px] tracking-[0%] text-center align-middle text-[#F5F1EB] py-3 px-6 bg-[#1A1A1A] gap-[8px] rounded-full opacity-100 flex flex items-center justify-center"><span><img src={emailIcon} alt="" /></span>support@naia.com</span>
                </div>
                </div>
            </section>
    </>
  );
}
