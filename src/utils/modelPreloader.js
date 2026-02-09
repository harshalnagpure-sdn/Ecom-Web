import { modelCache } from "../services/modelCache";
import { avatarService } from "../api/services/avatarService";

/**
 * Preload state management
 * Tracks progress for each model type
 */
const preloadState = {
  isPreloading: false,
  progress: {
    avatar: 0,
    pant: 0,
    tshirt: 0,
    hair: 0,
  },
  completed: {
    avatar: false,
    pant: false,
    tshirt: false,
    hair: false,
  },
};

/**
 * Get current preload progress
 * @returns {Object} Progress state with overall percentage
 */
export const getPreloadProgress = () => {
  const items = Object.values(preloadState.progress);
  const total = items.reduce((sum, val) => sum + val, 0);
  const average = items.length > 0 ? total / items.length : 0;
  return {
    ...preloadState.progress,
    overall: Math.round(average),
    isPreloading: preloadState.isPreloading,
    completed: { ...preloadState.completed },
  };
};

/**
 * Reset preload state
 */
export const resetPreloadState = () => {
  preloadState.isPreloading = false;
  preloadState.progress = { avatar: 0, pant: 0, tshirt: 0, hair: 0 };
  preloadState.completed = { avatar: false, pant: false, tshirt: false, hair: false };
};

/**
 * Preload default avatar template with progress tracking
 * Priority order:
 * 1. Avatar base model (175 MB) - MUST complete first
 * 2. Default clothes (20 MB each) - Parallel
 * 3. Hair styles (15 MB each) - Parallel
 * 
 * @param {string} gender - Gender for avatar template (male/female)
 * @param {function} onProgress - Optional callback for progress updates
 * @returns {Promise<void>}
 */
export const preloadDefaultAvatarTemplate = async (gender = "female", onProgress = null) => {
  try {
    preloadState.isPreloading = true;
    resetPreloadState();
    preloadState.isPreloading = true;
    
    console.log(`[ModelPreloader] 🚀 Starting preload for ${gender} avatar...`);
    
    // Get available avatar templates
    const availableData = await avatarService.getAvailableAvatars(gender);
    const avatars = availableData.avatars || [];
    
    if (avatars.length === 0) {
      console.warn(`[ModelPreloader] No avatar templates found for ${gender}`);
      preloadState.isPreloading = false;
      return;
    }

    // Select featured template or first available
    const selectedTemplate = avatars.find(avatar => avatar.is_featured) || avatars[0];
    
    if (!selectedTemplate?.id) {
      console.warn("[ModelPreloader] Invalid template selected");
      preloadState.isPreloading = false;
      return;
    }

    // Get detailed template information
    const templateData = await avatarService.getAvatarTemplate(selectedTemplate.id);
    const template = templateData.avatar_template || templateData.template;
    
    if (!template?.base_model_url) {
      console.warn("[ModelPreloader] Template missing base_model_url");
      preloadState.isPreloading = false;
      return;
    }

    // PRIORITY 1: Preload base avatar (175 MB) - MUST complete first
    console.log("[ModelPreloader] 🔵 Priority 1: Loading base avatar (175 MB)...");
    try {
      await modelCache.getModel(template.base_model_url, (progress) => {
        preloadState.progress.avatar = progress.percentage;
        console.log(`[ModelPreloader] Avatar: ${progress.percentage}%`);
        if (onProgress) onProgress(getPreloadProgress());
      });
      preloadState.completed.avatar = true;
      console.log("[ModelPreloader] ✅ Base avatar loaded!");
    } catch (error) {
      console.error("[ModelPreloader] Failed to load base avatar:", error);
      throw error; // Critical error, stop preloading
    }

    // PRIORITY 2: Preload default clothes (40 MB total) - Parallel
    console.log("[ModelPreloader] 🔵 Priority 2: Loading clothes (40 MB)...");
    const clothesPromises = [];
    
    if (template.default_pant_model_url) {
      clothesPromises.push(
        modelCache.getModel(template.default_pant_model_url, (progress) => {
          preloadState.progress.pant = progress.percentage;
          if (onProgress) onProgress(getPreloadProgress());
        })
        .then(() => {
          preloadState.completed.pant = true;
          console.log("[ModelPreloader] ✅ Pant loaded!");
        })
        .catch((err) => {
          console.error("[ModelPreloader] Failed to preload pant:", err);
        })
      );
    } else {
      preloadState.progress.pant = 100;
      preloadState.completed.pant = true;
    }

    if (template.default_tshirt_model_url) {
      clothesPromises.push(
        modelCache.getModel(template.default_tshirt_model_url, (progress) => {
          preloadState.progress.tshirt = progress.percentage;
          if (onProgress) onProgress(getPreloadProgress());
        })
        .then(() => {
          preloadState.completed.tshirt = true;
          console.log("[ModelPreloader] ✅ Tshirt loaded!");
        })
        .catch((err) => {
          console.error("[ModelPreloader] Failed to preload tshirt:", err);
        })
      );
    } else {
      preloadState.progress.tshirt = 100;
      preloadState.completed.tshirt = true;
    }

    await Promise.allSettled(clothesPromises);

    // PRIORITY 3: Preload hair styles (30 MB total) - Parallel
    console.log("[ModelPreloader] 🔵 Priority 3: Loading hair styles (30 MB)...");
    const hairPromises = [];
    
    if (template.hair_styles && template.hair_styles.length > 0) {
      // Preload first 2 active hair styles
      const activeHairStyles = template.hair_styles
        .filter(h => h.is_active)
        .slice(0, 2);
      
      if (activeHairStyles.length > 0) {
        let hairProgressSum = 0;
        let hairCount = 0;
        
        activeHairStyles.forEach((hairStyle, index) => {
          if (hairStyle.model_url) {
            hairCount++;
            hairPromises.push(
              modelCache.getModel(hairStyle.model_url, (progress) => {
                // Average progress for multiple hair styles
                hairProgressSum += progress.percentage;
                preloadState.progress.hair = Math.round(hairProgressSum / hairCount);
                if (onProgress) onProgress(getPreloadProgress());
              })
              .then(() => {
                console.log(`[ModelPreloader] ✅ Hair style ${index + 1} loaded!`);
              })
              .catch((err) => {
                console.error(`[ModelPreloader] Failed to preload hair ${index + 1}:`, err);
              })
            );
          }
        });
      }
    }

    if (hairPromises.length === 0) {
      preloadState.progress.hair = 100;
      preloadState.completed.hair = true;
    } else {
      await Promise.allSettled(hairPromises);
      preloadState.completed.hair = true;
    }

    console.log("[ModelPreloader] 🎉 All models preloaded successfully!");
    preloadState.isPreloading = false;
    if (onProgress) onProgress(getPreloadProgress());

    return template; // Return template info for caller

  } catch (error) {
    console.error("[ModelPreloader] Error during preload:", error);
    preloadState.isPreloading = false;
    throw error;
  }
};

/**
 * Preload user's saved avatar models (login flow)
 * Loads all models for the user's customized avatar
 * 
 * @param {function} onProgress - Optional callback for progress updates
 * @returns {Promise<void>}
 */
export const preloadUserAvatar = async (onProgress = null) => {
  try {
    preloadState.isPreloading = true;
    resetPreloadState();
    preloadState.isPreloading = true;
    
    console.log("[ModelPreloader] 🚀 Preloading user avatar...");
    
    // Get user's saved avatar
    const avatarData = await avatarService.getUserAvatar();
    const avatar = avatarData.avatar || avatarData;
    
    if (!avatar) {
      console.log("[ModelPreloader] No avatar found for user");
      preloadState.isPreloading = false;
      return;
    }

    const preloadPromises = [];
    let totalItems = 0;
    let completedItems = 0;

    // Count total items to preload
    if (avatar.base_model_url) totalItems++;
    if (avatar.selected_hair_style_url) totalItems++;
    if (avatar.default_pant_model_url) totalItems++;
    if (avatar.default_tshirt_model_url) totalItems++;

    // Base model (priority)
    if (avatar.base_model_url) {
      preloadPromises.push(
        modelCache.getModel(avatar.base_model_url, (progress) => {
          preloadState.progress.avatar = progress.percentage;
          if (onProgress) onProgress(getPreloadProgress());
        })
        .then(() => {
          completedItems++;
          preloadState.completed.avatar = true;
          console.log(`[ModelPreloader] ✅ Base model loaded (${completedItems}/${totalItems})`);
        })
        .catch((err) => {
          console.error("[ModelPreloader] Failed to preload base model:", err);
        })
      );
    } else {
      preloadState.progress.avatar = 100;
      preloadState.completed.avatar = true;
    }

    // Hair style
    if (avatar.selected_hair_style_url) {
      preloadPromises.push(
        modelCache.getModel(avatar.selected_hair_style_url, (progress) => {
          preloadState.progress.hair = progress.percentage;
          if (onProgress) onProgress(getPreloadProgress());
        })
        .then(() => {
          completedItems++;
          preloadState.completed.hair = true;
          console.log(`[ModelPreloader] ✅ Hair style loaded (${completedItems}/${totalItems})`);
        })
        .catch((err) => {
          console.error("[ModelPreloader] Failed to preload hair:", err);
        })
      );
    } else {
      preloadState.progress.hair = 100;
      preloadState.completed.hair = true;
    }

    // Default pant
    if (avatar.default_pant_model_url) {
      preloadPromises.push(
        modelCache.getModel(avatar.default_pant_model_url, (progress) => {
          preloadState.progress.pant = progress.percentage;
          if (onProgress) onProgress(getPreloadProgress());
        })
        .then(() => {
          completedItems++;
          preloadState.completed.pant = true;
          console.log(`[ModelPreloader] ✅ Pant loaded (${completedItems}/${totalItems})`);
        })
        .catch((err) => {
          console.error("[ModelPreloader] Failed to preload pant:", err);
        })
      );
    } else {
      preloadState.progress.pant = 100;
      preloadState.completed.pant = true;
    }

    // Default tshirt
    if (avatar.default_tshirt_model_url) {
      preloadPromises.push(
        modelCache.getModel(avatar.default_tshirt_model_url, (progress) => {
          preloadState.progress.tshirt = progress.percentage;
          if (onProgress) onProgress(getPreloadProgress());
        })
        .then(() => {
          completedItems++;
          preloadState.completed.tshirt = true;
          console.log(`[ModelPreloader] ✅ Tshirt loaded (${completedItems}/${totalItems})`);
        })
        .catch((err) => {
          console.error("[ModelPreloader] Failed to preload tshirt:", err);
        })
      );
    } else {
      preloadState.progress.tshirt = 100;
      preloadState.completed.tshirt = true;
    }

    await Promise.allSettled(preloadPromises);
    
    console.log("[ModelPreloader] 🎉 User avatar preload completed!");
    preloadState.isPreloading = false;
    if (onProgress) onProgress(getPreloadProgress());

    return avatar; // Return avatar info for caller

  } catch (error) {
    // Avatar not found (404) is okay - user might not have created one yet
    if (error?.response?.status === 404) {
      console.log("[ModelPreloader] User hasn't created avatar yet");
    } else {
      console.error("[ModelPreloader] Error preloading user avatar:", error);
    }
    preloadState.isPreloading = false;
  }
};

/**
 * Check if a specific model is already cached
 * @param {string} url - Model URL
 * @returns {boolean}
 */
export const isModelCached = (url) => {
  return modelCache.isCached(url);
};

/**
 * Clear all cached models
 * @returns {Promise<void>}
 */
export const clearAllModelCache = async () => {
  console.log("[ModelPreloader] Clearing all cached models...");
  await modelCache.clearCache();
  resetPreloadState();
  console.log("[ModelPreloader] Cache cleared");
};

/**
 * Get cache size in bytes
 * @returns {Promise<number>}
 */
export const getCacheSize = async () => {
  return await modelCache.getCacheSize();
};
