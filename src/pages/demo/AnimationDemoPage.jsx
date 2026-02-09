import React, { useEffect, useState } from 'react';
import AnimationControlExample from '../../components/avatar/AnimationControlExample';
import { avatarService } from '../../api/services/avatarService';
import { cleanEnvVar } from '../../utils/envUtils';

const AnimationDemoPage = () => {
  const [avatarData, setAvatarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch default avatar template for demo
    const fetchAvatarTemplate = async () => {
      try {
        setLoading(true);
        const gender = cleanEnvVar(import.meta.env.VITE_DEFAULT_AVATAR_GENDER_KEY, 'female');
        
        // Use the avatarService instead of raw fetch
        const data = await avatarService.getAvailableAvatars(gender);
        
        if (data.avatars && data.avatars.length > 0) {
          const template = data.avatars[0];
          setAvatarData({
            avatar: template.base_model_url,
            defaultPant: template.default_pant_model_url,
            defaultTshirt: template.default_tshirt_model_url,
            hairStyle: template.hair_styles?.[0]?.model_url || null,
            skinTone: template.available_skin_colors?.[0]?.hex_code || '#D9A38F',
            height: 170,
          });
        } else {
          throw new Error('No avatar templates available');
        }
      } catch (err) {
        console.error('Error fetching avatar:', err);
        setError(err.message || 'Failed to load avatar template');
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarTemplate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2B2B2B] mb-2">
            🎬 3D Animation Demo
          </h1>
          <p className="text-gray-600">
            Test and control 3D model animations with timeline controls
          </p>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#DDAE8C] mb-4"></div>
            <p className="text-gray-600">Loading 3D model...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">⚠️ Error Loading Model</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && avatarData && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <AnimationControlExample
              avatar={avatarData.avatar}
              defaultPant={avatarData.defaultPant}
              defaultTshirt={avatarData.defaultTshirt}
              hairStyle={avatarData.hairStyle}
              skinTone={avatarData.skinTone}
              height={avatarData.height}
            />
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#2B2B2B] mb-4">
            ℹ️ How to Use
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong>Enable Animation:</strong> Toggle to turn animation on/off
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏯</span>
              <div>
                <strong>Play/Pause:</strong> Control animation playback
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎞</span>
              <div>
                <strong>Animation Selection:</strong> Switch between different animations (if available)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <strong>Speed Control:</strong> Adjust animation speed from 0.25x to 3x
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <strong>Timeline Scrubber:</strong> Jump to any point in the animation (currently starts at 1 second)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔁</span>
              <div>
                <strong>Loop Toggle:</strong> Enable/disable animation looping
              </div>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 bg-gradient-to-r from-[#2B2B2B] to-[#3B3B3B] rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">
            🔧 Technical Details
          </h2>
          <div className="space-y-2 text-sm opacity-90">
            <p>• <strong>Animation Start Time:</strong> 1 second (Timeline 1)</p>
            <p>• <strong>Default Speed:</strong> 1.0x (Normal speed)</p>
            <p>• <strong>Loop Mode:</strong> Enabled</p>
            <p>• <strong>Caching:</strong> Models are cached using IndexedDB</p>
            <p>• <strong>Renderer:</strong> Three.js with GLTFLoader</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemoPage;
