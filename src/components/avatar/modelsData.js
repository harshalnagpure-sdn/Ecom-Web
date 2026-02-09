export const modelsData = {
  avatars: {
     female: "https://model-avatar.s3.eu-north-1.amazonaws.com/f_avatart.glb",
    // female : "/images/assets_optimized/makehuman.glb"
    //female : "../public/image/f_avatart.glb"
  },
};
 

// =========================
// Avatar Customization Options
// =========================
 
export const skinTones = {
  medium: "#D9A38F",
  tan: "#D99058",
  bronze: "#C67843",
  brown: "#A5653A",
};
 
// =========================
// Hair Styles Configuration
// =========================
 
export const hairStyles = {
  female: {
    default: {
      name: "Straight",
      modelPath: "https://res.cloudinary.com/ddoipg6b8/image/upload/v1764930136/3d_models/fhair.glb",
      //modelPath: "/images/assets_optimized/fhair3.glb",
    },
    hair1: {
      name: "Ponytail",
      modelPath:
        "https://res.cloudinary.com/ddoipg6b8/image/upload/v1764930352/3d_models/fhair1.glb",
    },
    hair2: {
      name: "Long Hair",
      // modelPath:
      //   "https://res.cloudinary.com/ddoipg6b8/raw/upload/v1764074633/fashion_3d_models/fhair7.glb",
      modelPath: "https://res.cloudinary.com/ddoipg6b8/image/upload/v1764930381/3d_models/fhair2.glb",
    },
 
    hair3: {
      name: "Curly",
      // modelPath:
      //   "https://res.cloudinary.com/ddoipg6b8/raw/upload/v1764074633/fashion_3d_models/fhair7.glb",
      modelPath: "https://res.cloudinary.com/ddoipg6b8/image/upload/v1764930459/3d_models/fhair3.glb",
    },
 
 
    // hair5: {
    //   name: "Curly Long Hair 5",
    //   // modelPath:
    //   //   "https://res.cloudinary.com/ddoipg6b8/raw/upload/v1764074633/fashion_3d_models/fhair7.glb",
    //   modelPath: "/images/assets_optimized/fhair2.glb",
    // },
 
 
  },
};
 
// =========================
// Height Configuration
// =========================
 
export const heightRange = {
  min: 150,
  max: 190,
  default: 170,
};
 
// =========================
// Avatar Customization Storage
// =========================
 
export const getAvatarCustomization = () => {
  const saved = localStorage.getItem("avatarCustomization");
  if (!saved)
    return {
      skinTone: null, // Don't apply skin tone by default - use model's original color
      height: heightRange.default,
      hairStyle: "default",
    };
  return JSON.parse(saved);
};
 
export const saveAvatarCustomization = (customization) => {
  localStorage.setItem("avatarCustomization", JSON.stringify(customization));
  getAvatarCustomization();
};
 
// =========================
// Product Catalog (Using Cloudinary GLB Paths)
// =========================
 
export const products = {
  // 👚 Female Garments
  f_tshirt: {
    name: "Elegant Crop Top",
    price: "₹1,990",
    desc: "A chic 3D-rendered crop top for a bold and confident look.",
    gender: "female",
    type: "tshirt",
    modelKey: "f_tshirt",
    modelPath:
      "https://res.cloudinary.com/ddoipg6b8/raw/upload/v1764075574/fashion_3d_models/Full_Sleeves.glb",
    sku: "F-TSHIRT-001",
    colors: ["#FFC0CB", "#FFFFFF", "#800080"],
    sizes: ["XS", "S", "M", "L"],
    quantity: 35,
  },
 
  f_pant: {
    name: "High Waist Trousers",
    price: "₹2,690",
    desc: "Comfortable and stylish 3D pants.",
    gender: "female",
    type: "pant",
    modelKey: "f_pant",
     modelPath:
       "https://res.cloudinary.com/ddoipg6b8/image/upload/v1764930496/3d_models/Flared_Pants_Unzip.glb",
    // modelPath: "/images/assets_optimized/Flared Pants Unzip.glb",
    sku: "F-PANT-001",
    colors: ["#000000", "#808080", "#8B0000"],
    sizes: ["28", "30", "32", "34"],
    quantity: 22,
  },
};

