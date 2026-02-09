import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/ui/basicInfoBg.webp";
import { profileService } from "../../api/services/profileService";
import { avatarService } from "../../api/services/avatarService";
import { toast } from "sonner";
import ThreeModel from "../../components/avatar/ThreeModel";
import PhoneInput from "react-phone-number-input";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getCountryCallingCode } from "react-phone-number-input";
import {
  heightRange,
} from "../../components/avatar/modelsData";
import { preloadDefaultAvatarTemplate, getPreloadProgress } from "../../utils/modelPreloader";
import { getDefaultGender, cleanEnvVar } from "../../utils/envUtils";

const BASIC_INFO_TAB_STORAGE_KEY = cleanEnvVar(import.meta.env.VITE_BASIC_INFO_TAB_STORAGE_KEY) || "basicInfoActiveTab";
console.log("BASIC_INFO_TAB_STORAGE_KEY", BASIC_INFO_TAB_STORAGE_KEY);
export default function BasicInfoForm() {
  const DEFAULT_AVATAR_GENDER = getDefaultGender();
  
  // Initialize activeMainTab from localStorage or default to "basicinfo"
  const [activeMainTab, setActiveMainTab] = useState(() => {
    const savedTab = localStorage.getItem(BASIC_INFO_TAB_STORAGE_KEY);
    return savedTab === "avatar" || savedTab === "basicinfo" ? savedTab : "basicinfo";
  });
  const [gender, setGender] = useState(DEFAULT_AVATAR_GENDER);
  const [phoneCountry, setPhoneCountry] = useState("AE");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const navigate = useNavigate();

  // Avatar template data from API
  const [avatarTemplate, setAvatarTemplate] = useState(null);
  const [availableAvatars, setAvailableAvatars] = useState([]);

  // Model preloading progress state
  const [preloadProgress, setPreloadProgress] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);

  // Avatar customization state
  const [customization, setCustomization] = useState({
    skinTone: null, // Will be set from API
    height: heightRange.default,
    hairStyleId: null, // Changed from hairStyleKey to hairStyleId
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const fetchAvatarTemplate = useCallback(async () => {
    try {
      setAvatarLoading(true);
      
      // IMPORTANT: Avatar API only supports female avatars currently
      // Always use "female" for avatar fetching, regardless of user's gender selection
      const avatarGender = "female";
      
      // Step 1: Get available avatars filtered by gender
      const availableData = await avatarService.getAvailableAvatars(avatarGender);
      const avatars = availableData.avatars || [];
      
      if (avatars.length === 0) {
        toast.error(`No avatar templates available`, { duration: 3000 });
        setAvatarLoading(false);
        return;
      }

      // Step 2: Get the first available template (or featured one)
      const selectedTemplate = avatars.find(avatar => avatar.is_featured) || avatars[0];
      
      if (!selectedTemplate || !selectedTemplate.id) {
        throw new Error("Invalid template selected");
      }
      
      // Step 3: Get detailed template information
      const templateData = await avatarService.getAvatarTemplate(selectedTemplate.id);
      const template = templateData.avatar_template || templateData.template; // Support both response formats
      
      // Validate template structure
      if (!template) {
        console.error("Template data structure:", templateData);
        throw new Error("Template data is missing");
      }

      // Log warnings for debugging
      if (!template.available_skin_colors || !Array.isArray(template.available_skin_colors)) {
        console.warn("Template missing or invalid available_skin_colors:", template);
      }

      if (!template.hair_styles || !Array.isArray(template.hair_styles)) {
        console.warn("Template missing or invalid hair_styles:", template);
      }
      
      setAvatarTemplate(template);
      setAvailableAvatars(avatars);

      // Step 4: Set default customization from API data with safety checks
      // Don't auto-set skin tone - let user explicitly choose or keep model's original color
      // Skin colors are available in template for user to select from picker
      if (template.available_skin_colors && Array.isArray(template.available_skin_colors) && template.available_skin_colors.length > 0) {
        // Validate skin color data exists but don't auto-apply
        const firstActiveSkinColor = template.available_skin_colors.find(color => color && color.is_active) || template.available_skin_colors[0];
        if (!firstActiveSkinColor || !firstActiveSkinColor.hex_code) {
          console.error("Invalid skin color data:", firstActiveSkinColor);
          toast.error("Invalid skin color data in template", { duration: 2000 });
        }
        // skinTone will remain null by default, keeping the model's original skin color
      }

      if (template.hair_styles && Array.isArray(template.hair_styles) && template.hair_styles.length > 0) {
        const firstActiveHairStyle = template.hair_styles.find(style => style && style.is_active) || template.hair_styles[0];
        if (firstActiveHairStyle && firstActiveHairStyle.id) {
          setCustomization(prev => ({
            ...prev,
            hairStyleId: firstActiveHairStyle.id,
          }));
        } else {
          console.error("Invalid hair style data:", firstActiveHairStyle);
          toast.error("Invalid hair style data in template", { duration: 2000 });
        }
      }
    } catch (err) {
      console.error("Error fetching avatar template:", err);
      console.error("Error response:", err?.response?.data);
      console.error("Error message:", err?.message);
      console.error("Full error:", err);
      
      const message = err?.response?.data?.error || err?.message || "Failed to load avatar template";
      toast.error(message, { duration: 3000 });
    } finally {
      setAvatarLoading(false);
    }
  }, [gender]);

  // Save activeMainTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(BASIC_INFO_TAB_STORAGE_KEY, activeMainTab);
  }, [activeMainTab]);

  // Start preloading models when component mounts (background)
  useEffect(() => {
    setIsPreloading(true);
    
    // Start preloading in background
    preloadDefaultAvatarTemplate(gender, (progress) => {
      setPreloadProgress(progress);
    }).finally(() => {
      setIsPreloading(false);
    });

    // Poll for progress updates
    const interval = setInterval(() => {
      const progress = getPreloadProgress();
      setPreloadProgress(progress);
      
      if (!progress.isPreloading) {
        clearInterval(interval);
        setIsPreloading(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [gender]);

  // Fetch available avatars when avatar tab is activated or gender changes
  useEffect(() => {
    if (activeMainTab === "avatar") {
      // Reset state when gender changes
      setAvatarTemplate(null);
      setCustomization(prev => ({
        ...prev,
        skinTone: null,
        hairStyleId: null,
      }));
      fetchAvatarTemplate();
    }
  }, [activeMainTab, gender, fetchAvatarTemplate]);


  // Get avatar path from template
  const avatarPath = avatarTemplate?.base_model_url || null;

  // Get hair style path from selected hair style ID
  const hairModelPath = useMemo(() => {
    if (!avatarTemplate || !customization.hairStyleId) return null;
    const hairStyle = avatarTemplate.hair_styles?.find(
      style => style.id === customization.hairStyleId && style.is_active
    );
    return hairStyle?.model_url || null;
  }, [avatarTemplate, customization.hairStyleId]);

  // Get default clothes from backend avatar template
  const defaultPant = avatarTemplate?.default_pant_model_url || null;
  const defaultTshirt = avatarTemplate?.default_tshirt_model_url || null;

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    };
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isPossiblePhoneNumber(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number for the selected country";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors in the form", { duration: 2000 });
      return;
    }
    try {
      setLoading(true);
      // Ensure we always send an E.164 phone string to backend.
      if (!form.phone || !form.phone.startsWith("+")) {
        throw new Error("Please enter a valid international phone number");
      }
      await profileService.updateProfile({
        firstname: form.firstName.trim(),
        lastname: form.lastName.trim(),
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postalCode,
        country: form.country,
        gender: gender, // Save user's gender preference
      });
      toast.success("Profile updated");
      setActiveMainTab("avatar");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update profile";
      toast.error(message, { duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setActiveMainTab("avatar");
  };

  // Avatar customization handlers
  const handleSkinToneChange = (hexCode) => {
    // Toggle: if clicking the same color, unselect it (set to null)
    setCustomization((prev) => ({
      ...prev,
      skinTone: prev.skinTone === hexCode ? null : hexCode
    }));
  };

  const handleHairStyleChange = (hairStyleId) => {
    setCustomization((prev) => ({ ...prev, hairStyleId: hairStyleId }));
  };

  // Save avatar handler - Optimized: Try POST first, then PUT if avatar exists
  const handleSaveAvatar = async () => {
    if (!avatarTemplate) {
      toast.error("Avatar template not loaded", { duration: 2000 });
      return;
    }

    if (!customization.hairStyleId) {
      toast.error("Please select a hair style", { duration: 2000 });
      return;
    }
    
    // Skin tone is optional - null means use original model color

    try {
      setLoading(true);

      // Use user's name from form, fallback to "My Avatar"
      const avatarName = 
        `${form.firstName} ${form.lastName}`.trim() || "My Avatar";

      // Get default garments directly from avatarTemplate to ensure latest values
      const defaultPantUrl = avatarTemplate?.default_pant_model_url;
      const defaultTshirtUrl = avatarTemplate?.default_tshirt_model_url;

      const avatarPayload = {
        avatar_template_id: avatarTemplate.id,
        selected_hair_style_id: customization.hairStyleId,
        selected_skin_color: customization.skinTone,
        name: avatarName,
        height: customization.height,
        weight: 65.0, // Default weight, you can add this to customization state
        ...(defaultPantUrl && { default_pant_model_url: defaultPantUrl }),
        ...(defaultTshirtUrl && { default_tshirt_model_url: defaultTshirtUrl }),
      };

      let response;
      try {
        // Try to create new avatar first (optimized: no GET call needed)
        response = await avatarService.createUserAvatar(avatarPayload);
        toast.success("Avatar created successfully", { duration: 2000 });
      } catch (createErr) {
        // If avatar already exists (400 error), update it instead
        if (createErr?.response?.status === 400 && 
            (createErr?.response?.data?.error?.includes("already exists") ||
             createErr?.response?.data?.error?.includes("Avatar already exists"))) {
          response = await avatarService.updateUserAvatar(avatarPayload);
          toast.success("Avatar updated successfully", { duration: 2000 });
        } else {
          // Re-throw other errors to be handled by outer catch
          throw createErr;
        }
      }

      // Avatar saved successfully - navigate to home page after a short delay
      console.log("Avatar saved:", response);
      
      // Wait a moment for user to see success message, then navigate
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error saving avatar:", err);
      
      // Provide more specific error messages based on backend response
      let errorMessage = "Failed to save avatar";
      
      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.status === 400) {
        errorMessage = "Invalid avatar data. Please check your selections.";
      } else if (err?.response?.status === 401) {
        errorMessage = "Please log in again to save your avatar.";
      } else if (err?.response?.status === 404) {
        errorMessage = "Avatar template or hair style not found.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full  relative flex items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Remove react-phone-number-input focus styling */}
      <style>{`
        .PhoneInputInput:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .PhoneInputInput {
          outline: none;
          box-shadow: none;
        }
      `}</style>

      {/* Subtle progress indicator at top - Only show if preloading and progress < 100 */}
      {isPreloading && preloadProgress && preloadProgress.overall < 100 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-200/50">
            <div 
              className="h-full bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] transition-all duration-300 ease-out"
              style={{ width: `${preloadProgress.overall}%` }}
            />
          </div>
        </div>
      )}
      {/* Dark overlay */}
     
     
      {/* <div className="absolute inset-0 brightness-75"></div> */}

      {/* Center Frosted Card */}
      <div className={`relative z-0 bg-white/60 backdrop-blur-xl border border-white shadow-2xl rounded-3xl my-[100px] ${
        activeMainTab === "avatar" 
          ? "w-full max-w-7xl px-8 py-8" 
          : "w-[550px] px-[43px] py-[26px]"
      }`}>
        {/* Stepper Header - Now Clickable Tabs */}
        <div className="flex items-center justify-center gap-4 mb-[24px]">
          {/* Step 1 (Basic Info) - Clickable */}
          <div 
            onClick={() => setActiveMainTab("basicinfo")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-normal text-[14px] ${
              activeMainTab === "basicinfo" 
                ? "bg-[#ffffff] text-[#374151]" 
                : "bg-white/70 text-gray-700"
            }`}>
              1
            </div>
            <span className="text-[#374151] font-normal tracking-wide text-[14px]">
              Basic Info
            </span>
          </div>

          {/* Separator Line */}
          <div className="w-10 h-[2px] bg-[#ffffff] rounded-full"></div>

          {/* Step 2 (Avatar) - Clickable */}
          <div 
            onClick={() => setActiveMainTab("avatar")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-normal text-[14px] ${
              activeMainTab === "avatar" 
                ? "bg-[#ffffff] text-[#374151]" 
                : "bg-white/70 text-gray-700"
            }`}>
              2
            </div>
            <span className="text-[#374151] font-normal tracking-wide text-[14px]">
              Avatar
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#FFFFFF99] rounded-full overflow-hidden mb-[32px]">
          <div className={`h-full transition-all ${
            activeMainTab === "basicinfo" ? "w-1/2" : "w-full"
          } bg-[#DDAE8C]`}></div>
        </div>

        {/* Basic Info Tab Content */}
        {activeMainTab === "basicinfo" && (
          <>
            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-900 font-medium ">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, firstName: e.target.value }));
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }
                  }}
                  placeholder="Enter your first name"
                  className={`w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-gray-700 placeholder-[#ADAEBC] outline-none border ${
                    errors.firstName ? "border-red-500" : "border-white/40"
                  } focus:border-gray-700 transition`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-[#374151] font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, lastName: e.target.value }));
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }
                  }}
                  placeholder="Enter your last name"
                  className={`w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-[#374151] placeholder-[#ADAEBC] outline-none border ${
                    errors.lastName ? "border-red-500" : "border-white/40"
                  } focus:border-gray-700 transition`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm text-[#374151] font-medium">
                  Phone Number
                </label>
                <div
                  className="w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-[#374151] placeholder-[#ADAEBC] outline-none"
                >
                  <PhoneInput
                    international
                    limitMaxLength
                    defaultCountry="AE"
                    country={phoneCountry}
                    value={form.phone}
                    onCountryChange={(c) => {
                      const next = c || "AE";
                      setPhoneCountry(next);

                      // Auto-fill country based on selection (user can still edit)
                      setForm((prev) => ({
                        ...prev,
                        country: prev.country?.trim()
                          ? prev.country
                          : `${next} (+${getCountryCallingCode(next)})`,
                      }));
                    }}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, phone: value || "" }));
                      if (errors.phone) {
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm text-[#374151] font-medium">
                  Shipping Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, address: e.target.value }));
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: "" }));
                    }
                  }}
                  placeholder="Enter your shipping address"
                  className={`w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-[#374151] placeholder-[#ADAEBC] outline-none border ${
                    errors.address ? "border-red-500" : "border-white/40"
                  } focus:border-gray-700 transition`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-[#374151] font-medium">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, city: e.target.value }));
                    if (errors.city) {
                      setErrors((prev) => ({ ...prev, city: "" }));
                    }
                  }}
                  placeholder="Enter your city"
                  className={`w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-[#374151] placeholder-[#ADAEBC] outline-none border ${
                    errors.city ? "border-red-500" : "border-white/40"
                  } focus:border-gray-700 transition`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-[#374151] font-medium">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, postalCode: e.target.value }));
                    if (errors.postalCode) {
                      setErrors((prev) => ({ ...prev, postalCode: "" }));
                    }
                  }}
                  placeholder="Enter your postal code"
                  className={`w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-[#374151] placeholder-[#ADAEBC] outline-none border ${
                    errors.postalCode ? "border-red-500" : "border-white/40"
                  } focus:border-gray-700 transition`}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm text-[#374151] font-medium">
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, country: e.target.value }));
                    if (errors.country) {
                      setErrors((prev) => ({ ...prev, country: "" }));
                    }
                  }}
                  placeholder="Enter your country"
                  className={`w-full bg-white/60 backdrop-blur-md rounded-full py-3 px-5 mt-2 text-[#374151] placeholder-[#ADAEBC] outline-none border ${
                    errors.country ? "border-red-500" : "border-white/40"
                  } focus:border-gray-700 transition`}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="mt-6">
              <p className="text-sm text-[#374151] font-medium mb-3">
                How do you identify?
              </p>

              <div className="grid grid-cols-3 gap-4">
                {/* MALE */}
                <div
                  onClick={() => setGender("male")}
                  className={`
                    cursor-pointer transition rounded-xl
                    ${
                      gender === "male"
                        ? "p-[1px] bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]" 
                        : "bg-white/60 backdrop-blur-lg border border-transparent"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center rounded-xl py-5 bg-white shadow-md">
                    <span className="text-blue-500 text-2xl">♂</span>
                    <p className="text-[#374151] text-sm mt-2">Male</p>
                  </div>
                </div>

                {/* FEMALE */}
                <div
                  onClick={() => setGender("female")}
                  className={`
                    cursor-pointer transition rounded-xl
                    ${gender === "female"
                      ? "p-[1px] bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]"
                      : "bg-white/60 backdrop-blur-lg border border-transparent"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center rounded-xl py-5 bg-white shadow-md">
                    <span className="text-pink-500 text-2xl">♀</span>
                    <p className="text-[#374151] text-sm mt-2">Female</p>
                  </div>
                </div>
                {/* NON-BINARY */}
               {/* <div
                  onClick={() => setGender("nonbinary")}
                  className={`
                    cursor-pointer transition rounded-xl
                    ${gender === "nonbinary"
                      ? "p-[1px] bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]"
                      : "bg-white/60 backdrop-blur-lg border border-transparent"
                    }
                  `} >
                  <div className="flex flex-col items-center justify-center rounded-xl py-5 bg-white shadow-md">
                    <span className="text-purple-500 text-2xl">⚧</span>
                    <p className="text-[#374151] text-sm mt-2">Non-binary</p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Save and Skip */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white text-center font-medium shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save"}
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
            <button
              type="button"
              onClick={handleSkip}
              className="w-full mt-3 py-3 rounded-full border border-[#DDAE8C] text-[#374151] font-medium shadow-sm flex items-center justify-center gap-2 bg-white/70 hover:bg-white"
            >
              Skip
            </button>
          </>
        )}

        {/* Avatar Builder Tab Content */}
        {activeMainTab === "avatar" && (
          <>
            {avatarLoading ? (
              <div className="w-full flex items-center justify-center py-12">
                <div className="text-[#374151]">Loading avatar template...</div>
              </div>
            ) : !avatarTemplate ? (
              <div className="w-full flex items-center justify-center py-12">
                <div className="text-red-500">Failed to load avatar template</div>
              </div>
            ) : (
              <>
                {/* Two Column Layout: Avatar Left, Customization Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  {/* Left Side - Avatar Preview */}
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full bg-[#2f3137] rounded-3xl p-6 shadow-lg">
                      <div className="w-full flex items-center justify-center rounded-3xl overflow-hidden bg-[#2f3137]">
                        <ThreeModel
                          avatar={avatarPath}
                          defaultPant={defaultPant}
                          defaultTshirt={defaultTshirt}
                          garment={null}
                          hairStyle={hairModelPath}
                          height={customization.height}
                          skinTone={customization.skinTone || null}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Customization Options */}
                  <div className="w-full flex flex-col">
                    <div className="w-full bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-[#374151] mb-6">
                        Customize Your Avatar
                      </h3>

                      {/* Skin Tone Section - Using API data */}
                      {avatarTemplate.available_skin_colors && avatarTemplate.available_skin_colors.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-base font-semibold text-[#374151] mb-4">
                            Skin tone
                          </h4>
                          <div className="flex items-center gap-4 flex-wrap">
                            {/* Original Skin Tone Button */}
                            <button
                              onClick={() => setCustomization((prev) => ({ ...prev, skinTone: null }))}
                              className={`w-[60px] h-[60px] rounded-lg border-2 transition-all
                                flex flex-col items-center justify-center shadow-sm cursor-pointer hover:scale-105
                                ${
                                  customization.skinTone === null
                                    ? "border-[#4C44AB] border-3 ring-2 ring-[#4C44AB]/30 bg-gradient-to-br from-blue-50 to-purple-50"
                                    : "border-gray-300 hover:border-gray-400 bg-white"
                                }`}
                              title="Original skin color from avatar"
                            >
                              <span className="text-xl mb-1">👤</span>
                              <span className="text-[9px] font-medium text-gray-600">Original</span>
                            </button>
                            
                            {/* Color Options */}
                            {avatarTemplate.available_skin_colors
                              .filter(color => color.is_active)
                              .map((color) => (
                              <button
                                key={color.id}
                                onClick={() => handleSkinToneChange(color.hex_code)}
                                className={`w-[60px] h-[60px] rounded-lg border-2 transition-all
                                  flex items-center justify-center shadow-sm cursor-pointer hover:scale-105
                                  ${
                                    customization.skinTone === color.hex_code
                                      ? "border-[#4C44AB] border-3 ring-2 ring-[#4C44AB]/30"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                style={{ backgroundColor: color.hex_code }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hair Style Section - Using API data */}
                      {avatarTemplate.hair_styles && avatarTemplate.hair_styles.length > 0 && (
                        <div>
                          <h4 className="text-base font-semibold text-[#374151] mb-4">
                            Hair style
                          </h4>
                          <div className="flex items-center gap-4 flex-wrap">
                            {avatarTemplate.hair_styles
                              .filter(style => style.is_active)
                              .map((style) => (
                              <button
                                key={style.id}
                                onClick={() => handleHairStyleChange(style.id)}
                                className={`px-4 py-3 rounded-lg border-2 transition-all
                                  flex items-center justify-center shadow-sm cursor-pointer text-sm font-medium hover:scale-105
                                  ${
                                    customization.hairStyleId === style.id
                                      ? "border-[#4C44AB] bg-[#4C44AB]/10 text-[#4C44AB]"
                                      : "border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400"
                                  }`}
                              >
                                {style.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save and Continue Button */}
                <div className="w-full flex justify-center mt-6">
                  <button
                    onClick={handleSaveAvatar}
                    disabled={loading || !customization.hairStyleId}
                    className="w-full max-w-md py-3 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white font-medium shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save and Continue"}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
