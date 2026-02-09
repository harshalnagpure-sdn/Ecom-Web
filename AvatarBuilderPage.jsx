import React, { useState, useMemo } from "react";
import bgImage from "../../assets/images/ui/basicInfoBg.png";
import ThreeModel from "../../components/avatar/ThreeModel";
import {
  modelsData,
  skinTones,
  hairStyles,
  heightRange,
  products,
} from "../../components/avatar/modelsData";

export default function AvatarBuilderPage() {
    const [gender, setGender] = useState("female");

    // Avatar customization state
    const [customization, setCustomization] = useState({
        skinTone: null,  // Start with "Original" (null = no custom skin tone)
        height: heightRange.default,
        hairStyleKey: "default",
    });

    // Get avatar path
    const avatarPath = modelsData.avatars[gender] || modelsData.avatars.female || null;

    // Get hair style path
    const genderHair = hairStyles[gender] || hairStyles.female || {};
    const hairModelPath =
        (genderHair[customization.hairStyleKey] &&
            genderHair[customization.hairStyleKey].modelPath) || null;

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
        setCustomization((prev) => ({ ...prev, skinTone: tone }));
    };

    // Handle hair style change
    const handleHairStyleChange = (hairKey) => {
        setCustomization((prev) => ({ ...prev, hairStyleKey: hairKey }));
    };

    return (
        <div
            className="w-full min-h-screen relative flex items-center justify-center bg-cover bg-center py-8 px-4"
            style={{ backgroundImage: `url(${bgImage})` }}
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
                            
                            {/* Skin Tone Section */}
                            <div className="mb-8">
                                <h4 className="text-base font-semibold text-[#374151] mb-4">Skin tone</h4>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* Original Skin Tone Option */}
                                    <button
                                        onClick={() => handleSkinToneChange(null)}
                                        className={`w-[60px] h-[60px] rounded-lg border-2 transition-all
                                            flex items-center justify-center shadow-sm cursor-pointer hover:scale-105
                                            ${
                                                customization.skinTone === null
                                                    ? "border-[#4C44AB] border-3 ring-2 ring-[#4C44AB]/30"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                        style={{ backgroundColor: "#ffffff" }}
                                        title="Original"
                                    >
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>
                                    
                                    {/* Other Skin Tone Options */}
                                    {Object.entries(skinTones).map(([key, color], index) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSkinToneChange(color)}
                                            className={`w-[60px] h-[60px] rounded-lg border-2 transition-all
                                                flex items-center justify-center shadow-sm cursor-pointer hover:scale-105
                                                ${
                                                    customization.skinTone === color
                                                        ? "border-[#4C44AB] border-3 ring-2 ring-[#4C44AB]/30"
                                                        : "border-gray-300 hover:border-gray-400"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Hair Style Section */}
                            <div>
                                <h4 className="text-base font-semibold text-[#374151] mb-4">Hair style</h4>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {Object.entries(genderHair).map(([key, style]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleHairStyleChange(key)}
                                            className={`px-4 py-3 rounded-lg border-2 transition-all
                                                flex items-center justify-center shadow-sm cursor-pointer text-sm font-medium hover:scale-105
                                                ${
                                                    customization.hairStyleKey === key
                                                        ? "border-[#4C44AB] bg-[#4C44AB]/10 text-[#4C44AB]"
                                                        : "border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400"
                                                }`}
                                        >
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
