import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/**
 * ModelCacheService - Manages 3D model caching with IndexedDB and in-memory storage
 * Supports progress tracking for downloads
 */
class ModelCacheService {
  constructor() {
    this.memoryCache = new Map(); // In-memory cache for loaded GLTF objects
    this.loadingPromises = new Map(); // Track ongoing loads to prevent duplicates
    this.progressCallbacks = new Map(); // Track download progress
    this.db = null;
    this.dbName = "ModelCacheDB";
    this.dbVersion = 1;
    this.storeName = "models";
    this.dbInitPromise = null; // Track DB initialization promise
    this.isInitializing = false; // Track initialization state
    
    this.initDB();
  }

  /**
   * Initialize IndexedDB with proper error handling
   */
  async initDB() {
    // Return existing initialization promise if already initializing
    if (this.dbInitPromise) {
      return this.dbInitPromise;
    }

    // Return immediately if already initialized
    if (this.db) {
      return Promise.resolve(this.db);
    }

    this.isInitializing = true;

    this.dbInitPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("[ModelCache] IndexedDB initialization failed:", request.error);
        this.dbInitPromise = null;
        this.isInitializing = false;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitializing = false;
        
        // Handle unexpected closes
        this.db.onclose = () => {
          console.warn("[ModelCache] IndexedDB connection closed unexpectedly");
          this.db = null;
          this.dbInitPromise = null;
        };

        // Handle version change from other tabs
        this.db.onversionchange = () => {
          console.warn("[ModelCache] IndexedDB version change detected");
          this.db.close();
          this.db = null;
          this.dbInitPromise = null;
        };

        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onblocked = () => {
        console.warn("[ModelCache] IndexedDB upgrade blocked by other connections");
      };
    });

    return this.dbInitPromise;
  }

  /**
   * Ensure database is ready before performing operations
   */
  async ensureDB() {
    if (this.db && !this.db.close) {
      // DB exists but might be closing - reinitialize
      this.db = null;
      this.dbInitPromise = null;
    }

    if (!this.db || this.isInitializing) {
      await this.initDB();
    }

    return this.db;
  }

  /**
   * Get model from cache or load it
   * @param {string} url - URL of the model to load
   * @param {function} onProgress - Optional progress callback (progress) => {}
   * @returns {Promise<Object>} GLTF object
   */
  async getModel(url, onProgress = null) {
    // Check memory cache first (fastest)
    if (this.memoryCache.has(url)) {
      console.log(`[ModelCache] Using memory cache for: ${url}`);
      if (onProgress) onProgress({ loaded: 100, total: 100, percentage: 100 });
      return this.cloneGLTF(this.memoryCache.get(url));
    }

    // Check if already loading (prevent duplicate loads)
    if (this.loadingPromises.has(url)) {
      console.log(`[ModelCache] Waiting for ongoing load: ${url}`);
      return this.loadingPromises.get(url);
    }

    // Start loading
    const loadPromise = this.loadModelWithProgress(url, onProgress);
    this.loadingPromises.set(url, loadPromise);

    try {
      const gltf = await loadPromise;
      this.loadingPromises.delete(url);
      return gltf;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  /**
   * Load model with progress tracking
   */
  async loadModelWithProgress(url, onProgress) {
    // Try to load from IndexedDB first
    try {
      const cachedBlob = await this.getFromIndexedDB(url);
      
      if (cachedBlob) {
        console.log(`[ModelCache] Loading from IndexedDB: ${url}`);
        if (onProgress) onProgress({ loaded: 100, total: 100, percentage: 100 });
        return this.loadFromBlob(cachedBlob, url);
      }
    } catch (error) {
      console.warn(`[ModelCache] IndexedDB read failed for ${url}:`, error);
      // Continue to fetch from URL
    }

    // Not in cache, fetch from URL
    console.log(`[ModelCache] Fetching from URL: ${url}`);
    return this.fetchAndCacheWithProgress(url, onProgress);
  }

  /**
   * Fetch model from URL and cache it with progress tracking
   */
  async fetchAndCacheWithProgress(url, onProgress) {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    // Fetch with progress tracking
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    // Read stream with progress updates
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total) {
        const percentage = Math.round((loaded / total) * 100);
        onProgress({ loaded, total, percentage });
      }
    }

    // Combine chunks into blob
    const blob = new Blob(chunks);
    
    // Cache the blob in IndexedDB
    this.saveToIndexedDB(url, blob).catch((err) => {
      console.warn("[ModelCache] Failed to cache in IndexedDB:", err);
    });

    // Load GLTF from blob
    const blobUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
      loader.load(
        blobUrl,
        (gltf) => {
          URL.revokeObjectURL(blobUrl);
          
          // Cache in memory
          this.memoryCache.set(url, gltf);
          
          if (onProgress) onProgress({ loaded: total, total, percentage: 100 });
          resolve(this.cloneGLTF(gltf));
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(blobUrl);
          reject(error);
        }
      );
    });
  }

  /**
   * Load GLTF from blob
   */
  async loadFromBlob(blob, originalUrl) {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(blob);
      loader.load(
        blobUrl,
        (gltf) => {
          URL.revokeObjectURL(blobUrl);
          
          // Cache in memory
          this.memoryCache.set(originalUrl, gltf);
          
          resolve(this.cloneGLTF(gltf));
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(blobUrl);
          reject(error);
        }
      );
    });
  }

  /**
   * Clone GLTF scene (required because Three.js objects can't be reused directly)
   */
  cloneGLTF(gltf) {
    const cloned = {
      scene: gltf.scene.clone(true), // Deep clone
      scenes: gltf.scenes.map((s) => s.clone(true)),
      animations: gltf.animations.map((a) => a.clone()),
      asset: gltf.asset,
      cameras: gltf.cameras.map((c) => c.clone()),
      parser: gltf.parser,
      userData: gltf.userData,
    };
    return cloned;
  }

  /**
   * Save blob to IndexedDB with proper connection handling
   */
  async saveToIndexedDB(url, blob) {
    try {
      await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction([this.storeName], "readwrite");
          const store = transaction.objectStore(this.storeName);
          const request = store.put(blob, url);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
          
          transaction.onerror = () => reject(transaction.error);
          transaction.onabort = () => reject(new Error("Transaction aborted"));
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error("[ModelCache] Failed to save to IndexedDB:", error);
      throw error;
    }
  }

  /**
   * Get blob from IndexedDB with proper connection handling
   */
  async getFromIndexedDB(url) {
    try {
      await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db.transaction([this.storeName], "readonly");
          const store = transaction.objectStore(this.storeName);
          const request = store.get(url);

          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
          
          transaction.onerror = () => reject(transaction.error);
          transaction.onabort = () => reject(new Error("Transaction aborted"));
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error("[ModelCache] Failed to read from IndexedDB:", error);
      return null; // Gracefully fallback to fetching
    }
  }

  /**
   * Clear cache
   * @param {string} url - Optional URL to clear specific model, or null to clear all
   */
  async clearCache(url = null) {
    if (url) {
      this.memoryCache.delete(url);
      
      try {
        await this.ensureDB();
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.delete(url);
      } catch (error) {
        console.warn("[ModelCache] Failed to clear from IndexedDB:", error);
      }
    } else {
      this.memoryCache.clear();
      
      try {
        await this.ensureDB();
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.clear();
      } catch (error) {
        console.warn("[ModelCache] Failed to clear IndexedDB:", error);
      }
    }
  }

  /**
   * Get cache size (approximate)
   */
  async getCacheSize() {
    try {
      await this.ensureDB();
      
      return new Promise((resolve) => {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const blobs = request.result;
          const totalSize = blobs.reduce((sum, blob) => sum + blob.size, 0);
          resolve(totalSize);
        };
        
        request.onerror = () => resolve(0);
      });
    } catch (error) {
      console.warn("[ModelCache] Failed to get cache size:", error);
      return 0;
    }
  }

  /**
   * Check if model is cached
   */
  isCached(url) {
    return this.memoryCache.has(url);
  }

  /**
   * Get all cached URLs
   */
  async getCachedUrls() {
    try {
      await this.ensureDB();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn("[ModelCache] Failed to get cached URLs:", error);
      return [];
    }
  }
}

// Export singleton instance
export const modelCache = new ModelCacheService();
