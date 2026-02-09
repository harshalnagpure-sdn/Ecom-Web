import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiXMark,
  HiChevronDown,
} from "react-icons/hi2";

import nevlogo from "../../assets/images/ui/nev-logo.png";
import profileImg from "../../assets/images/ui/profile-img.png";
import CartSidebar from "../cart/CartSidebar";

// ---------------------------
// CLICK OUTSIDE DROPDOWN
// ---------------------------
function useClickOutside(cb) {
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);

  return ref;
}

const handleLogout = () => {
  localStorage.clear();        // deletes everything from localStorage
  // OR if you only want to remove token:
  // localStorage.removeItem("token");

  // optional: redirect to login page
  window.location.href = "/"; 
};

const navigation = [
  { name: "Home", to: "/" },
  { name: "About Us", to: "/aboutus" },
  { name: "Shop", to: "/collections/:collection" },
  { name: "Virtual Try-On", to: "/virtualtryon" },
  { name: "AI Stylist", to: "/aistylist" },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  
  const isLoggedIn = Boolean(user);
  const wishlistCount = wishlist?.items?.length || 0;
  const cartItemCount = cart?.items?.length || 0;
  // const isLoggedIn = true;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const profileRef = useClickOutside(() => setProfileOpen(false));

  return (
    <>
      {/* MAIN NAV */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[74px] flex items-center justify-between">
            {/* ------------------ LOGO ------------------ */}
            <Link to="/" className="flex items-center gap-1">
              <img src={nevlogo} className="h-[64px]" alt="logo" />
            </Link>

            {/* ------------------ CENTER NAV (PUBLIC FOR ALL USERS) ------------------ */}
            <nav className="hidden md:flex gap-10">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative text-[16px] transition text-shadow-[0px_1px_2px_#00000040] font-normal ${
                      isActive
                        ? "text-[#E1B291] after:absolute  after:left-0 after:w-full  after:bg-[#E1B291]"
                        : "text-[#374151] hover:text-[#E1B291]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* ------------------ RIGHT SIDE ------------------ */}
            <div className="flex items-center gap-4">
              {/* BEFORE LOGIN BUTTONS */}
              {!isLoggedIn && (
                <div className="hidden sm:flex items-center gap-4">
                  {/* Cart Button for Guests */}
                  <button
                    onClick={() => setCartOpen(true)}
                    className="relative text-gray-700 hover:text-[#DDAE8C] transition"
                    aria-label="Shopping cart"
                  >
                    <HiOutlineShoppingBag className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount > 9 ? "9+" : cartItemCount}
                      </span>
                    )}
                  </button>

                  <Link
                    to="/login"
                    className="px-6 py-2 border border-gray-800 rounded-full text-gray-900 hover:bg-gray-100"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* AFTER LOGIN ACTIONS */}
              {isLoggedIn && (
                <>
                  {/* Cart Button */}
                  <button
                    onClick={() => setCartOpen(true)}
                    className="hidden sm:flex relative text-gray-700 hover:text-[#DDAE8C] transition"
                    aria-label="Shopping cart"
                  >
                    <HiOutlineShoppingBag className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount > 9 ? "9+" : cartItemCount}
                      </span>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      navigate("/profile", { state: { activeTab: "wishlist" } });
                    }}
                    className="hidden sm:flex relative text-gray-700 hover:text-[#DDAE8C] transition"
                  >
                    <HiOutlineHeart className="w-6 h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative hidden sm:block" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="flex items-center gap-1"
                    >
                      <img
                        src={profileImg}
                        className="h-11 w-11 rounded-full border border-[#DDAE8C]"
                        alt="avatar"
                      />
                      <HiChevronDown
                        className={`w-5 h-5 transition ${
                          profileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl py-2 text-sm">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-50"
                        >
                          My Account
                        </Link>

                        <Link
                          to="/edit-avatar"
                          className="block px-4 py-2 hover:bg-gray-50"
                        >
                          Edit Avatar
                        </Link>

                <button
          className="w-full text-left px-4 py-2 hover:bg-gray-50"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden text-gray-700 hover:text-[#E1B291]"
              >
                {mobileOpen ? (
                  <HiXMark className="w-7 h-7" />
                ) : (
                  <HiBars3BottomRight className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ------------------ MOBILE NAV ------------------ */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
            {/* Public navigation links (visible for all users) */}
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className="block text-gray-800 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            <hr />

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setCartOpen(true);
                  }}
                  className="flex items-center gap-2 text-gray-700 relative w-full text-left"
                >
                  <HiOutlineShoppingBag className="w-6 h-6" />
                  <span>Shopping Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/profile"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/profile", { state: { activeTab: "wishlist" } });
                  }}
                  className="flex items-center gap-2 text-gray-700 relative"
                >
                  <HiOutlineHeart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </Link>

                <hr />

                <Link to="/profile" className="block py-2">
                  My Account
                </Link>

                <Link to="/edit-avatar" className="block py-2 text-[#E88A39]">
                  Edit Avatar
                </Link>

                <button className="block py-2 text-left">Logout</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setCartOpen(true);
                  }}
                  className="flex items-center gap-2 text-gray-700 relative w-full text-left py-2"
                >
                  <HiOutlineShoppingBag className="w-6 h-6" />
                  <span>Shopping Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/login"
                  className="block py-2 border border-gray-800 rounded-full text-center"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="block py-2 rounded-full text-center text-white bg-gradient-to-r from-[#2B2B2B] to-[#DDAE8C]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
