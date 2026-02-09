/**
 * Utility functions for handling environment variables
 * 
 * Handles cases where env vars might be incorrectly formatted with quotes or semicolons:
 * - VITE_VAR="value"; (incorrect)
 * - VITE_VAR=value (correct)
 */

/**
 * Cleans an environment variable value by removing quotes and semicolons
 * @param {string} value - The raw environment variable value
 * @returns {string} - The cleaned value
 */
export const cleanEnvVar = (value) => {
  if (!value) return '';
  
  return value
    .toString()
    .trim()
    .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
    .replace(/;$/, ''); // Remove trailing semicolon
};

/**
 * Gets a cleaned gender value from environment variable
 * @param {string} defaultValue - Default value if env var is not set (default: "female")
 * @returns {string} - Either "male" or "female"
 */
export const getDefaultGender = (defaultValue = "female") => {
  const raw = cleanEnvVar(
    import.meta.env.VITE_DEFAULT_AVATAR_GENDER_KEY || defaultValue
  ).toLowerCase();
  
  return raw === "male" ? "male" : "female";
};
