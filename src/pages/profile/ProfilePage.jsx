// AccountDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import MyOrdersPage from "../orders/MyOrdersPage";
import profileImg from "../../assets/images/ui/profile-img.png";
import CartPage from "../cart/CartPage";
import SortOptions from "../../components/products/SortOptions";
import delate from "../../assets/images/ui/delate.svg"
import like from "../../assets/images/ui/like.svg"
import { updateProfile } from "../../store/slices";
import { fetchWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import { fetchCart } from "../../store/slices/cartSlice";
import { avatarService } from "../../api/services/avatarService";
import ThreeModel from "../../components/avatar/ThreeModel";


export default function AccountDetails() {
  console.log("Harshal 9");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [gender, setGender] = useState("Female");
  // Check for activeTab in navigation state or URL hash
  const [activeTab, setActiveTab] = useState(() => {
    // Check if there's state from navigation
    if (location.state?.activeTab) return location.state.activeTab;
    // Check URL hash
    const hash = location.hash?.replace("#", "");
    if (hash && ["account", "cart", "orders", "wishlist"].includes(hash)) {
      return hash;
    }
    return "account";
  });

  // Update activeTab when location state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [initialFormValues, setInitialFormValues] = useState(formValues);
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { wishlist, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  
  // User avatar state
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const displayName = useMemo(() => {
    const first = user?.firstname || "";
    const last = user?.lastname || "";
    const combined = `${first} ${last}`.trim();
    return combined || user?.name || "";
  }, [user]);

  // Get wishlist items with product data
  const wishlistItemsWithProducts = useMemo(() => {
    return wishlist?.items?.filter((item) => item.product) || [];
  }, [wishlist?.items]);

  const buildFormFromUser = (currentUser) => ({
    firstName:
      currentUser?.firstname ||
      currentUser?.name?.split(" ")[0] ||
      "",
    lastName:
      currentUser?.lastname ||
      currentUser?.name?.split(" ").slice(1).join(" ") ||
      "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    address: currentUser?.address || "",
  });

  useEffect(() => {
    const nextValues = buildFormFromUser(user);
    setFormValues(nextValues);
    setInitialFormValues(nextValues);
    if (user?.gender) {
      setGender(user.gender);
    }
  }, [user]);

  // Fetch wishlist when user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Fetch user's saved avatar
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!user) return;
      
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
  }, [user]);

  // Cart fetching is handled by CartPage component itself

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success("Removed from wishlist", {
        duration: 1500,
        style: {
          backgroundColor: "#22C55E",
          color: "#FFFFFF",
        },
      });
      // Wishlist state will be updated automatically by the Redux slice
    } catch (error) {
      // Handle different error formats from Redux Toolkit unwrap()
      const message = 
        error?.message || 
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        (typeof error === 'string' ? error : "Failed to remove from wishlist");
      toast.error(message, { duration: 1500 });
    }
  };

  const handleInputChange = (field, value) => {
    if (!isEditing) return;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormValues(initialFormValues);
    setGender(user?.gender || initialFormValues.gender || "Female");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload = {
      firstname: (formValues.firstName || "").trim(),
      lastname: (formValues.lastName || "").trim(),
      phone: formValues.phone,
      email: formValues.email,
      address: formValues.address,
      gender,
    };

    try {
      await dispatch(updateProfile(payload)).unwrap();
      setInitialFormValues(formValues);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <>
      <section className="px-auto pb-[16px] lg:px-12 py-20 flex items-center justify-center w-full hidden">
        <div className="max-w-7xl px-[60px] w-full">

          {/* PROFILE TOP */}
          <div className="flex items-center gap-4">
            {/* <img
          src="https://i.pravatar.cc/100?img=12"
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover"
        /> */}
            <img src={profileImg} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-[#DDAE8C]" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex items-center justify-start gap-4 mt-6">

            <button
              onClick={() => setActiveTab("account")}
              className={`px-6 py-2 rounded-full font-medium shadow-md 
            ${activeTab === "account"
                  ? "bg-gradient-to-r from-gray-900 to-orange-300 text-white"
                  : "bg-white border text-gray-700 shadow-sm hover:bg-gray-50"
                }`}
            >
              Account Details
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={`px-6 py-2 rounded-full font-medium shadow-sm 
    ${activeTab === "cart"
                  ? "bg-gradient-to-r from-gray-900 to-orange-300 text-white"
                  : "bg-white border text-gray-700 hover:bg-gray-50"
                }`}
            >
              My Cart
            </button>


            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-full font-medium shadow-sm 
            ${activeTab === "orders"
                  ? "bg-gradient-to-r from-gray-900 to-orange-300 text-white"
                  : "bg-white border text-gray-700 hover:bg-gray-50"
                }`}
            >
              My Orders
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`px-6 py-2 rounded-full font-medium shadow-md 
            ${activeTab === "wishlist"
                  ? "bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white"
                  : "bg-white border text-gray-700 shadow-sm hover:bg-gray-50"
                }`}
            >
              My Wishlist
            </button>

          </div>

          {/* RENDER TAB CONTENT */}
          {activeTab === "orders" && (
            <div className="mt-10">
              <MyOrdersPage />
            </div>
          )}

          {activeTab === "cart" && (
            <div className="mt-10">
              <CartPage />
            </div>
          )}


          {/* Account Details TAB CONTENT */}
          {activeTab === "account" && (
            <>
              {/* TITLE + EDIT BUTTON */}
              <div className="flex items-center justify-between mt-10 mb-6">
                <h3 className="font-normal text-[26px] leading-[100%] tracking-[0] text-[#1D1D1D]">
                  Account details
                </h3>

                <button className="px-6 py-2 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white shadow-md font-medium">
                  Edit details
                </button>
              </div>

              {/* FORM */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="text-sm text-[#374151] font-medium mb-2 block">
                    First Name
                  </label>
                  <input
                    className="w-full bg-white py-3 px-5 rounded-full border border-gray-200 shadow-sm"
                    placeholder={user?.firstname || user?.name?.split(" ")[0]}
                  />
                </div>

                <div>
                  <label className="text-sm text-[#374151] font-medium mb-2 block">
                    Last Name
                  </label>
                  <input
                    className="w-full bg-white py-3 px-5 rounded-full border border-gray-200 shadow-sm"
                    placeholder={
                      user?.lastname || user?.name?.split(" ").slice(1).join(" ") || ""
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-[#374151] font-medium mb-2 block">
                    Phone Number
                  </label>
                  <input
                    className="w-full bg-white py-3 px-5 rounded-full border border-gray-200 shadow-sm"
                    placeholder="+91 XXXXXX"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#374151] font-medium mb-2 block">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-white py-3 px-5 rounded-full border border-gray-200 shadow-sm"
                    placeholder={user?.email}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="text-sm text-[#374151] font-medium mb-2 block">
                    Shipping Address
                  </label>
                  <input
                    className="w-full bg-white py-3 px-5 rounded-full border border-gray-200 shadow-sm"
                    placeholder="64, 467 Lorem ipsum"
                  />
                </div>
              </div>

              {/* GENDER */}
              <div className="mt-6">
                <label className="text-sm text-[#374151] font-medium mb-2 block">
                  Gender
                </label>

                <div className="flex items-center gap-8 mt-2">
                  {["Male", "Female", "Non-binary"].map((g) => (
                    <div
                      key={g}
                      className="flex items-center gap-2 cursor-pointer text-[#374151]"
                      onClick={() => setGender(g)}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border
                      ${gender === g
                            ? "border-[#374151] bg-[#374151]"
                            : "border-[#E5E7EB] bg-white"
                          }`}
                      />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "wishlist" && (
            <>
              <div className="mt-10">
                <h2 className="text-2xl text-start font-medium mb-4 text-[#2A2A2A]">
                  My Wishlist
                </h2>
                <p>All wishlist cards here</p>
              </div>
            </>
          )}



        </div>
      </section>
      <section className="w-full pb-[16px]  px-4 sm:px-8 lg:px-12 flex justify-center">
        <div className="w-full  max-w-7xl px-8">
          {/* Breadcrumb */}
          <div className="my-[28px] flex items-center justify-between">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a href="#" className="inline-flex items-center text-sm font-medium text-[#8B949E] hover:text-fg-brand">
                    Home
                  </a>
                </li>
                <li aria-current="page">
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="w-3.5 h-3.5 rtl:rotate-180 text-[#8B949E]"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                    <span className="inline-flex items-center text-sm font-medium text-body-subtle">
                      My account
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

          </div>
        </div>
      </section>
      <section className="w-full pb-[16px]  px-4 sm:px-8 lg:px-12 flex justify-center">
        <div className="w-full  max-w-7xl px-8">



          {/* PROFILE TOP */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={profileImg}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border border-[#DDAE8C]"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 break-all">
                {displayName}
              </h2>
              <p className="text-gray-500 text-sm break-all">
                {user?.email}
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-6">

            {[
              { id: "account", label: "Account Details" },
              { id: "cart", label: "My Cart" },
              { id: "orders", label: "My Orders" },
              { id: "wishlist", label: "My Wishlist" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 sm:px-5 md:px-6 rounded-full font-medium shadow-md cursor-pointer transition
                ${activeTab === tab.id
                    ? "bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white"
                    : "bg-white border text-gray-700 shadow-sm hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}

          </div>

          {/* ********** TAB CONTENT ********** */}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="mt-10 ">
              <MyOrdersPage />
            </div>
          )}

          {/* CART */}
          {activeTab === "cart" && (
            <div className="mt-10">
              <CartPage />
            </div>
          )}

          {/* ACCOUNT DETAILS */}
          {activeTab === "account" && (
            <>
              {authLoading ? (
                <div className="mt-10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-12 w-full bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                    <div className="lg:col-span-2">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-12 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="flex flex-wrap items-center gap-6 mt-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-10 mb-6 gap-4">
                    <h3 className="font-normal text-[26px] leading-[100%] tracking-[0] text-[#1D1D1D]">
                      Account details
                    </h3>

                    <button
                      className="px-5 py-2 cursor-pointer md:px-6 md:py-2.5 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white shadow-md font-medium w-full sm:w-auto disabled:opacity-60"
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                    >
                      Edit details
                    </button>
                  </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {[
                  {
                    name: "firstName",
                    label: "First Name",
                  },
                  {
                    name: "lastName",
                    label: "Last Name",
                  },
                  {
                    name: "phone",
                    label: "Phone Number",
                  },
                  {
                    name: "email",
                    label: "Email Address",
                  },
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="text-sm text-[#374151] font-medium mb-2 block">
                      {field.label}
                    </label>
                    <input
                      className={`w-full py-3 px-5 rounded-full border border-[#E5E7EB] ${isEditing ? "bg-white" : "bg-gray-50 cursor-not-allowed"}`}
                      value={formValues[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                ))}

                {/* SHIPPING ADDRESS */}
                <div className="lg:col-span-2">
                  <label className="text-sm text-[#374151] font-medium mb-2 block">
                    Shipping Address
                  </label>
                  <input
                    className={`w-full py-3 px-5 rounded-full border border-[#E5E7EB] ${isEditing ? "bg-white" : "bg-gray-50 cursor-not-allowed"}`}
                    value={formValues.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* AVATAR DISPLAY */}
              <div className="lg:col-span-2 mt-6">
                <label className="text-sm text-[#374151] font-medium mb-4 block">
                  Your Avatar
                </label>
                {avatarLoading ? (
                  <div className="w-full bg-[#2f3137] rounded-3xl p-6 shadow-lg flex items-center justify-center min-h-[400px]">
                    <div className="text-white">Loading your avatar...</div>
                  </div>
                ) : userAvatar ? (
                  <div className="w-full bg-[#2f3137] rounded-3xl p-6 shadow-lg">
                    <div className="w-full flex items-center justify-center rounded-3xl overflow-hidden bg-[#2f3137] min-h-[400px]">
                      <ThreeModel
                        avatar={userAvatar.base_model_url || null}
                        defaultPant={userAvatar.default_pant_model_url || null}
                        defaultTshirt={userAvatar.default_tshirt_model_url || null}
                        garment={null}
                        hairStyle={userAvatar.selected_hair_style_url || null}
                        height={userAvatar.height || null}
                        skinTone={userAvatar.selected_skin_color || null}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[200px]">
                    <p className="text-gray-500 mb-4">No avatar created yet</p>
                    <Link
                      to="/edit-avatar"
                      className="px-6 py-2 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white font-medium shadow-md hover:opacity-90 transition"
                    >
                      Create Avatar
                    </Link>
                  </div>
                )}
              </div>

              {/* <div className="mt-6">
                <label className="text-sm text-[#374151] font-medium mb-2 block">
                  Gender
                </label>

                <div className="flex flex-wrap items-center gap-6">
                  {["Male", "Female", "Non-binary"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => isEditing && setGender(g)}
                        className="w-4 h-4 accent-[#374151]"
                        disabled={!isEditing}
                      />

                      <span className="text-[#374151]">{g}</span>
                    </label>
                  ))}
                </div>
              </div> */}


              {isEditing && (
                <div className="flex items-center justify-end gap-[10px] mt-[20px] sm:mt-[40px]">
                  <button
                    className="px-[20px] py-[9px]
                    gap-[10px]
                    rounded-full
                    bg-transparent
                    border border-[#374151] text-[#374151] shadow-md font-medium w-full sm:w-auto cursor-pointer"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 md:px-6  cursor-pointer md:py-2.5 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white shadow-md font-medium w-full sm:w-auto"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              )}
                </>
              )}
            </>
          )}

          {/* WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="mt-10">
              <h2 className="text-2xl font-medium mb-4 text-[#2A2A2A]">
                My Wishlist
              </h2>

              {wishlistLoading ? (
                <div className="flex flex-wrap items-start justify-start gap-4">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="w-[260px] bg-white rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] overflow-hidden p-4 min-h-[450px]"
                    >
                      <div className="w-full h-[260px] bg-gray-200 rounded-[16px] mb-4 animate-pulse"></div>
                      <div className="flex items-start justify-between mt-4">
                        <div className="flex-1">
                          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 w-2/3 bg-gray-200 rounded mt-2 animate-pulse"></div>
                      <div className="h-6 w-1/3 bg-gray-200 rounded mt-3 animate-pulse"></div>
                      <div className="h-12 w-full bg-gray-200 rounded-full mt-4 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : !wishlist?.items || wishlist.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#9CA3AF"
                    strokeWidth={1.5}
                    className="w-16 h-16 mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mb-6">Start adding products you love!</p>
                  <Link
                    to="/collection"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C] text-white font-medium shadow-md hover:opacity-90 transition"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-start gap-4">
                  {wishlistItemsWithProducts.map((item) => {
                    const product = item.product;
                    const productId = product.id || product._id || item.product_id;
                    let primaryImage = "/placeholder.jpg";
                    
                    if (product?.primary_image) {
                      primaryImage = product.primary_image;
                    } else if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
                      primaryImage = product.images[0]?.url || product.images[0]?.image_url || primaryImage;
                    }

                    return (
                      <div
                        key={item.id || productId}
                        className="w-[260px] bg-white rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] overflow-hidden p-4"
                      >
                        {/* Product Image */}
                        <Link to={`/product/${productId}`}>
                          <img
                            src={primaryImage}
                            alt={product.name || "Product"}
                            className="w-full h-[260px] object-cover rounded-[16px] cursor-pointer hover:opacity-90 transition"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                        </Link>

                        {/* TITLE + DELETE ICON */}
                        <div className="flex items-start justify-between mt-4">
                          <Link to={`/product/${productId}`} className="flex-1">
                            <h3 className="font-[Poppins] font-medium text-[20px] text-[#484848] hover:text-[#DDAE8C] transition">
                              {product.name}
                            </h3>
                            <p className="font-[Poppins] font-medium text-[12px] text-[#8A8A8A]">
                              {product.brand_name || product.brand || "Brand"}
                            </p>
                          </Link>

                          <button
                            onClick={() => handleRemoveFromWishlist(productId)}
                            className="ml-2 p-1 hover:bg-gray-100 rounded transition"
                            title="Remove from wishlist"
                          >
                            <img src={delate} alt="Remove" className="w-5 h-5" />
                          </button>
                        </div>

                        {/* REVIEWS */}
                        <p className="font-[Poppins] font-medium text-[12px] text-[#484848] mt-2">
                          {product.num_reviews ? `(${product.num_reviews})` : ""}
                          {product.rating > 0 ? ` ${product.rating.toFixed(1)}★` : ""}
                          {product.num_reviews > 0 || product.rating > 0
                            ? " Customer Reviews"
                            : "No reviews yet"}
                        </p>

                        {/* PRICE */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2">
                            <p className="font-[Poppins] font-medium text-[24px] text-[#484848]">
                              ${product.price || "0.00"}
                            </p>
                          </div>
                        </div>
                        {(product.count_in_stock ?? product.countInStock ?? 0) <= 5 &&
                          (product.count_in_stock ?? product.countInStock ?? 0) > 0 && (
                            <p className="text-[#FF4646] font-normal text-[12px]">
                              Almost Sold Out
                            </p>
                          )}

                        {/* ADD TO CART BUTTON */}
                        <Link to={`/product/${productId}`}>
                          <button
                            className="w-full mt-4 py-[12px] text-white rounded-full text-[15px] font-medium bg-gradient-to-r from-[#2C2C2C] to-[#C4916A] hover:opacity-90 transition"
                          >
                            View Product
                          </button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>  
          )}
        </div>
      </section>
    </>



  );
}
