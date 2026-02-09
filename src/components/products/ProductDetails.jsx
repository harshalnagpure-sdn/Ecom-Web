import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import tryon from "../../assets/images/ui/ic_try_on_now_blk.svg";
import btncart from "../../assets/images/ui/cart.svg";
import like from "../../assets/images/ui/like.svg";
import ColorPicker from "./ColorPicker";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../store/slices/productsSlice";
import { addToCart } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../../store/slices/wishlistSlice";
import { Link } from "react-router-dom";
import productDetailImg from "../../assets/images/ui/productDetail.png";
import ThreeModel from "../avatar/ThreeModel";
import { avatarService } from "../../api/services/avatarService";

const ProductDetails = ({ productId }) => {
  console.log("Harshal 19");
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  // Color states - we maintain both label and hex value:
  // - selectedColor: Color label (e.g., "Blue", "Red") - used for variant matching
  // - selectedColorValue: Color hex (e.g., "#0000FF", "#FF0000") - used for display/reference
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorValue, setSelectedColorValue] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  const [modify, setModify] = useState(false);

  const [openTop, setOpenTop] = useState(true);
  const [openBottom, setOpenBottom] = useState(false);
  const [openDress, setOpenDress] = useState(false);
  const [openBlazer, setOpenBlazer] = useState(false);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isSizeGuideModalOpen, setIsSizeGuideModalOpen] = useState(false);

  // Accordion states for product details sections
  const [accordionStates, setAccordionStates] = useState({
    description: true,
    sizeAndFit: false,
    materialAndCare: false,
    keyFeatures: false,
    howToStyle: false,
  });

  //  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  useEffect(() => {
    if (
      productFetchId &&
      productFetchId !== "undefined" &&
      productFetchId !== "null"
    ) {
      // Reset local state when product ID changes
      setMainImage(null);
      setSelectedSize("");
      setSelectedColor("");
      setSelectedColorValue("");
      setQuantity(1);
      
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // Fetch wishlist when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Check if current product is in wishlist
  const isInWishlist = () => {
    if (!wishlist?.items || !productFetchId) return false;
    // Convert to number for consistent comparison
    const numProductId = Number(productFetchId);
    return wishlist.items.some(
      (item) => Number(item.product_id) === numProductId
    );
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isTryOnModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTryOnModalOpen]);

  // Handle escape key press to close modal
  useEffect(() => {
    if (!isTryOnModalOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsTryOnModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isTryOnModalOpen]);

  // Handle escape key press to close size guide modal
  useEffect(() => {
    if (!isSizeGuideModalOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSizeGuideModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSizeGuideModalOpen]);

  // Fetch user's avatar when modal opens
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!isTryOnModalOpen || !user) return;
      
      try {
        setAvatarLoading(true);
        const avatarData = await avatarService.getUserAvatar();
        const avatar = avatarData.avatar || avatarData;
        setUserAvatar(avatar);
      } catch (err) {
        // Avatar not found is okay - user might not have created one yet
        if (err?.response?.status !== 404) {
          console.error("Error fetching user avatar:", err);
        }
        setUserAvatar(null);
      } finally {
        setAvatarLoading(false);
      }
    };

    fetchUserAvatar();
  }, [isTryOnModalOpen, user]);

  useEffect(() => {
    // Only set images if the selectedProduct matches the current productFetchId
    // This prevents showing images from a previously viewed product
    const productIdMatches = 
      selectedProduct?.id?.toString() === productFetchId?.toString() ||
      selectedProduct?._id?.toString() === productFetchId?.toString();
    
    if (productIdMatches && selectedProduct?.images?.length > 0) {
      const primaryImage =
        selectedProduct.images[0]?.image_url ||
        selectedProduct.images[0]?.url ||
        null;
      setMainImage(primaryImage);
    } else {
      // Clear images if product doesn't match or no images available
      setMainImage(null);
    }

    // Set default color if available and not already set
    // Only set color if product ID matches to avoid stale color selection
    if (productIdMatches && selectedProduct && !selectedColor) {
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        const firstColor = selectedProduct.variants[0]?.color_option_data;
        if (firstColor) {
          // Set both label and hex value
          setSelectedColor(firstColor.label || firstColor.name);
          setSelectedColorValue(firstColor.hex_value || firstColor.code);
        }
      } else if (selectedProduct.colors && selectedProduct.colors.length > 0) {
        const firstColor =
          typeof selectedProduct.colors[0] === "string"
            ? selectedProduct.colors[0]
            : selectedProduct.colors[0]?.name ||
              selectedProduct.colors[0]?.label;
        if (firstColor) {
          setSelectedColor(firstColor);
          // If it's a string, we don't have hex value
          if (typeof selectedProduct.colors[0] !== "string") {
            setSelectedColorValue(
              selectedProduct.colors[0]?.hex_value ||
                selectedProduct.colors[0]?.code ||
                ""
            );
          }
        }
      }
    } else if (!productIdMatches) {
      // Reset color selection when product changes
      setSelectedColor("");
      setSelectedColorValue("");
      setSelectedSize("");
    }
  }, [selectedProduct, productFetchId, selectedColor]);

  // Calculate max available based on selected variant
  const getMaxAvailable = () => {
    if (!selectedProduct?.variants || !selectedSize || !selectedColor) {
      return (
        selectedProduct?.count_in_stock ?? selectedProduct?.countInStock ?? 0
      );
    }

    const variant = selectedProduct.variants.find(
      (v) =>
        v.size_option_data?.code === selectedSize &&
        v.color_option_data?.label === selectedColor
    );

    return variant?.quantity ?? 0;
  };

  const maxAvailable = getMaxAvailable();

  const handleQuantityCange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => {
        const next = prev + 1;
        if (maxAvailable > 0 && next > maxAvailable) {
          return prev;
        }
        return next;
      });
    }
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const toggleAccordion = (section) => {
    setAccordionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = () => {
    if (!selectedSize && !selectedColor) {
      toast.error("Please select a size and color", {
        duration: 1500,
        icon: "⚠️",
        style: {
          backgroundColor: "#FBBF24",
          color: "#1F2937",
        },
      });
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size", {
        duration: 1500,
        icon: "⚠️",
        style: {
          backgroundColor: "#FBBF24",
          color: "#1F2937",
        },
      });
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color", {
        duration: 1500,
        icon: "⚠️",
        style: {
          backgroundColor: "#FBBF24",
          color: "#1F2937",
        },
      });
      return;
    }

    if (maxAvailable <= 0) {
      toast.error("This item is currently out of stock.", { duration: 1500 });
      return;
    }

    if (quantity > maxAvailable) {
      toast.error(`Only ${maxAvailable} item(s) available.`, {
        duration: 1500,
      });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor, // Send label for backend
        colorValue: selectedColorValue, // Send hex value for reference
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to the cart!", {
          duration: 1200,
          style: {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
          },
        });
      })
      .catch((err) => {
        const message = err?.message || "Unable to add this product right now.";
        toast.error(message, { duration: 1500 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist", {
        duration: 2000,
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    const inWishlist = isInWishlist();

    try {
      // Ensure productId is a number
      const numProductId = Number(productFetchId);
      if (inWishlist) {
        await dispatch(removeFromWishlist(numProductId)).unwrap();
        toast.success("Removed from wishlist", {
          duration: 1500,
          style: {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
          },
        });
      } else {
        await dispatch(addToWishlist(numProductId)).unwrap();
        toast.success("Added to wishlist", {
          duration: 1500,
          style: {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      // Handle different error formats from Redux Toolkit unwrap()
      const message =
        error?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        (typeof error === "string" ? error : "Failed to update wishlist");
      toast.error(message, { duration: 1500 });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  
  // Only render product if it matches the current productFetchId to prevent showing stale data
  const productIdMatches = 
    selectedProduct?.id?.toString() === productFetchId?.toString() ||
    selectedProduct?._id?.toString() === productFetchId?.toString();
  
  return (
    <div className="p-6">
      {selectedProduct && productIdMatches && (
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* left thumnails */}
            {/* <div className="md:flex flex-col space-y-4 mr-6"> */}
            <div className="hidden flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => {
                const imageUrl = image?.image_url || image?.url;
                if (!imageUrl) {
                  return null;
                }
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={
                      image.alt_text || image.altText || `Thumbnail ${index}`
                    }
                    loading="lazy"
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === imageUrl
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(imageUrl)}
                  />
                );
              })}
            </div>
            {/* main image */}
            <div className="md:w-1/2 hidden">
              <div className="mb-4">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="Main product"
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              {/* mobile thumbnail */}
              <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                {selectedProduct.images?.map((image, index) => {
                  const imageUrl = image?.image_url || image?.url;
                  if (!imageUrl) {
                    return null;
                  }
                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={
                        image.alt_text || image.altText || `Thumbnail ${index}`
                      }
                      loading="lazy"
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                        mainImage === imageUrl
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      onClick={() => setMainImage(imageUrl)}
                    />
                  );
                })}
              </div>
            </div>

            {/* left section - Product Images */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  selectedProduct.images.map((image, index) => {
                    const imageUrl = image?.image_url || image?.url;
                    if (!imageUrl) return null;
                    return (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={
                          image.alt_text ||
                          image.altText ||
                          `Product image ${index + 1}`
                        }
                        className="w-full h-auto rounded-lg cursor-pointer"
                        onClick={() => setMainImage(imageUrl)}
                        loading="lazy"
                      />
                    );
                  })
                ) : (
                  <>
                    <img
                      src={productDetailImg}
                      className="w-full h-auto rounded-lg"
                      alt="Product"
                    />
                    <img
                      src={productDetailImg}
                      className="w-full h-auto rounded-lg"
                      alt="Product"
                    />
                    <img
                      src={productDetailImg}
                      className="w-full h-auto rounded-lg"
                      alt="Product"
                    />
                    <img
                      src={productDetailImg}
                      className="w-full h-auto rounded-lg"
                      alt="Product"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Right section */}
            <div className="md:w-1/2 md:ml-10">
              <p className="font-normal text-[14px] leading-[22px] text-[#515152]">
                {selectedProduct.category_data?.name ||
                  selectedProduct.category ||
                  "Product"}
              </p>
              <h1 className="md:text-3xl  mb-2 text-[#2A2A2A] font-normal text-[34px]">
                {selectedProduct.name}
              </h1>
              <p className="font-normal text-[14px] text-[#515152]">
                {selectedProduct.num_reviews || 0} Reviews
              </p>
              <div className="flex justify-start items-baseline gap-2">
                <p className="text-normal text-[#2A2A2A] mb-2 text-[20px]">
                  ${selectedProduct.price}
                </p>
              </div>

              {/* Divider */}
              <div className="my-6 w-full border-t border-gray-200 border-dashed"></div>

              <div className="mb-4">
                <p className="text-normal text[18px] text-[#2A2A2A]">Color:</p>

                <div className="mt-2">
                  <ColorPicker
                    colors={
                      selectedProduct.variants
                        ? Array.from(
                            new Map(
                              selectedProduct.variants
                                .map((v) => v.color_option_data)
                                .filter((c) => c)
                                .map((c) => [c.id, c])
                            ).values()
                          )
                        : selectedProduct.colors?.map((color) => {
                            // If colors is an array of strings, convert to objects
                            if (typeof color === "string") {
                              return { name: color, code: "#000000" };
                            }
                            return color;
                          }) || []
                    }
                    selectedColor={selectedColorValue}
                    onColorChange={(colorName, colorValue) => {
                      // Update both states: label for variant matching, hex for display
                      setSelectedColor(colorName);
                      setSelectedColorValue(colorValue);

                      // Reset size when color changes if current size is not available for new color
                      if (selectedSize) {
                        const hasSizeForColor = selectedProduct.variants?.some(
                          (v) =>
                            v.size_option_data?.code === selectedSize &&
                            v.color_option_data?.label === colorName &&
                            v.quantity > 0
                        );
                        if (!hasSizeForColor) {
                          setSelectedSize("");
                        }
                      }
                    }}
                  />
                </div>
                {maxAvailable > 0 && selectedSize && selectedColor && (
                  <p className="mt-2 text-sm text-green-600">
                    {maxAvailable} item(s) available in stock for this variant.
                  </p>
                )}
                {maxAvailable === 0 && selectedSize && selectedColor && (
                  <p className="mt-2 text-sm text-red-600">
                    This variant is currently out of stock.
                  </p>
                )}
              </div>
              {/* my code start  */}
              {/* Size */}
              <div className="mb-6">
                <div className="flex items-baseline justify-start gap-2 mb-4">
                  <p className="text-gray-900 font-medium">Size</p>
                  <button 
                    onClick={() => setIsSizeGuideModalOpen(true)}
                    className="text-[#222222] text-sm font-medium underline hover:text-[#000000] transition-colors"
                  >
                    View Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.variants
                    ? Array.from(
                        new Map(
                          selectedProduct.variants
                            .map((v) => v.size_option_data)
                            .filter((s) => s)
                            .map((s) => [s.id, s])
                        ).values()
                      )
                        .sort((a, b) => {
                          // Sort sizes: XS, S, M, L, XL, etc.
                          const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
                          const aIndex = sizeOrder.indexOf(a.code);
                          const bIndex = sizeOrder.indexOf(b.code);
                          if (aIndex !== -1 && bIndex !== -1)
                            return aIndex - bIndex;
                          if (aIndex !== -1) return -1;
                          if (bIndex !== -1) return 1;
                          return a.code.localeCompare(b.code);
                        })
                        .map((size) => {
                          // Check if this size has available variants for selected color
                          const hasAvailableVariant = selectedColor
                            ? selectedProduct.variants.some(
                                (v) =>
                                  v.size_option_data?.id === size.id &&
                                  v.color_option_data?.label ===
                                    selectedColor &&
                                  v.quantity > 0
                              )
                            : selectedProduct.variants.some(
                                (v) =>
                                  v.size_option_data?.id === size.id &&
                                  v.quantity > 0
                              );

                          return (
                            <button
                              key={size.id}
                              onClick={() => setSelectedSize(size.code)}
                              disabled={!hasAvailableVariant}
                              className={`px-4 py-2 rounded border text-sm font-medium transition ${
                                selectedSize === size.code
                                  ? "bg-black text-white border-black"
                                  : hasAvailableVariant
                                  ? "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              }`}
                            >
                              {size.code}
                            </button>
                          );
                        })
                    : selectedProduct.sizes?.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded border text-sm font-medium transition ${
                            selectedSize === size
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                          }`}
                        >
                          {size}
                        </button>
                      )) || []}
                </div>
              </div>

              <div className="flex items-center gap-[12px] mb-[24px]">
                <button 
                  onClick={() => setIsTryOnModalOpen(true)}
                  className="flex items-center gap-2 px-[10px] py-2 rounded-full border border-gray-700 text-gray-700 font-medium bg-white hover:bg-gray-100 transition shadow-sm"
                >
                  <span className="text-lg">
                    <img src={tryon} alt="" />
                  </span>{" "}
                  Virtual Try-on!
                </button>

                {/* <button
                  onClick={() => setModify(!modify)}
                  className="flex items-center gap-[12px] px-[10px] py-2 rounded-full border border-[#2A3444] cursor-pointer transition-all duration-300 bg-white shadow-sm"
                >
                  <div
                    className={`
                      w-12 h-6 rounded-full flex items-center transition-all duration-300
                      ${
                        modify
                          ? "bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] justify-end"
                          : "bg-[#F3F3F3] justify-start"
                      }
                    `}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-md mx-0.5 transition-all duration-300"></div>
                  </div>

                  <span className="text-[#2A3444] font-medium text-[16px]">
                    Modify
                  </span>
                </button> */}

                <button
                  onClick={handleAddToCart}
                  disabled={
                    isButtonDisabled ||
                    maxAvailable <= 0
                  }
                  className={`flex items-center gap-2 px-[10px] py-2 rounded-full bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] text-white font-medium shadow-md hover:opacity-90 transition ${
                    isButtonDisabled ||
                    maxAvailable <= 0 ||
                    !selectedSize ||
                    !selectedColor
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="text-lg">
                    <img src={btncart} alt="" />
                  </span>
                  {isButtonDisabled ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    isInWishlist()
                      ? "text-red-500 hover:bg-red-50 border-red-200"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title={
                    isInWishlist() ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isInWishlist() ? "#EF4444" : "none"}
                    stroke={isInWishlist() ? "#EF4444" : "#374151"}
                    strokeWidth={2}
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </button>
              </div>

              {/* Modular Options */}
              {modify && (
                <div className="flex flex-col mb-[24px]">
                  <p className="font-normal text-[18px] text-[#2A2A2A] mb-[12px]">
                    Modular options
                  </p>

                  {/* TOP */}
                  <div className="flex flex-col w-full border border-b-[#E5E7EB] rounded-t-xl  bg-[#F9FAFB] border-x-0 border-t-[#F9FAFB]">
                    <button
                      onClick={() => setOpenTop(!openTop)}
                      className="flex items-top justify-between px-[16px] py-[6px] cursor-pointer"
                    >
                      <p className="flex flex-col items-start justify-between">
                        <span className="font-normal text-[16px] text-[#374151]">
                          Top
                        </span>
                        <span className="font-normal text-[14px] text-[#C98A5C]">
                          Long Sleeve
                        </span>
                      </p>

                      <svg
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                          openTop ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openTop && (
                      <div className="bg-[#ffffff] rounded-b-xl  p-4 flex flex-col gap-2 text-sm border-x-[2px] border-[#F9FAFB]">
                        <button className="text-[#C98A5C] font-medium text-left">
                          Long Sleeve
                        </button>
                        <button className="text-[#374151] text-left">
                          Long Sleep
                        </button>
                        <button className="text-[#374151] text-left">
                          3/4 Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Short Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Detach Sleeves Completely
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM */}
                  <div className="flex flex-col w-full border border-[#E5E7EB] border-x-0 border-t-0 bg-[#F9FAFB] border-t-[#F9FAFB] ">
                    <button
                      onClick={() => setOpenBottom(!openBottom)}
                      className="flex items-center justify-between px-[16px] py-[6px] cursor-pointer"
                    >
                      <p className="flex flex-col items-start justify-between">
                        <span className="font-normal text-[16px] text-[#374151]">
                          Bottom
                        </span>
                        <span className="font-normal text-[14px] text-[#C98A5C]">
                          Close Zippers for fitted tapered look
                        </span>
                      </p>
                      <svg
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                          openBottom ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openBottom && (
                      <div className="bg-[#ffffff]  rounded-b-xl p-4 flex flex-col gap-2 text-sm border-x-[2px] border-[#F9FAFB]">
                        <button className="text-[#C98A5C] font-medium  text-left">
                          Close Zippers for fitted tapered look
                        </button>
                        <button className="text-[#374151] text-left">
                          Long Sleep
                        </button>
                        <button className="text-[#374151] text-left">
                          3/4 Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Short Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Detach Sleeves Completely
                        </button>
                      </div>
                    )}
                  </div>

                  {/* DRESS */}
                  <div className="flex flex-col w-full border border-[#E5E7EB]   border-x-0 border-t-0 bg-[#F9FAFB] border-t-[#F9FAFB]">
                    <button
                      onClick={() => setOpenDress(!openDress)}
                      className="flex items-center justify-between px-[16px] py-[6px] cursor-pointer"
                    >
                      <p className="flex flex-col items-start justify-between">
                        <span className="font-normal text-[16px] text-[#374151]">
                          Dress
                        </span>
                        <span className="font-normal text-[14px] text-[#C98A5C]">
                          Wear Corset Only
                        </span>
                      </p>
                      <svg
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                          openDress ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openDress && (
                      <div className="bg-[#ffffff]  rounded-b-xl p-4 flex flex-col gap-2 text-sm border-x-[2px] border-[#F9FAFB]">
                        <button className="text-[#C98A5C] font-medium  text-left">
                          Wear Corset Only
                        </button>
                        <button className="text-[#374151] text-left">
                          Long Sleep
                        </button>
                        <button className="text-[#374151] text-left">
                          3/4 Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Short Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Detach Sleeves Completely
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BLAZER */}
                  <div className="flex flex-col w-full border border-[#E5E7EB] rounded-b-xl  border-x-0 border-t-0 bg-[#F9FAFB] border-t-[#F9FAFB]">
                    <button
                      onClick={() => setOpenBlazer(!openBlazer)}
                      className="flex items-center justify-between px-[16px] py-[6px] cursor-pointer"
                    >
                      <p className="flex flex-col items-start justify-between">
                        <span className="font-normal text-[16px] text-[#374151]">
                          Blazer type
                        </span>
                        <span className="font-normal text-[14px] text-[#C98A5C]">
                          Flip to Inner Fabric for reversible look
                        </span>
                      </p>
                      <svg
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                          openBlazer ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openBlazer && (
                      <div className="bg-[#ffffff]   p-4 flex flex-col gap-2 text-sm rounded-b-xl border-x-[2px] border-[#F9FAFB]">
                        <button className="text-[#C98A5C] font-medium text-left">
                          Flip to Inner Fabric for reversible look
                        </button>
                        <button className="text-[#374151] text-left">
                          Long Sleep
                        </button>
                        <button className="text-[#374151] text-left">
                          3/4 Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Short Sleeves
                        </button>
                        <button className="text-[#374151] text-left">
                          Detach Sleeves Completely
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product Details Accordion */}
              <div className="mt-6 space-y-0">
                {/* Product Description Accordion */}
                <div className="border border-[#E5E7EB] rounded-t-lg overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('description')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F9FAFB] transition-colors"
                  >
                    <h3 className="text-[18px] font-medium text-[#2A2A2A]">
                      Product Description
                    </h3>
                    <svg
                      className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${
                        accordionStates.description ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {accordionStates.description && (
                    <div className="px-4 pb-4 bg-white border-t border-[#E5E7EB]">
                      <p className="text-[#999DA2] text-sm leading-relaxed text-[16px] pt-3">
                        {selectedProduct.description || "No description available."}
                      </p>
                      {selectedProduct.material && (
                        <p className="text-[#999DA2] text-sm leading-relaxed mt-2">
                          Material: {selectedProduct.material}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                  {/* Size & Fit Accordion */}
                {(() => {
                  try {
                    let sizeAndFit = selectedProduct.size_and_fit || selectedProduct.sizeAndFit;
                    
                    if (typeof sizeAndFit === 'string') {
                      sizeAndFit = JSON.parse(sizeAndFit);
                    }
                    
                    if (sizeAndFit && typeof sizeAndFit === 'object' && Object.keys(sizeAndFit).length > 0) {
                      const {
                        fit,
                        rise,
                        length,
                        stretch,
                        adjustability,
                        true_to_size,
                        trueToSize,
                        shoulders,
                        model_info,
                        modelInfo
                      } = sizeAndFit;
                      
                      const trueToSizeValue = true_to_size ?? trueToSize;
                      const modelInfoValue = model_info ?? modelInfo;
                      
                      // Only render if at least one field has a value
                      const hasData = fit || rise || length || stretch || adjustability || 
                                     trueToSizeValue || shoulders || modelInfoValue;
                      
                      if (hasData) {
                        return (
                          <div className="border border-[#E5E7EB] border-t-0 rounded-b-lg overflow-hidden">
                            <button
                              onClick={() => toggleAccordion('sizeAndFit')}
                              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F9FAFB] transition-colors"
                            >
                              <h3 className="text-[18px] font-medium text-[#2A2A2A]">
                                Size &amp; Fit
                              </h3>
                              <svg
                                className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${
                                  accordionStates.sizeAndFit ? "rotate-180" : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            {accordionStates.sizeAndFit && (
                              <div className="px-4 pb-4 bg-white border-t border-[#E5E7EB]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3">
                                  {fit && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Fit</dt>
                                      <dd className="text-sm text-[#6B7280]">{fit}</dd>
                                    </div>
                                  )}
                                  {rise && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Rise</dt>
                                      <dd className="text-sm text-[#6B7280]">{rise}</dd>
                                    </div>
                                  )}
                                  {length && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Length</dt>
                                      <dd className="text-sm text-[#6B7280]">{length}</dd>
                                    </div>
                                  )}
                                  {stretch && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Stretch</dt>
                                      <dd className="text-sm text-[#6B7280]">{stretch}</dd>
                                    </div>
                                  )}
                                  {adjustability && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Adjustability</dt>
                                      <dd className="text-sm text-[#6B7280]">{adjustability}</dd>
                                    </div>
                                  )}
                                  {trueToSizeValue && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">True to Size</dt>
                                      <dd className="text-sm text-[#6B7280]">{trueToSizeValue}</dd>
                                    </div>
                                  )}
                                  {shoulders && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Shoulders</dt>
                                      <dd className="text-sm text-[#6B7280]">{shoulders}</dd>
                                    </div>
                                  )}
                                  {modelInfoValue && (
                                    <div className="sm:col-span-2">
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Model Information</dt>
                                      <dd className="text-sm text-[#6B7280]">{modelInfoValue}</dd>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing size_and_fit:', e);
                  }
                  return null;
                })()}

                {/* Material & Care Accordion */}
                {(() => {
                  try {
                    let materialAndCare = selectedProduct.material_and_care || selectedProduct.materialAndCare;
                    
                    if (typeof materialAndCare === 'string') {
                      materialAndCare = JSON.parse(materialAndCare);
                    }
                    
                    if (materialAndCare && typeof materialAndCare === 'object' && Object.keys(materialAndCare).length > 0) {
                      const {
                        fabric_composition,
                        lining,
                        care_instructions,
                        trims,
                        sustainability
                      } = materialAndCare;
                      
                      // Only render if at least one field has a value
                      const hasData = fabric_composition || lining || care_instructions || 
                                     trims || sustainability;
                      
                      if (hasData) {
                        return (
                          <div className="border border-[#E5E7EB] border-t-0 rounded-b-lg overflow-hidden">
                            <button
                              onClick={() => toggleAccordion('materialAndCare')}
                              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F9FAFB] transition-colors"
                            >
                              <h3 className="text-[18px] font-medium text-[#2A2A2A]">
                                Material &amp; Care
                              </h3>
                              <svg
                                className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${
                                  accordionStates.materialAndCare ? "rotate-180" : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            {accordionStates.materialAndCare && (
                              <div className="px-4 pb-4 bg-white border-t border-[#E5E7EB]">
                                <div className="space-y-3 pt-3">
                                  {fabric_composition && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Fabric Composition</dt>
                                      <dd className="text-sm text-[#6B7280]">{fabric_composition}</dd>
                                    </div>
                                  )}
                                  {lining && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Lining</dt>
                                      <dd className="text-sm text-[#6B7280]">{lining}</dd>
                                    </div>
                                  )}
                                  {care_instructions && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Care Instructions</dt>
                                      <dd className="text-sm text-[#6B7280] whitespace-pre-wrap">{care_instructions}</dd>
                                    </div>
                                  )}
                                  {trims && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Trims</dt>
                                      <dd className="text-sm text-[#6B7280]">{trims}</dd>
                                    </div>
                                  )}
                                  {sustainability && (
                                    <div>
                                      <dt className="text-sm font-medium text-[#374151] mb-1">Sustainability</dt>
                                      <dd className="text-sm text-[#6B7280]">{sustainability}</dd>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing material_and_care:', e);
                  }
                  return null;
                })()}

                {/* Key Features Accordion */}
                {(() => {
                  try {
                    // Parse key_features if it's a JSON string
                    let features = selectedProduct.key_features;
                    if (typeof features === 'string') {
                      features = JSON.parse(features);
                    }
                    if (Array.isArray(features) && features.length > 0) {
                      return (
                        <div className="border border-[#E5E7EB] border-t-0 rounded-b-lg overflow-hidden">
                          <button
                            onClick={() => toggleAccordion('keyFeatures')}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F9FAFB] transition-colors"
                          >
                            <h3 className="text-[18px] font-medium text-[#2A2A2A]">
                              Key Features
                            </h3>
                            <svg
                              className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${
                                accordionStates.keyFeatures ? "rotate-180" : ""
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {accordionStates.keyFeatures && (
                            <div className="px-4 pb-4 bg-white border-t border-[#E5E7EB]">
                              <ul className="list-disc list-inside text-sm text-[#999DA2] space-y-1 pt-3">
                                {features.map((feature, idx) => (
                                  <li key={idx}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    }
                  } catch (e) {
                    console.error('Error parsing key_features:', e);
                  }
                  return null;
                })()}

                {/* How to Style Accordion */}
                {(() => {
                  try {
                    // Parse how_to_style if it's a JSON string
                    let styleTips = selectedProduct.how_to_style;
                    if (typeof styleTips === 'string') {
                      styleTips = JSON.parse(styleTips);
                    }
                    if (Array.isArray(styleTips) && styleTips.length > 0) {
                      return (
                        <div className="border border-[#E5E7EB] border-t-0 rounded-b-lg overflow-hidden">
                          <button
                            onClick={() => toggleAccordion('howToStyle')}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F9FAFB] transition-colors"
                          >
                            <h3 className="text-[18px] font-medium text-[#2A2A2A]">
                              How to Style
                            </h3>
                            <svg
                              className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${
                                accordionStates.howToStyle ? "rotate-180" : ""
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {accordionStates.howToStyle && (
                            <div className="px-4 pb-4 bg-white border-t border-[#E5E7EB]">
                              <ul className="list-disc list-inside text-sm text-[#6B7280] space-y-1 pt-3">
                                {styleTips.map((tip, idx) => (
                                  <li key={idx}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    }
                  } catch (e) {
                    console.error('Error parsing how_to_style:', e);
                  }
                  return null;
                })()}
              </div>


              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* end  */}
              {/* <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p> */}
              {/* <div className="mb-4">
                <p className="text-[#999DA2]">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      onClick={() => setSelectedSize(size)}
                      key={size}
                      className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityCange("minus")}
                    className="px-2 py-1 bg-gray-300 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityCange("plus")}
                    className={`px-2 py-1 rounded text-lg ${maxAvailable > 0 && quantity >= maxAvailable
                      ? "bg-gray-200 cursor-not-allowed opacity-60"
                      : "bg-gray-300"
                      }`}
                    disabled={
                      maxAvailable > 0 && quantity >= maxAvailable
                    }
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {maxAvailable > 0
                    ? `${maxAvailable} item(s) available in stock.`
                    : "This product is currently out of stock."}
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled || maxAvailable <= 0}
                className={`bg-black text-white hover:text-gray-200 scale-110 py-2 px-6 rounded w-full mb-4 ${isButtonDisabled || maxAvailable <= 0
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-900"
                  }`}
              >
                {maxAvailable <= 0
                  ? "OUT OF STOCK"
                  : isButtonDisabled
                    ? "Adding..."
                    : "ADD TO CART"}
              </button>
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-start font-medium mb-4 text-[#2A2A2A]">
              Best mix style with
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideModalOpen && (() => {
        // Helper function to determine garment type
        const getGarmentType = () => {
          // First check garment_type field if available
          if (selectedProduct?.garment_type) {
            return selectedProduct.garment_type;
          }
          
          // Otherwise determine from category name
          const categoryName = selectedProduct?.category_data?.name || 
                               selectedProduct?.category || 
                               '';
          const categoryLower = categoryName.toLowerCase();
          
          // Check for topwear
          if (
            categoryLower.includes('top') ||
            categoryLower.includes('shirt') ||
            categoryLower.includes('tshirt') ||
            categoryLower.includes('blouse') ||
            categoryLower.includes('sweater') ||
            categoryLower.includes('jacket') ||
            categoryLower.includes('hoodie') ||
            categoryLower.includes('topwear')
          ) {
            return 'top';
          }
          
          // Check for bottomwear
          if (
            categoryLower.includes('bottom') ||
            categoryLower.includes('pant') ||
            categoryLower.includes('trouser') ||
            categoryLower.includes('jean') ||
            categoryLower.includes('skirt') ||
            categoryLower.includes('short') ||
            categoryLower.includes('bottomwear')
          ) {
            return 'bottom';
          }
          
          // Check for full-set
          if (
            categoryLower.includes('dress') ||
            categoryLower.includes('jumpsuit') ||
            categoryLower.includes('romper') ||
            categoryLower.includes('full') ||
            categoryLower.includes('set') ||
            categoryLower.includes('full_set')
          ) {
            return 'full_set';
          }
          
          // Default to bottom if cannot determine
          return 'bottom';
        };

        // Size chart fallback data
        const sizeChartData = {
          top: {
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            columns: [
              { label: 'Chest', values: ['36', '38', '40', '42', '44', '46', '48'] },
              { label: 'Shoulder', values: ['19.75', '20.5', '21.25', '22', '22.75', '23.75', '24.75'] },
              { label: 'Length', values: ['29', '29', '29.5', '29.5', '30', '30', '30.5'] },
            ],
          },
          bottom: {
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            columns: [
              { label: 'Bust', values: ['78–82', '82–86', '86–90', '90–96', '96–102'] },
              { label: 'Waist', values: ['58–62', '62–66', '66–70', '70–76', '76–82'] },
              { label: 'Hip', values: ['86–90', '90–94', '94–98', '98–104', '104–110'] },
            ],
          },
          full_set: {
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            columns: [
              { label: 'Bust', values: ['78–82', '82–86', '86–90', '90–96', '96–102', '102–108'] },
              { label: 'Waist', values: ['58–62', '62–66', '66–70', '70–76', '76–82', '82–88'] },
              { label: 'Hip', values: ['86–90', '90–94', '94–98', '98–104', '104–110', '110–116'] },
              { label: 'Length', values: ['58', '60', '62', '64', '66', '68'] },
            ],
          },
        };

        // Helper function to get size chart data - dynamic from backend or fallback to category-based
        const getSizeChartData = () => {
          // Priority 1: Use size chart data from backend if available
          if (selectedProduct?.size_chart_data?.chart_data) {
            const chartData = selectedProduct.size_chart_data.chart_data;
            
            // Handle different possible formats of chart_data
            // Format 1: { sizes: [...], columns: [{label: "...", values: [...]}] }
            if (chartData.sizes && chartData.columns) {
              return {
                sizes: chartData.sizes,
                columns: chartData.columns,
              };
            }
            
            // Format 2: Array of objects with size as key
            // { "XS": { "Bust": "78-82", "Waist": "58-62" }, "S": {...} }
            if (typeof chartData === 'object' && !Array.isArray(chartData) && !chartData.sizes) {
              const sizes = Object.keys(chartData);
              const firstSize = chartData[sizes[0]];
              const columnLabels = Object.keys(firstSize);
              
              return {
                sizes: sizes,
                columns: columnLabels.map(label => ({
                  label: label,
                  values: sizes.map(size => chartData[size][label] || '—')
                }))
              };
            }
            
            // Format 3: Array format [{ size: "XS", "Bust": "78-82", ... }, ...]
            if (Array.isArray(chartData) && chartData.length > 0) {
              const sizes = chartData.map(row => row.size || row.Size || Object.values(row)[0]);
              const firstRow = chartData[0];
              const columnLabels = Object.keys(firstRow).filter(key => 
                key.toLowerCase() !== 'size' && key !== 'id'
              );
              
              return {
                sizes: sizes,
                columns: columnLabels.map(label => ({
                  label: label,
                  values: chartData.map(row => row[label] || '—')
                }))
              };
            }
          }
          
          // Priority 2: Fallback to category-based hardcoded charts
          const garmentType = getGarmentType();
          return sizeChartData[garmentType] || sizeChartData.bottom;
        };

        const chartData = getSizeChartData();
        
        return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsSizeGuideModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

          {/* Modal Container */}
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Size Guide (cm)
                </h2>
                {selectedProduct?.size_chart_data?.name && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedProduct.size_chart_data.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsSizeGuideModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                      {chartData.columns.map((column, idx) => (
                        <th key={idx} className="text-left py-3 px-4 font-semibold text-gray-900">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.sizes.map((size, sizeIdx) => (
                      <tr key={sizeIdx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{size}</td>
                        {chartData.columns.map((column, colIdx) => (
                          <td key={colIdx} className="py-3 px-4 text-gray-700">
                            {column.values[sizeIdx] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Virtual Try-On Modal */}
      {isTryOnModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsTryOnModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

          {/* Modal Container */}
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Virtual Try-On
              </h2>
              <button
                onClick={() => setIsTryOnModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {!user ? (
                  <div className="w-full bg-gray-100 rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[500px]">
                    <p className="text-gray-500 mb-4">Please login to use Virtual Try-On</p>
                    <Link
                      to="/login"
                      className="px-6 py-2 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white font-medium shadow-md hover:opacity-90 transition"
                      onClick={() => setIsTryOnModalOpen(false)}
                    >
                      Login
                    </Link>
                  </div>
                ) : avatarLoading ? (
                  <div className="w-full bg-[#2f3137] rounded-3xl p-6 shadow-lg flex items-center justify-center min-h-[500px]">
                    <div className="text-white">Loading your avatar...</div>
                  </div>
                ) : userAvatar ? (
                  <div className="w-full bg-[#2f3137] rounded-3xl p-6 shadow-lg">
                    <div className="w-full flex items-center justify-center rounded-3xl overflow-hidden bg-[#2f3137]">
                      <ThreeModel
                        avatar={userAvatar.base_model_url || null}
                        defaultPant={userAvatar.default_pant_model_url || null}
                        defaultTshirt={userAvatar.default_tshirt_model_url || null}
                        garment={
                          (() => {
                            // Get product GLB URL from assets_3d
                            if (selectedProduct?.assets_3d && selectedProduct.assets_3d.length > 0) {
                              // Try to find GLB matching selected size, otherwise use first available
                              const matchingSize = selectedProduct.assets_3d.find(
                                (asset) => asset.size === selectedSize && asset.asset_type === 'glb'
                              );
                              if (matchingSize) return matchingSize.asset_url;
                              
                              // Fallback to first GLB asset
                              const firstGlb = selectedProduct.assets_3d.find(
                                (asset) => asset.asset_type === 'glb'
                              );
                              if (firstGlb) return firstGlb.asset_url;
                              
                              // If no GLB found, return first asset URL
                              return selectedProduct.assets_3d[0]?.asset_url || null;
                            }
                            return null;
                          })()
                        }
                        garmentType={
                          (() => {
                            // Determine if product is topwear or bottomwear from category
                            const categoryName = selectedProduct?.category_data?.name || 
                                               selectedProduct?.category || 
                                               '';
                            const categoryLower = categoryName.toLowerCase();
                            
                            // Check for topwear
                            if (
                              categoryLower.includes('top') ||
                              categoryLower.includes('shirt') ||
                              categoryLower.includes('tshirt') ||
                              categoryLower.includes('blouse') ||
                              categoryLower.includes('sweater') ||
                              categoryLower.includes('jacket') ||
                              categoryLower.includes('hoodie') ||
                              categoryLower.includes('topwear')
                            ) {
                              return 'topwear';
                            }
                            
                            // Check for bottomwear
                            if (
                              categoryLower.includes('bottom') ||
                              categoryLower.includes('pant') ||
                              categoryLower.includes('trouser') ||
                              categoryLower.includes('jean') ||
                              categoryLower.includes('skirt') ||
                              categoryLower.includes('short') ||
                              categoryLower.includes('bottomwear')
                            ) {
                              return 'bottomwear';
                            }
                            
                            return null;
                          })()
                        }
                        hairStyle={userAvatar.selected_hair_style_url || null}
                        height={userAvatar.height || null}
                        skinTone={userAvatar.selected_skin_color || null}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[500px]">
                    <p className="text-gray-500 mb-4">No avatar found</p>
                    <Link
                      to="/edit-avatar"
                      className="px-6 py-2 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white font-medium shadow-md hover:opacity-90 transition"
                      onClick={() => setIsTryOnModalOpen(false)}
                    >
                      Create Avatar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
