import React, { useState, useMemo, useEffect, useCallback } from "react";
import bgImage from "../../assets/images/ui/basicInfoBg.webp";
import ThreeModel from "../../components/avatar/ThreeModel";
import { avatarService } from "../../api/services/avatarService";
import { heightRange, products } from "../../components/avatar/modelsData";
import { toast } from "sonner";

export default function AvatarBuilderPage() {
    const [gender, setGender] = useState("female");
    const [avatarTemplate, setAvatarTemplate] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [availableAvatars, setAvailableAvatars] = useState([]);

    // Avatar customization state
    const [customization, setCustomization] = useState({
        skinTone: null,
        height: heightRange.default,
        hairStyleId: null,
    });

    // Fetch avatar template from API
    const fetchAvatarTemplate = useCallback(async () => {
        try {
            setAvatarLoading(true);
            
            // Step 1: Get available avatars filtered by gender
            const availableData = await avatarService.getAvailableAvatars(gender);
            const avatars = availableData.avatars || [];
            
            if (avatars.length === 0) {
                toast.error(`No avatar templates available for ${gender}`, { duration: 3000 });
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
            
            setAvatarTemplate(template);
            setAvailableAvatars(avatars);

            // Step 4: Set default customization from API data
            // Don't auto-set skin tone - keep it null so "Original" is selected by default
            // User can explicitly choose a skin tone if they want
            if (template.available_skin_colors && Array.isArray(template.available_skin_colors) && template.available_skin_colors.length > 0) {
                // Validate skin colors exist but don't auto-apply
                // skinTone will remain null by default, keeping the model's original skin color
            }

            if (template.hair_styles && Array.isArray(template.hair_styles) && template.hair_styles.length > 0) {
                const firstActiveHairStyle = template.hair_styles.find(
                    style => style && style.is_active
                ) || template.hair_styles[0];
                
                if (firstActiveHairStyle && firstActiveHairStyle.id) {
                    setCustomization(prev => ({
                        ...prev,
                        hairStyleId: firstActiveHairStyle.id,
                    }));
                }
            }
        } catch (err) {
            console.error("Error fetching avatar template:", err);
            const message = err?.response?.data?.error || err?.message || "Failed to load avatar template";
            toast.error(message, { duration: 3000 });
        } finally {
            setAvatarLoading(false);
        }
    }, [gender]);

    // Fetch avatar template when component mounts or gender changes
    useEffect(() => {
        fetchAvatarTemplate();
    }, [fetchAvatarTemplate]);

    // Get avatar path from template
    const avatarPath = avatarTemplate?.base_model_url || null;

    // Get hair style model URL from selected hair style ID
    const hairModelPath = useMemo(() => {
        if (!avatarTemplate || !customization.hairStyleId) return null;
        const hairStyle = avatarTemplate.hair_styles?.find(
            style => style.id === customization.hairStyleId && style.is_active
        );
        return hairStyle?.model_url || null;
    }, [avatarTemplate, customization.hairStyleId]);

    // Get default garments
    const defaultPant = useMemo(
        () =>
            Object.values(products).find(
                (p) => p.gender === gender && p.type === "pant"
            )?.modelPath,
        [gender]
    );

    const defaultTshirt = useMemo(
        () =>
            Object.values(products).find(
                (p) => p.gender === gender && p.type === "tshirt"
            )?.modelPath,
        [gender]
    );

    // Handle skin tone change
    const handleSkinToneChange = (tone) => {
        // Toggle: if clicking the same color, unselect it (set to null)
        setCustomization((prev) => ({
            ...prev,
            skinTone: prev.skinTone === tone ? null : tone
        }));
    };

    // Handle hair style change
    const handleHairStyleChange = (hairStyleId) => {
        setCustomization((prev) => ({ ...prev, hairStyleId: hairStyleId }));
    };

    return (
        <div
            className="w-full min-h-screen relative flex items-center justify-center bg-cover bg-center py-8 px-4"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="relative z-0 w-full max-w-7xl bg-white/60 backdrop-blur-xl border border-white shadow-2xl rounded-3xl px-8 py-8 my-8">

                {/* Stepper Header */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffffff] text-[#374151] flex items-center justify-center text-sm text-[14px]">
                            1
                        </div>
                        <span className="text-[#374151] text-[14px]">Basic Info</span>
                    </div>

                    <div className="w-10 h-[2px] bg-[#ffffff] rounded-full"></div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffffff] text-gray-700 flex items-center justify-center text-sm text-[14px]">
                            2
                        </div>
                        <span className="text-[#374151] text-[14px]">Avatar</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto h-1 bg-[#DDAE8C] rounded-full overflow-hidden mb-8">
                    <div className="h-full w-1/2 bg-[#ffffff]" />
                </div>

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
                                    skinTone={customization.skinTone}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Customization Options */}
                    <div className="w-full flex flex-col">
                        <div className="w-full bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#374151] mb-6">Customize Your Avatar</h3>
                            
                            {/* Skin Tone Section - Using API data */}
                            {avatarTemplate?.available_skin_colors && avatarTemplate.available_skin_colors.length > 0 && (
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
                                                    title={color.name || 'Skin tone'}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Hair Style Section - Using API data */}
                            {avatarTemplate?.hair_styles && avatarTemplate.hair_styles.length > 0 && (
                                <div>
                                    <h4 className="text-base font-semibold text-[#374151] mb-4">Hair style</h4>
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

                            {avatarLoading && (
                                <div className="text-center py-4 text-gray-500">
                                    Loading avatar options...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="w-full flex justify-center mt-6">
                    <button className="w-full max-w-md py-3 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white font-medium shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        Save and Continue
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
            </div>
        </div>
    );
}
