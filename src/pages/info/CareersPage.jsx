// CareersPage.jsx
import React, { useState } from "react";
import careersHero from "../../assets/images/ui/careerspageHeroImg.png";
import teamImg from "../../assets/images/ui/teamImg.jpg";
import workImg from "../../assets/images/ui/workImg.jpg";
import founderImg from "../../assets/images/ui/founderImg.svg";
import upload from "../../assets/images/ui/upload.svg";
import { careerService } from "../../api/services/careerService";

export default function CareersPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    comment: "",
    cvFile: null,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [cvFileName, setCvFileName] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (formData.cvFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(formData.cvFile.type)) {
        newErrors.cvFile = "Please upload a PDF or DOC file";
      }
      
      if (formData.cvFile.size > 10 * 1024 * 1024) {
        newErrors.cvFile = "File size must be less than 10MB";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cvFile: file
      }));
      setCvFileName(file.name);
      // Clear error
      if (errors.cvFile) {
        setErrors(prev => ({
          ...prev,
          cvFile: ""
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitFormData = new FormData();
      submitFormData.append('first_name', formData.firstName);
      submitFormData.append('last_name', formData.lastName);
      submitFormData.append('email', formData.email);
      submitFormData.append('comment', formData.comment);
      
      if (formData.cvFile) {
        submitFormData.append('cv_file', formData.cvFile);
      }
      
      await careerService.submitApplication(submitFormData);
      
      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        comment: "",
        cvFile: null,
      });
      setCvFileName("");
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to submit application. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                       bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Application submitted successfully! We'll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && errors.submit && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                       bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {errors.submit}
        </div>
      )}

      {/* Hero section*/}
      <section
        className="
        relative w-full bg-cover bg-center bg-no-repeat
        min-h-[450px] md:min-h-[520px]
        before:absolute before:inset-0  before:z-0"
        //   className ="before:bg-black/50"
        style={{ backgroundImage: `url(${careersHero})` }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[450px] md:min-h-[520px]">
          <h1
            className="
                font-normal
                text-[32px] leading-[38px]      /* Mobile */
                sm:text-[42px] sm:leading-[48px] /* Small tablets */
                md:text-[58px] md:leading-tight /* Desktop (original) */
                text-[#F5F1EB]
                tracking-wide
                mb-[12px]
              "
          >
            Join the Future
            <br />
            of Fashion
          </h1>

          <p
            className="
              font-normal
              text-[15px] leading-[22px]          /* Mobile */
              sm:text-[16.5px] sm:leading-[24px]  /* Tablet */
              md:text-[18.4px] md:leading-[28px]  /* Desktop (original) */
              tracking-[0]
              text-[#F5F1EBE5]
              max-w-3xl
            "
          >
            At nAia, we're building more than clothes — we're designing a new
            relationship between people, technology, and self-expression.
          </p>
        </div>
      </section>
      {/* About Team section */}
      <section className=" lg:px-12 py-20 flex items-center justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* LEFT TEXT SECTION */}
          <div>
            <h2
              className="
          font-normal 
          text-[32px] leading-[38px]            /* Mobile */
          sm:text-[40px] sm:leading-[46px]      /* Tablet */
          lg:text-[54px] lg:leading-[60px]      /* Desktop (original) */
          text-[#374151] flex flex-col
        "
            >
              <span>About Team</span>
              <div className="w-[160px] sm:w-[200px] lg:w-[241px] h-1 rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
            </h2>

            <p
              className="
          font-normal
          text-[16px] leading-[24px] text-[#847262] mt-[32px]   /* Mobile optimized */
          sm:text-[17px] sm:leading-[26px] sm:mt-[40px]          /* Tablet */
          lg:text-[18px] lg:leading-[28px] lg:mt-[69px]          /* Desktop (original) */
        "
            >
              Our team blends fashion, psychology, and AI to create modular,
              sustainable, and intelligent designs that shape the future of how
              we wear, buy, and experience clothing.
            </p>

            <p
              className="
          font-normal
          text-[16px] leading-[24px] text-[#847262] mt-[18px]   /* Mobile */
          sm:text-[17px] sm:leading-[26px] sm:mt-[20px]         /* Tablet */
          lg:text-[18px] lg:leading-[28px] lg:mt-[24px]         /* Desktop (original) */
        "
            >
              If you're passionate about innovation, conscious design, and the
              intersection of creativity and technology — you'll feel at home
              here.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img
              src={teamImg}
              alt="About Team"
              className="
          w-full 
          h-[220px] object-cover        /* Mobile */
          sm:h-[280px]                 /* Tablet */
          lg:h-[360px]                 /* Desktop (original) */
        "
            />

            <div className="absolute inset-0 z-0 bg-[linear-gradient(110.56deg,rgba(26,26,26,0.2)_0%,rgba(64,64,64,0.2)_100%)]"></div>
          </div>
        </div>
      </section>

      {/* Work With Us section*/}
      <section className="px-4 sm:px-6 lg:px-12  sm:py-16 lg:py-15 flex items-center justify-center bg-[#FDFAF8] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[49px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-[10px] shadow-md rounded-tr-[292px] h-[260px] sm:h-[350px] lg:h-full">
            <img
              src={workImg}
              alt="Why Work With Us"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>

          {/* Content Section */}
          <div>
            {/* Heading */}
            <h2 className="font-normal text-[32px] sm:text-[40px] lg:text-[54px] text-[#374151] text-center ">
              Why Work With Us ? 
            </h2>

            <div className="w-[180px] sm:w-[220px] lg:w-[241px] h-1 mx-auto rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>

            <div className="flex flex-col gap-10 sm:gap-12 mt-10 sm:mt-14 lg:mt-[99px]">
              {/* Benefit 01 */}
              <div className="flex items-start gap-6 sm:gap-10 lg:gap-[80px]">
                <div className="min-w-[55px] sm:min-w-[60px] lg:w-[70px] px-2 h-[40px] sm:h-[45px] lg:h-[47px] rounded-tl-[5px] rounded-tr-[38px] rounded-br-[5px] rounded-bl-[38px] bg-[#DDAE8C66] flex items-center justify-center font-normal text-[26px] sm:text-[30px] lg:text-[36px] text-[#374151]">
                  01
                </div>
                <p className="font-normal text-[16px] sm:text-[17px] lg:text-[18px] text-[#6B6B6B]">
                  <span className="text-[#C98A5C]">Purpose with Impact: </span>
                  Be part of a brand reimagining fashion through sustainability
                  and intelligence.
                </p>
              </div>

              {/* Benefit 02 */}
              <div className="flex items-start gap-6 sm:gap-10 lg:gap-[80px]">
                <div className="min-w-[55px] sm:min-w-[60px] lg:w-[70px] h-[40px] sm:h-[45px] lg:h-[47px] rounded-tl-[5px] rounded-tr-[38px] rounded-br-[5px] rounded-bl-[38px] bg-[#DDAE8C66] flex items-center justify-center font-normal text-[26px] sm:text-[30px] lg:text-[36px] text-[#374151]">
                  02
                </div>
                <p className="font-normal text-[16px] sm:text-[17px] lg:text-[18px] text-[#6B6B6B]">
                  <span className="text-[#C98A5C]">
                    Collaborative Culture:{" "}
                  </span>
                  Designers, developers, and dreamers — united by curiosity and
                  creativity.
                </p>
              </div>

              {/* Benefit 03 */}
              <div className="flex items-start gap-6 sm:gap-10 lg:gap-[80px]">
                <div className="min-w-[55px] sm:min-w-[60px] lg:w-[70px] h-[40px] sm:h-[45px] lg:h-[47px] rounded-tl-[5px] rounded-tr-[38px] rounded-br-[5px] rounded-bl-[38px] bg-[#DDAE8C66] flex items-center justify-center font-normal text-[26px] sm:text-[30px] lg:text-[36px] text-[#374151]">
                  03
                </div>
                <p className="font-normal text-[16px] sm:text-[17px] lg:text-[18px] text-[#6B6B6B]">
                  <span className="text-[#C98A5C]">Tech-Driven Craft: </span>
                  Work with AI, 3D design, and digital wardrobes redefining
                  personalization.
                </p>
              </div>

              {/* Benefit 04 */}
              <div className="flex items-start gap-6 sm:gap-10 lg:gap-[80px]">
                <div className="min-w-[55px] sm:min-w-[60px] lg:w-[70px] h-[40px] sm:h-[45px] lg:h-[47px] rounded-tl-[5px] rounded-tr-[38px] rounded-br-[5px] rounded-bl-[38px] bg-[#DDAE8C66] flex items-center justify-center font-normal text-[26px] sm:text-[30px] lg:text-[36px] text-[#374151]">
                  04
                </div>
                <p className="font-normal text-[16px] sm:text-[17px] lg:text-[18px] text-[#6B6B6B]">
                  <span className="text-[#C98A5C]">
                    Empowerment Through Design:{" "}
                  </span>
                  Every role contributes to a more inclusive, adaptive, and
                  human-centered fashion world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles section*/}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-15">
        {/* Heading */}
        <h2 className="font-normal text-[32px] sm:text-[40px] lg:text-[54px] text-[#374151] text-center whitespace-nowrap">
          Open Roles
        </h2>

        <div className="w-[180px] sm:w-[220px] lg:w-[241px] h-1 mx-auto rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>

        <p className="text-center font-normal text-[16px] sm:text-[18px] lg:text-[20px] text-[#374151] mt-3 sm:mt-4 px-2">
          We're growing — and always looking for visionary talent to join our
          journey.
        </p>

        {/* Form Container */}
        <div className="w-full max-w-[873px] mx-auto mt-10 sm:mt-12 bg-white rounded-[20px] shadow-lg p-5 sm:p-8 lg:p-[20px] border border-[#E7E1DA]">
          <p className="text-center font-normal text-[14px] sm:text-[16px] text-[#797979] mb-6 sm:mb-8 px-2">
            Share your CV and tell us how you’d like to contribute to nAia’s
            vision.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-[#374151] mb-1 block">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Daniel"
                  className={`w-full h-[45px] sm:h-[48px] px-[16px] rounded-[50px] border ${
                    errors.firstName ? 'border-red-500' : 'border-[#E5E7EB]'
                  } bg-white placeholder-[#ADAEBC] text-[#374151] focus:ring-2 focus:ring-gray-900 outline-none`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#374151] mb-1 block">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Smith"
                  className={`w-full h-[45px] sm:h-[48px] px-[16px] rounded-[50px] border ${
                    errors.lastName ? 'border-red-500' : 'border-[#E5E7EB]'
                  } bg-white placeholder-[#ADAEBC] text-[#374151] focus:ring-2 focus:ring-gray-900 outline-none`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full h-[45px] sm:h-[48px] px-[16px] rounded-[50px] border ${
                  errors.email ? 'border-red-500' : 'border-[#E5E7EB]'
                } bg-white placeholder-[#ADAEBC] text-[#374151] focus:ring-2 focus:ring-gray-900 outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium text-[#374151] mb-1 block">
                Comment
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Tell us how you'd like to contribute to nAia's vision..."
                rows="4"
                className="w-full px-[16px] py-3 rounded-[16px] border border-[#E5E7EB] bg-white 
                       placeholder-[#ADAEBC] text-[#374151] focus:ring-2 focus:ring-gray-900 outline-none resize-none"
              />
            </div>

            {/* Upload CV */}
            <div>
              <label className="text-sm font-medium text-[#374151] block mb-1">
                Upload CV
              </label>
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="cv-upload"
                className={`w-full h-[70px] sm:h-[77px] gap-[10px] px-[16px] rounded-[16px] 
                         border border-dashed ${
                           errors.cvFile ? 'border-red-500' : 'border-[#C98A5C]'
                         } bg-white flex flex-row items-center justify-center text-[#374151] cursor-pointer hover:bg-gray-50 transition`}
              >
                <img src={upload} alt="upload" className="w-5 sm:w-6" />
                <span className="text-[14px] sm:text-[16px]">
                  {cvFileName || "Upload your CV (.pdf, .doc, .docx)"}
                </span>
              </label>
              {errors.cvFile && (
                <p className="text-red-500 text-xs mt-1">{errors.cvFile}</p>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-[300px] h-[45px] sm:h-[48px] rounded-full mt-[20px] sm:mt-[30px]
                         text-white font-medium transition 
                         bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
                         border border-[#E5E7EB] ${
                           isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                         }`}
              >
                {isSubmitting ? 'Submitting...' : 'Send your Application'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Founders Note section*/}
      {/* <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-[#FDFAF8]"> */}
      <section className="px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-15 flex items-center justify-center bg-[#FDFAF8] w-full mx-auto">
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[45px]">
          {/* Left Side Heading */}
          <div className="flex flex-col items-start justify-center">
            <h2 className="font-normal text-[32px] sm:text-[38px] md:text-[44px] text-[#374151] text-start">
              A Note from Our
            </h2>

            <h3 className="font-normal text-[40px] sm:text-[48px] md:text-[54px] text-[color:var(--dark-beige,#C98A5C)] text-start mt-1">
              Founder
            </h3>

            <div className="w-[160px] sm:w-[200px] md:w-[241px] h-1 mt-2 rounded-full border-b-[3px] border-transparent bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] bg-clip-border"></div>
          </div>

          {/* Right Side Content */}
          <div>
            {/* Opening Quote Box */}
            <div
              className="w-[45px] sm:w-[55px] md:w-[62px] h-[32px] sm:h-[38px] md:h-[42px]
        rounded-tl-[5px] rounded-tr-[38px] rounded-br-[5px] rounded-bl-[38px]
        bg-[#DDAE8C66] flex items-center justify-center font-normal text-[60px] sm:text-[70px] md:text-[80px] text-[#797979] mb-4 relative"
            >
              <span className="absolute top-[-20px] sm:top-[-23px] md:top-[-25px] left-[12px] sm:left-[16px] md:left-[20px]">
                “
              </span>
            </div>

            {/* Main Paragraph */}
            <p className="font-normal text-[16px] sm:text-[18px] md:text-[22px] text-[#374151] leading-[24px] sm:leading-[26px] md:leading-[28px] max-w-xl">
              At nAia, we believe the best ideas come from people who see
              fashion differently — as a dialogue between art, emotion, and
              technology. If that resonates with you, let’s create the future
              together.
            </p>

            {/* Closing Quote Box */}
            <div
              className="w-[45px] sm:w-[55px] md:w-[62px] h-[32px] sm:h-[38px] md:h-[42px]
        rounded-tl-[5px] rounded-tr-[38px] rounded-br-[5px] rounded-bl-[38px]
        bg-[#DDAE8C66] flex items-center justify-center font-normal text-[60px] sm:text-[70px] md:text-[80px] 
        text-[#797979] mt-4 ml-auto relative"
            >
              <span className="absolute top-[-14px] sm:top-[-15px] md:top-[-16px] left-[-5px] sm:left-[-6px] md:left-[-7px]">
                ”
              </span>
            </div>

            {/* Founder Info */}
            <div className="flex items-center gap-[10px] mt-6">
              <img
                src={founderImg}
                alt="Founder"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border object-cover"
              />
              <div>
                <p className="text-gray-900 font-semibold text-base sm:text-lg">
                  Nadeen Aubobead
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Founder & Product Director
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
