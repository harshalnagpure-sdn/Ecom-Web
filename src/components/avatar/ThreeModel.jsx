// src/components/avatar/ThreeModel.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import LoaderOverlay from "./LoaderOverlay";
import { modelCache } from "../../services/modelCache";

const ThreeModel = ({
  avatar,
  garment,
  garmentType,
  height,
  skinTone,
  hairStyle,
  defaultPant,
  defaultTshirt,
  // Animation props
  animationIndex = 0,        // Which animation to play (0 = first, 1 = second, etc.)
  animationStartTime = 0,    // Start from specific time in seconds
  animationSpeed = 1.0,      // Animation speed multiplier (1 = normal, 2 = 2x, 0.5 = half)
  enableAnimation = false,   // Enable animation playback
  loopAnimation = true,      // Should animation loop?
  pauseAnimation = false,    // Pause animation at current time?
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const avatarRef = useRef(null);
  const garmentRef = useRef(null);
  const pantRef = useRef(null);
  const tshirtRef = useRef(null);
  const hairRef = useRef(null);

  // Store original materials for restoring when skin tone is removed
  const originalMaterialsRef = useRef(new Map());

  // Animation refs
  const mixerRef = useRef(null);
  const animationActionRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingHair, setIsLoadingHair] = useState(false);
  const [isLoadingGarment, setIsLoadingGarment] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const isLoading = isLoadingAvatar || isLoadingHair || isLoadingGarment;

  // =====================================================================
  // RESTORE ORIGINAL SKIN COLOR
  // =====================================================================
  const restoreOriginalSkinColor = (root) => {
    if (!root) return;
    
    console.log("Restoring original skin color...");
    let restoredCount = 0;
    
    root.traverse((child) => {
      if ((child.isMesh || child.isSkinnedMesh) && child.material) {
        const originalMaterial = originalMaterialsRef.current.get(child.uuid);
        if (originalMaterial) {
          // Clone the original material to avoid reference issues
          if (Array.isArray(originalMaterial)) {
            child.material = originalMaterial.map(mat => mat.clone());
          } else {
            child.material = originalMaterial.clone();
          }
          
          // Force material update
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.needsUpdate = true);
          } else {
            child.material.needsUpdate = true;
          }
          
          restoredCount++;
        }
      }
    });
    
    console.log(`Restored original materials for ${restoredCount} meshes`);
  };

  // =====================================================================
  // APPLY SKIN TONE TO AVATAR (ignores clothes and eyes)
  // =====================================================================
  const applySkinToneToAvatar = (root, tone) => {
    // Don't apply skin tone if not explicitly provided
    if (!root || !tone) {
      console.log("Skipping skin tone application - using model's original skin color");
      return;
    }
    
    const toneColor = new THREE.Color(tone);
    let appliedCount = 0;
    const allMeshNames = [];
    const updatedMeshes = [];

    root.traverse((child) => {
      // Collect all mesh names for debugging
      if (child.name) {
        allMeshNames.push(child.name);
      }

      // Handle both Mesh and SkinnedMesh
      if ((child.isMesh || child.isSkinnedMesh) && child.material) {
        const name = child.name.toLowerCase();
        const matName = (child.material.name || "").toLowerCase();

        // EXCLUDE EYES - Must be checked first
        const isEye =
          name.includes("eye") ||
          name.includes("eyeball") ||
          name.includes("eyelid") ||
          name.includes("iris") ||
          name.includes("pupil") ||
          name.includes("cornea") ||
          matName.includes("eye") ||
          matName.includes("eyeball") ||
          matName.includes("eyelid");

        // EXCLUDE CLOTHING
        const isCloth =
          name.includes("pant") ||
          name.includes("tshirt") ||
          name.includes("shirt") ||
          name.includes("cloth") ||
          name.includes("garment") ||
          name.includes("dress") ||
          name.includes("top") ||
          name.includes("skirt") ||
          matName.includes("cloth") ||
          matName.includes("garment");

        // DETECT SKIN PARTS (excluding eyes)
        const isSkin =
          (name.includes("skin") ||
          name.includes("body") ||
          name.includes("face") ||
          name.includes("head") ||
          name.includes("neck") ||
          name.includes("arm") ||
          name.includes("hand") ||
          name.includes("leg") ||
          name.includes("foot") ||
          name.includes("torso") ||
          name.includes("chest") ||
          name.startsWith("mesh_0") || // Add detection for mesh_0, mesh_0_1, etc.
          matName.includes("skin") ||
          matName.includes("body") ||
          matName.includes("face")) &&
          !isEye; // Explicitly exclude eyes from skin detection

        // Apply skin tone only to skin parts, excluding eyes and clothing
        if (isSkin && !isCloth && !isEye) {
          // Save original material if not already saved (clone BEFORE any modifications)
          if (!originalMaterialsRef.current.has(child.uuid)) {
            if (Array.isArray(child.material)) {
              originalMaterialsRef.current.set(child.uuid, child.material.map(mat => mat.clone()));
            } else {
              originalMaterialsRef.current.set(child.uuid, child.material.clone());
            }
          }
          
          // Clone the material before modifying (don't modify the original)
          if (Array.isArray(child.material)) {
            child.material = child.material.map(mat => mat.clone());
          } else {
            child.material = child.material.clone();
          }
          
          // Define how strongly to tint towards the selected skin tone
          const tintStrength = 0.6; // 0 = original, 1 = full tone color

          // Handle array materials
          if (Array.isArray(child.material)) {
            const originalMaterial = originalMaterialsRef.current.get(child.uuid);

            child.material.forEach((mat, index) => {
              // Get base color from original material if available
              let baseColor = mat.color.clone();
              if (originalMaterial && Array.isArray(originalMaterial) && originalMaterial[index]) {
                baseColor = originalMaterial[index].color.clone();
              }

              // Blend original color towards target skin tone
              mat.color.copy(baseColor).lerp(toneColor, tintStrength);

              // Gentle emissive to avoid plastic look, keep lighting soft
              mat.emissive.set(
                toneColor.r * 0.03,
                toneColor.g * 0.03,
                toneColor.b * 0.03
              );

              // Ensure material uses its texture + color
              mat.vertexColors = false;
              mat.transparent = false;

              // Force material update
              mat.needsUpdate = true;
              appliedCount++;
              updatedMeshes.push(`${child.name}[${index}]`);
            });
          } else {
            // Single material
            const mat = child.material;
            const originalMaterial = originalMaterialsRef.current.get(child.uuid);

            // Get base color from original material if available
            let baseColor = mat.color.clone();
            if (originalMaterial && !Array.isArray(originalMaterial) && originalMaterial.color) {
              baseColor = originalMaterial.color.clone();
            }
            
            // Blend original color towards target skin tone
            mat.color.copy(baseColor).lerp(toneColor, tintStrength);
            mat.emissive.set(
              toneColor.r * 0.03,
              toneColor.g * 0.03,
              toneColor.b * 0.03
            );
            
            // Ensure material uses its texture + color
            mat.vertexColors = false;
            mat.transparent = false;
            
            // Force material update
            mat.needsUpdate = true;
            appliedCount++;
            updatedMeshes.push(child.name);
          }
        }
      }
    });

    console.log(`Applied skin tone "${tone}" to ${appliedCount} meshes`);
    console.log("Updated meshes:", updatedMeshes);
    console.log("All mesh names in model:", Array.from(new Set(allMeshNames)));
    
    if (appliedCount === 0) {
      console.warn("No skin meshes found. This might mean:");
      console.warn("1. Mesh names don't match detection patterns");
      console.warn("2. All meshes are marked as clothing or eyes");
      console.warn("3. Model structure is different than expected");
      console.warn("4. Check console for mesh names to debug");
    }
  };

  // =====================================================================
  // FIXED POSITION GARMENT PLACEMENT
  // =====================================================================
  const placeGarmentFixed = (garmentObj, type) => {
    if (!garmentObj) return;

    garmentObj.rotation.set(0, 0, 0);
    garmentObj.scale.set(1, 1, 1);

    const yOffset = type === "tshirt" ? 0 : 0;
    garmentObj.position.set(0, yOffset, 0);
  };

  // =====================================================================
  // INITIAL SCENE SETUP
  // =====================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ====================== SCENE SETUP ======================
    const scene = new THREE.Scene();

    // Professional gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#f0f8ff');    // Light blue top
    gradient.addColorStop(0.5, '#ffffff');  // White middle
    gradient.addColorStop(1, '#f5f5f5');    // Light gray bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 256);
    const bgTexture = new THREE.CanvasTexture(canvas);
    scene.background = bgTexture;

    sceneRef.current = scene;

    // ====================== CAMERA SETUP ======================
    const camera = new THREE.PerspectiveCamera(
      35,  // Reduced FOV for less distortion (better for fashion)
      container.clientWidth / 700,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4);  // Slightly lower, pulled back more
    cameraRef.current = camera;

    // ====================== RENDERER SETUP ======================
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));  // Better quality
    renderer.setSize(container.clientWidth, 700);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Softer shadows
    renderer.outputColorSpace = THREE.SRGBColorSpace;  // Correct color space
    renderer.toneMapping = THREE.ACESFilmicToneMapping;  // Cinematic look
    renderer.toneMappingExposure = 1.1;  // Slight exposure boost

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ====================== LIGHTING SETUP ======================
    // 1. Ambient light - soft base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 2. Main key light - primary light source (front-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // 3. Fill light - softer light from opposite side to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0xb0c4de, 0.5);
    fillLight.position.set(-3, 3, -2);
    scene.add(fillLight);

    // 4. Back/rim light - creates depth and separates subject from background
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-2, 4, -4);
    scene.add(rimLight);

    // 5. Bottom/bounce light - simulates light bouncing from ground
    const bounceLight = new THREE.DirectionalLight(0xe6f7ff, 0.3);
    bounceLight.position.set(0, -2, 2);
    scene.add(bounceLight);

    // 6. Hemisphere light for sky/ground color gradient
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.3);
    scene.add(hemiLight);

    // ====================== GROUND PLANE FOR SHADOWS ======================
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.ShadowMaterial({ 
      opacity: 0.3,
      color: 0x000000
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // ====================== ORBIT CONTROLS ======================
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);  // Focus slightly higher on torso
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;  // Prevent zooming too close
    controls.maxDistance = 8;  // Prevent zooming too far
    controls.maxPolarAngle = Math.PI / 2 + 0.3;  // Limit how low you can look
    controls.minPolarAngle = Math.PI / 6;  // Limit how high you can look
    controls.update();

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Update animation mixer if animations are enabled
      if (mixerRef.current && enableAnimation) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / 700;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, 700);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material))
            obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
    };
  }, []);

  // =====================================================================
  // LOAD AVATAR (using modelCache)
  // =====================================================================
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !avatar) return;

    if (avatarRef.current) {
      scene.remove(avatarRef.current);
      avatarRef.current = null;
    }

    // Cleanup animation mixer
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
      animationActionRef.current = null;
    }

    setIsLoadingAvatar(true);
    setLoadingMessage("Loading avatar...");

    // Use modelCache to load avatar (with caching support)
    modelCache.getModel(avatar)
      .then((gltf) => {
        const model = gltf.scene;
        
        // Clear original materials map for new avatar
        originalMaterialsRef.current.clear();
        
        model.traverse((child) => {
          if (child.isMesh || child.isSkinnedMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Store original material for later restoration
            if (child.material) {
              originalMaterialsRef.current.set(child.uuid, child.material.clone());
            }
          }
        });

        avatarRef.current = model;
        scene.add(model);
        
        // Setup animations if available and enabled
        if (enableAnimation && gltf.animations && gltf.animations.length > 0) {
          console.log(`[Animation] Found ${gltf.animations.length} animations in model`);
          gltf.animations.forEach((anim, idx) => {
            console.log(`[Animation] ${idx}: ${anim.name} (${anim.duration.toFixed(2)}s)`);
          });
          
          // Create animation mixer
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          
          // Get the animation clip
          const clip = gltf.animations[animationIndex];
          if (clip) {
            const action = mixer.clipAction(clip);
            
            // Configure animation
            action.timeScale = animationSpeed;
            action.time = animationStartTime;
            action.paused = pauseAnimation;
            
            // Set loop mode
            if (loopAnimation) {
              action.setLoop(THREE.LoopRepeat, Infinity);
            } else {
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
            }
            
            // Play the animation
            action.play();
            animationActionRef.current = action;
            
            console.log(`[Animation] Playing: ${clip.name}`);
            console.log(`[Animation] Duration: ${clip.duration.toFixed(2)}s`);
            console.log(`[Animation] Start time: ${animationStartTime.toFixed(2)}s`);
            console.log(`[Animation] Speed: ${animationSpeed}x`);
            console.log(`[Animation] Loop: ${loopAnimation}`);
          } else {
            console.warn(`[Animation] Animation index ${animationIndex} not found`);
          }
        } else if (enableAnimation && (!gltf.animations || gltf.animations.length === 0)) {
          console.warn("[Animation] No animations found in model");
        }
        
        // Don't apply skin tone on load - let useEffect handle it only when explicitly set
        // The useEffect on line 885-902 handles skin tone updates properly
        
        setIsLoadingAvatar(false);
      })
      .catch((err) => {
        console.error("Avatar load error:", err);
        setIsLoadingAvatar(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar, enableAnimation, animationIndex, animationStartTime, animationSpeed, loopAnimation, pauseAnimation]);

  // =====================================================================
  // LOAD DEFAULT PANT
  // =====================================================================
  const loadDefaultPant = (path) => {
    if (!path) return;
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing pant if it exists
    if (pantRef.current) {
      scene.remove(pantRef.current);
      pantRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      pantRef.current = null;
    }

    setIsLoadingGarment(true);
    setLoadingMessage("Loading pant...");

    // Use modelCache to load pant
    modelCache.getModel(path)
      .then((gltf) => {
        const pant = gltf.scene;
        pant.name = "pant";
        pant.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) child.material.side = THREE.DoubleSide;
          }
        });

        scene.add(pant);
        pantRef.current = pant;
        placeGarmentFixed(pant, "pant");
        setIsLoadingGarment(false);
      })
      .catch((err) => {
        console.error("Pant load error:", err);
        setIsLoadingGarment(false);
      });
  };

  // =====================================================================
  // LOAD DEFAULT TSHIRT
  // =====================================================================
  const loadDefaultTshirt = (path) => {
    if (!path) return;
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing tshirt if it exists
    if (tshirtRef.current) {
      scene.remove(tshirtRef.current);
      tshirtRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      tshirtRef.current = null;
    }

    setIsLoadingGarment(true);
    setLoadingMessage("Loading t-shirt...");

    // Use modelCache to load tshirt
    modelCache.getModel(path)
      .then((gltf) => {
        const tshirt = gltf.scene;
        tshirt.name = "tshirt";
        tshirt.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) child.material.side = THREE.DoubleSide;
          }
        });

        scene.add(tshirt);
        tshirtRef.current = tshirt;
        placeGarmentFixed(tshirt, "tshirt");
        setIsLoadingGarment(false);
      })
      .catch((err) => {
        console.error("Tshirt load error:", err);
        setIsLoadingGarment(false);
      });
  };

  // Load defaults - conditionally based on garment type
  useEffect(() => {
    // If garment is provided, conditionally load defaults
    if (garment && garmentType) {
      // If garment is topwear, don't load default tshirt (but load pant)
      if (garmentType === 'topwear') {
        if (defaultPant) loadDefaultPant(defaultPant);
        // Remove default tshirt if it exists
        if (tshirtRef.current) {
          const scene = sceneRef.current;
          if (scene) {
            scene.remove(tshirtRef.current);
            tshirtRef.current.traverse((child) => {
              if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                  } else {
                    child.material.dispose();
                  }
                }
              }
            });
            tshirtRef.current = null;
          }
        }
      }
      // If garment is bottomwear, don't load default pant (but load tshirt)
      else if (garmentType === 'bottomwear') {
        if (defaultTshirt) loadDefaultTshirt(defaultTshirt);
        // Remove default pant if it exists
        if (pantRef.current) {
          const scene = sceneRef.current;
          if (scene) {
            scene.remove(pantRef.current);
            pantRef.current.traverse((child) => {
              if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                  } else {
                    child.material.dispose();
                  }
                }
              }
            });
            pantRef.current = null;
          }
        }
      }
      // If garment type is unknown, load both defaults
      else {
        if (defaultPant) loadDefaultPant(defaultPant);
        if (defaultTshirt) loadDefaultTshirt(defaultTshirt);
      }
    } else {
      // If no garment, load both defaults normally
      if (defaultPant) loadDefaultPant(defaultPant);
      if (defaultTshirt) loadDefaultTshirt(defaultTshirt);
    }
  }, [defaultPant, defaultTshirt, garment, garmentType]);

  // =====================================================================
  // LOAD MANUAL GARMENT
  // =====================================================================
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !garment) return;

    if (garmentRef.current) {
      scene.remove(garmentRef.current);
      garmentRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      garmentRef.current = null;
    }

    // Remove default clothes based on garment type
    if (garmentType === 'topwear' && tshirtRef.current) {
      // Remove default tshirt when loading topwear garment
      scene.remove(tshirtRef.current);
      tshirtRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      tshirtRef.current = null;
    } else if (garmentType === 'bottomwear' && pantRef.current) {
      // Remove default pant when loading bottomwear garment
      scene.remove(pantRef.current);
      pantRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      pantRef.current = null;
    }

    setIsLoadingGarment(true);
    setLoadingMessage("Loading garment...");

    // Use modelCache to load garment
    modelCache.getModel(garment)
      .then((gltf) => {
        const g = gltf.scene;
        g.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) child.material.side = THREE.DoubleSide;
          }
        });

        scene.add(g);
        garmentRef.current = g;

        // Determine type from garmentType prop or garment name
        let type = null;
        if (garmentType === 'topwear') {
          type = "tshirt";
        } else if (garmentType === 'bottomwear') {
          type = "pant";
        } else {
          // Fallback to name-based detection
          const lower = g.name.toLowerCase();
          type = lower.includes("pant")
            ? "pant"
            : lower.includes("tshirt") ||
              lower.includes("shirt") ||
              lower.includes("top")
            ? "tshirt"
            : null;
        }

        placeGarmentFixed(g, type);
        setIsLoadingGarment(false);
      })
      .catch((err) => {
        console.error("Garment load error:", err);
        setIsLoadingGarment(false);
      });
  }, [garment, garmentType]);

  // =====================================================================
  // LOAD HAIR
  // =====================================================================
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let isMounted = true; // Track if component is still mounted
    let loaderInstance = null;

    // Always remove existing hair first, even if hairStyle is null
    if (hairRef.current) {
      const oldHair = hairRef.current;
      scene.remove(oldHair);
      
      // Dispose of the hair geometry and materials properly
      oldHair.traverse((child) => {
        if (child.isMesh || child.isSkinnedMesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                if (mat.normalMap) mat.normalMap.dispose();
                if (mat.roughnessMap) mat.roughnessMap.dispose();
                if (mat.metalnessMap) mat.metalnessMap.dispose();
                mat.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              if (child.material.normalMap) child.material.normalMap.dispose();
              if (child.material.roughnessMap) child.material.roughnessMap.dispose();
              if (child.material.metalnessMap) child.material.metalnessMap.dispose();
              child.material.dispose();
            }
          }
        }
      });
      
      // Clear the reference
      hairRef.current = null;
    }

    // If no hairStyle, just return (hair is already removed)
    if (!hairStyle) {
      setIsLoadingHair(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoadingHair(true);
    setLoadingMessage("Loading hair...");

    // Add a small delay to ensure cleanup is complete before loading new hair
    const timeoutId = setTimeout(() => {
      if (!isMounted) return;

      // Use modelCache to load hair
      modelCache.getModel(hairStyle)
        .then((gltf) => {
          // Check if component is still mounted and hairStyle hasn't changed
          if (!isMounted) {
            // Dispose of loaded hair if component unmounted or hairStyle changed
            gltf.scene.traverse((child) => {
              if (child.isMesh || child.isSkinnedMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                  } else {
                    child.material.dispose();
                  }
                }
              }
            });
            return;
          }

          // Double-check: remove any existing hair (in case it was added elsewhere)
          if (hairRef.current && hairRef.current !== gltf.scene) {
            const existingHair = hairRef.current;
            scene.remove(existingHair);
            existingHair.traverse((child) => {
              if (child.isMesh || child.isSkinnedMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => mat.dispose());
                  } else {
                    child.material.dispose();
                  }
                }
              }
            });
            hairRef.current = null;
          }

          const hair = gltf.scene;
          hair.traverse((child) => {
            if (child.isMesh || child.isSkinnedMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          scene.add(hair);
          hairRef.current = hair;
          
          if (isMounted) {
            setIsLoadingHair(false);
          }
        })
        .catch((err) => {
          console.error("Hair load error:", err);
          if (isMounted) {
            setIsLoadingHair(false);
          }
        });
    }, 50); // Small delay to ensure cleanup is complete

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [hairStyle]);

  // =====================================================================
  // HEIGHT SCALING
  // =====================================================================
  useEffect(() => {
    const cm = parseFloat(height);
    if (isNaN(cm)) return;

    const scale = cm / 170;
    avatarRef.current?.scale.set(scale, scale, scale);
    hairRef.current?.scale.set(scale, scale, scale);
    pantRef.current?.scale.set(scale, scale, scale);
    tshirtRef.current?.scale.set(scale, scale, scale);
    garmentRef.current?.scale.set(scale, scale, scale);
  }, [height]);

  // =====================================================================
  // ANIMATION CONTROL UPDATE
  // =====================================================================
  useEffect(() => {
    if (!animationActionRef.current) return;
    
    const action = animationActionRef.current;
    
    // Update animation speed
    action.timeScale = animationSpeed;
    
    // Update pause state
    action.paused = pauseAnimation;
    
    console.log(`[Animation] Updated - Speed: ${animationSpeed}x, Paused: ${pauseAnimation}`);
  }, [animationSpeed, pauseAnimation]);

  // =====================================================================
  // ANIMATION CONTROL - Update animation properties dynamically
  // =====================================================================
  useEffect(() => {
    if (animationActionRef.current) {
      // Update animation speed
      animationActionRef.current.timeScale = animationSpeed;
      
      // Update pause state
      animationActionRef.current.paused = pauseAnimation;
      
      console.log(`[Animation] Updated - Speed: ${animationSpeed}x, Paused: ${pauseAnimation}`);
    }
  }, [animationSpeed, pauseAnimation]);

  // =====================================================================
  // SKIN TONE LIVE UPDATE
  // =====================================================================
  useEffect(() => {
    if (!avatarRef.current) return;
    
    if (skinTone !== null && skinTone !== undefined) {
      // Apply custom skin tone
      console.log("Updating skin tone to:", skinTone);
      
      // Apply immediately
      applySkinToneToAvatar(avatarRef.current, skinTone);
      
      // Apply again after a short delay to ensure it sticks
      const timeoutId = setTimeout(() => {
        if (avatarRef.current && skinTone !== null && skinTone !== undefined) {
          applySkinToneToAvatar(avatarRef.current, skinTone);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Restore original skin color when skinTone is null
      console.log("Skin tone unselected, restoring original color");
      restoreOriginalSkinColor(avatarRef.current);
    }
  }, [skinTone]);

  // =====================================================================
  // RETURN
  // =====================================================================
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "700px",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {isLoading && <LoaderOverlay message={loadingMessage} height="700px" />}
    </div>
  );
};

export default ThreeModel;

