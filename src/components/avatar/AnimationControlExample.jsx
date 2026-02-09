/**
 * Animation Control Example Component
 * 
 * This is a demo component showing how to use animation controls with ThreeModel.
 * You can integrate these controls into your actual pages (BasicInfoPage, EditAvatarPage, etc.)
 */

import React, { useState } from 'react';
import ThreeModel from './ThreeModel';

const AnimationControlExample = ({ 
  avatar, 
  defaultPant, 
  defaultTshirt, 
  hairStyle,
  skinTone,
  height 
}) => {
  // Animation state
  const [enableAnimation, setEnableAnimation] = useState(true);  // ✅ Enabled by default to show animation
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [animationStartTime, setAnimationStartTime] = useState(1);  // ✅ Start at 1 second (timeline 1)
  const [loopAnimation, setLoopAnimation] = useState(true);
  const [pauseAnimation, setPauseAnimation] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Model Viewer */}
      <div className="w-full">
        <ThreeModel
          avatar={avatar}
          defaultPant={defaultPant}
          defaultTshirt={defaultTshirt}
          hairStyle={hairStyle}
          skinTone={skinTone}
          height={height}
          // Animation props
          enableAnimation={enableAnimation}
          animationIndex={animationIndex}
          animationSpeed={animationSpeed}
          animationStartTime={animationStartTime}
          loopAnimation={loopAnimation}
          pauseAnimation={pauseAnimation}
        />
      </div>

      {/* Animation Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Animation Controls</h3>
        
        {/* Enable Animation Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableAnimation}
              onChange={(e) => setEnableAnimation(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Enable Animation</span>
          </label>
        </div>

        {enableAnimation && (
          <>
            {/* Play/Pause */}
            <div className="mb-4">
              <button
                onClick={() => setPauseAnimation(!pauseAnimation)}
                className="px-4 py-2 bg-[#2B2B2B] text-white rounded-lg hover:bg-[#3B3B3B] transition-colors"
              >
                {pauseAnimation ? '▶ Play' : '⏸ Pause'}
              </button>
            </div>

            {/* Animation Index Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Animation Selection
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAnimationIndex(0)}
                  className={`px-3 py-1 rounded ${animationIndex === 0 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  Animation 1
                </button>
                <button
                  onClick={() => setAnimationIndex(1)}
                  className={`px-3 py-1 rounded ${animationIndex === 1 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  Animation 2
                </button>
                <button
                  onClick={() => setAnimationIndex(2)}
                  className={`px-3 py-1 rounded ${animationIndex === 2 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  Animation 3
                </button>
              </div>
            </div>

            {/* Speed Control */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Speed: {animationSpeed}x
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setAnimationSpeed(0.25)}
                  className={`px-3 py-1 rounded text-sm ${animationSpeed === 0.25 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  0.25x
                </button>
                <button
                  onClick={() => setAnimationSpeed(0.5)}
                  className={`px-3 py-1 rounded text-sm ${animationSpeed === 0.5 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setAnimationSpeed(1.0)}
                  className={`px-3 py-1 rounded text-sm ${animationSpeed === 1.0 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setAnimationSpeed(1.5)}
                  className={`px-3 py-1 rounded text-sm ${animationSpeed === 1.5 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  1.5x
                </button>
                <button
                  onClick={() => setAnimationSpeed(2.0)}
                  className={`px-3 py-1 rounded text-sm ${animationSpeed === 2.0 ? 'bg-[#DDAE8C] text-white' : 'bg-gray-200'}`}
                >
                  2x
                </button>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Timeline Scrubber */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Timeline: {animationStartTime.toFixed(2)}s
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={animationStartTime}
                onChange={(e) => setAnimationStartTime(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setAnimationStartTime(0)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Start
                </button>
                <button
                  onClick={() => setAnimationStartTime(2.0)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  2s
                </button>
                <button
                  onClick={() => setAnimationStartTime(5.0)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  5s
                </button>
                <button
                  onClick={() => setAnimationStartTime(10.0)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  10s
                </button>
              </div>
            </div>

            {/* Loop Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loopAnimation}
                  onChange={(e) => setLoopAnimation(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Loop Animation</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnimationControlExample;
