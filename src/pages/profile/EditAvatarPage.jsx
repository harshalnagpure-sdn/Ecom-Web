import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/ui/basicInfoBg.webp";
import { avatarService } from "../../api/services/avatarService";
import { profileService } from "../../api/services/profileService";
import { toast } from "sonner";
import ThreeModel from "../../components/avatar/ThreeModel";
import {
  heightRange,
} from "../../components/avatar/modelsData";
import { getDefaultGender } from "../../utils/envUtils";

export default function EditAvatarPage() {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const navigate = useNavigate();

  // User's saved avatar data
  const [userAvatar, setUserAvatar] = useState(null);
  
  // Avatar template data from API
  const [avatarTemplate, setAvatarTemplate] = useState(null);
  
  // User gender for loading base template
  const [gender, setGender] = useState(getDefaultGender());

  // Avatar customization state - will be pre-populated from saved avatar
  const [customization, setCustomization] = useState({
    skinTone: null,
    height: heightRange.default,
    hairStyleId: null,
  });

  // Fetch base avatar template (used when user hasn't created avatar yet)
  const fetchBaseAvatarTemplate = useCallback(async (userGender) => {
    try {
      setAvatarLoading(true);
      
      // Step 1: Get available avatars filtered by gender
      const availableData = await avatarService.getAvailableAvatars(userGender);
      const avatars = availableData.avatars || [];
      
      if (avatars.length === 0) {
        toast.error(`No avatar templates available for ${userGender}`, { duration: 3000 });
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
      const template = templateData.avatar_template || templateData.template;
      
      if (!template) {
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

      // Step 4: Set default customization from API data with safety checks
      // Don't auto-set skin tone - keep it null so "Original" is selected by default
      // User's saved avatar will override this when loading their existing avatar
      if (template.available_skin_colors && Array.isArray(template.available_skin_colors) && template.available_skin_colors.length > 0) {
        // Validate skin colors exist but don't auto-apply
        // skinTone will remain null by default, keeping the model's original skin color
      }

      if (template.hair_styles && Array.isArray(template.hair_styles) && template.hair_styles.length > 0) {
        const firstActiveHairStyle = template.hair_styles.find(style => style && style.is_active) || template.hair_styles[0];
        if (firstActiveHairStyle && firstActiveHairStyle.id) {
          setCustomization(prev => ({
            ...prev,
            hairStyleId: firstActiveHairStyle.id,
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching base avatar template:", err);
      const message = err?.response?.data?.error || err?.message || "Failed to load avatar template";
      toast.error(message, { duration: 3000 });
    } finally {
      setAvatarLoading(false);
    }
  }, []);

  // Load user's saved avatar and template, or fallback to base template
  const loadUserAvatar = useCallback(async () => {
    try {
      setAvatarLoading(true);
      
      // First, try to get user profile to get gender
      try {
        const profileData = await profileService.getProfile();
        const profile = profileData?.user || profileData;
        if (profile?.gender) {
          const profileGender = profile.gender.toLowerCase();
          if (profileGender === "male" || profileGender === "female") {
            setGender(profileGender);
          }
        }
      } catch (profileErr) {
        console.warn("Could not fetch user profile for gender, using default:", profileErr);
      }
      
      // Try to get user's saved avatar
      try {
        const avatarResponse = await avatarService.getUserAvatar();
        const avatar = avatarResponse.avatar ?? avatarResponse;
        
        if (avatar && avatar.avatar_template) {
          // User has a saved avatar - load it
          setUserAvatar(avatar);
          setAvatarTemplate(avatar.avatar_template);

          // Extract template data
          let template = null;
          if (avatar.avatar_template && typeof avatar.avatar_template === 'object' && 
              (avatar.avatar_template.available_skin_colors || avatar.avatar_template.hair_styles)) {
            template = avatar.avatar_template;
          } else if (avatar.template && typeof avatar.template === 'object' &&
                   (avatar.template.available_skin_colors || avatar.template.hair_styles)) {
            template = avatar.template;
          }
          
          if (!template) {
            throw new Error("Template data is missing from avatar response");
          }

          if (!template.available_skin_colors || !template.hair_styles) {
            throw new Error("Template data is incomplete. Missing skin colors or hair styles.");
          }

          // Pre-populate customization with saved values
          const savedSkinTone = avatar.selected_skin_color || null;
          const savedHairStyleId = avatar.selected_hair_style || avatar.selected_hair_style_id || null;
          const savedHeight = avatar.height || heightRange.default;

          setCustomization({
            skinTone: savedSkinTone,
            height: savedHeight,
            hairStyleId: savedHairStyleId,
          });
          
          setAvatarLoading(false);
          return; // Successfully loaded saved avatar
        }
      } catch (avatarErr) {
        // If 404 or no avatar, fall through to load base template
        if (avatarErr?.response?.status !== 404) {
          console.warn("Error loading user avatar, will load base template:", avatarErr);
        }
      }
      
      // No saved avatar found - load base template
      console.log("No saved avatar found, loading base template for gender:", gender);
      await fetchBaseAvatarTemplate(gender);
      
    } catch (err) {
      console.error("Error in loadUserAvatar:", err);
      toast.error("Failed to load avatar. Please try again.", { duration: 3000 });
      setAvatarLoading(false);
    }
  }, [gender, fetchBaseAvatarTemplate]);

  // Load avatar on mount
  useEffect(() => {
    loadUserAvatar();
  }, [loadUserAvatar]);

  // Get avatar path from template
  const avatarPath =
    userAvatar?.base_model_url ||
    avatarTemplate?.base_model_url ||
    null;

  // Get hair style path from selected hair style ID
  const hairModelPath = useMemo(() => {
    // 1️⃣ Priority: Resolve from template using currently selected ID (for real-time updates)
    if (avatarTemplate && customization.hairStyleId && Array.isArray(avatarTemplate.hair_styles)) {
      const hair = avatarTemplate.hair_styles.find(
        h => h && h.id === customization.hairStyleId && h.is_active
      );
      if (hair?.model_url) {
        return hair.model_url;
      }
    }

    // 2️⃣ Fallback: user saved hair URL (only if no selection made yet)
    if (userAvatar?.selected_hair_style_url && !customization.hairStyleId) {
      return userAvatar.selected_hair_style_url;
    }

    return null;
  }, [userAvatar, avatarTemplate, customization.hairStyleId]);

  // Get default clothes from backend avatar template
const defaultTshirt =
  userAvatar?.default_tshirt_model_url ||
  avatarTemplate?.default_tshirt_model_url ||
  null;

const defaultPant =
  userAvatar?.default_pant_model_url ||
  avatarTemplate?.default_pant_model_url ||
  null;


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

  // Save avatar handler - Create if doesn't exist, otherwise update
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

      const avatarPayload = {
        avatar_template_id: avatarTemplate.id,
        selected_hair_style_id: customization.hairStyleId,
        selected_skin_color: customization.skinTone,
        name: userAvatar?.name || "My Avatar",
        height: customization.height,
        weight: userAvatar?.weight || 65.0,
        ...(avatarTemplate.default_pant_model_url && { default_pant_model_url: avatarTemplate.default_pant_model_url }),
        ...(avatarTemplate.default_tshirt_model_url && { default_tshirt_model_url: avatarTemplate.default_tshirt_model_url }),
      };

      if (userAvatar) {
        // User has existing avatar - update it
        await avatarService.updateUserAvatar(avatarPayload);
        toast.success("Avatar updated successfully", { duration: 2000 });
      } else {
        // No existing avatar - create it
        await avatarService.createUserAvatar(avatarPayload);
        toast.success("Avatar created successfully", { duration: 2000 });
      }

      // Navigate to profile page after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Error saving avatar:", err);
      
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
      className="w-full relative flex items-center justify-center bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Center Frosted Card */}
      <div className="relative z-0 bg-white/60 backdrop-blur-xl border border-white shadow-2xl rounded-3xl my-[100px] w-full max-w-7xl px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-[24px]">
          <h2 className="text-2xl font-semibold text-[#374151]">
            {userAvatar ? "Edit Your Avatar" : "Create Your Avatar"}
          </h2>
        </div>

        {/* Content */}
        {avatarLoading ? (
          <div className="w-full flex items-center justify-center py-12">
            <div className="text-[#374151]">Loading your avatar...</div>
          </div>
        ) : !avatarTemplate ? (
          <div className="w-full flex items-center justify-center py-12">
            <div className="text-red-500">Failed to load avatar. Please try again.</div>
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

            {/* Save Button */}
            <div className="w-full flex justify-center mt-6">
              <button
                onClick={handleSaveAvatar}
                disabled={loading || !customization.hairStyleId}
                className="w-full max-w-md py-3 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white font-medium shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : userAvatar ? "Save Changes" : "Create Avatar"}
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
      </div>
    </div>
  );
}








