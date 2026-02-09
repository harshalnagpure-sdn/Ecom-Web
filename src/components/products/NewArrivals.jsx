import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "../../api/services";
import ProductGrid from "./ProductGrid";

const NewArrivals = () => {
  console.log("Harshal 23");
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);

  const handleShopNow = () => {
    // Navigate to collections page with new arrivals filter (sorted by newest)
    navigate("/collections/all?sort_by=newest");
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setNewArrivalsLoading(true);
      try {
        const products = await productService.fetchNewArrivals();
        console.log("New Arrivals Response:", products);
        setNewArrivals(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setNewArrivals([]); // Ensure it's always an array even on error
      } finally {
        setNewArrivalsLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -500 : 500;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // update scroll buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="y-16 px-4 lg:px-0 bg-[#F9FAFB] py-[50px]">
      <div className="container  text-center mb-10 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="
    text-center 
    font-bold 
    text-[26px] leading-[34px] 
    sm:text-[30px] sm:leading-[38px]
    md:text-[36px] md:leading-[48px]
    text-[#374151]
    mb-4
  "
        >
          New Arrivals
        </h2>
        <p
          className="
    text-center 
    text-[#555555] 
    font-normal
    text-[14px]
    sm:text-[16px]
    md:text-[20px]
    mb-10
  "
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
          duis
          <br /> ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
          sollicitudin
        </p>

        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select your country
          </label>
          <div className="relative w-full">
            {/* <!-- Select --> */}
            <select
              id="tabs"
              className="block w-full rounded-full border  bg-neutral-secondary-medium
         text-heading text-sm shadow-xs px-4 py-2.5 appearance-none
         placeholder:text-body text-[#374151]"
            >
              <option className="text-[#484848] bg-white">Men’s Fashion</option>
              <option className="text-[#484848] bg-white">Women’s Fashion</option>
              <option className="text-[#484848] bg-white">Women Accessories</option>
              <option className="text-[#484848] bg-white">Men Accessories</option>
              <option className="text-[#484848] bg-white font-medium">
                Discount Deals
              </option>
            </select>

            {/* <!-- Custom Left Icon --> */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#374151]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
        <ul className="hidden text-sm font-medium text-center text-body sm:flex -space-x-px gap-8 ">
          <li className="w-full focus-within:z-10">
            <a
              href="#"
              className="inline-block w-full rounded-[24px] border border-[#ECEEF2]  bg-[#FFFFFF] px-4 py-2.5 font-normal text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
         active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
              aria-current="page"
            >
              Men’s Fashion
            </a>
          </li>
          <li className="w-full focus-within:z-10">
            <a
              href="#"
              className="inline-block w-full rounded-[24px] border border-[#ECEEF2]  bg-[#FFFFFF] px-4 py-2.5 font-normal text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
         active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
            >
              Women’s Fashion
            </a>
          </li>
          <li className="w-full focus-within:z-10">
            <a
              href="#"
              className="inline-block w-full rounded-[24px] border border-[#ECEEF2]  bg-[#FFFFFF] px-4 py-2.5 font-normal text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
         active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
            >
              Men Accessories
            </a>
          </li>
          <li className="w-full focus-within:z-10">
            <a
              href="#"
              className="inline-block w-full rounded-[24px] border border-[#ECEEF2]  bg-[#FFFFFF] px-4 py-2.5 font-normal text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
         active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
            >
              Women Accessories
            </a>
          </li>
          <li className="w-full focus-within:z-10">
            <a
              href="#"
              className="inline-block w-full rounded-[24px] border border-[#ECEEF2]  bg-[#FFFFFF] px-4 py-2.5 font-normal text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)]
         active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
            >
              Discount Deals
            </a>
          </li>
        </ul>

        {/* ==== PRODUCT GRID WITH API DATA ==== */}
        <div className="mt-10">
          <ProductGrid
            products={newArrivals}
            loading={newArrivalsLoading}
            error={null}
          />
        </div>

        <div className="flex items-center justify-center mt-[42px] mb-[54px]">
          <button
            type="button"
            onClick={handleShopNow}
            className="flex items-center justify-center  rounded-[50px] bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] border border-[#E5E7EB]  text-white  py-[13px] px-[51px] font-normal text-[16px] uppercase text-white"
          >
            View More
          </button>
        </div>

        {/* scroll buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2 hidden ">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border border-gray-200 ${canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded-full border border-gray-200 ${canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/* scrollable content */}
      <div className="hidden">
        <div
          ref={scrollRef}
          className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {Array.isArray(newArrivals) && newArrivals.map((product) => {
            // Handle different image structures
            let imageUrl = "/placeholder.jpg";
            let imageAlt = product?.name || "Product image";
            
            if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
              // Handle images array structure
              imageUrl = product.images[0]?.url || product.images[0]?.image_url || imageUrl;
              imageAlt = product.images[0]?.altText || product.images[0]?.alt_text || imageAlt;
            } else if (product?.primary_image) {
              // Handle primary_image string
              imageUrl = product.primary_image;
            }
            
            // Use id (preferred) or _id as fallback, since API returns 'id'
            const productId = product.id || product._id;
            
            return (
              <div
                key={productId}
                className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
              >
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-[500px] object-cover rounded-lg"
                  draggable="false"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-opacity-45 backdrop-blur-md text-white p-4 rounded-b-lg">
                  <Link to={`/product/${productId}`} className="bloxk">
                    <h4 className="font-medium">{product.name || "Product"}</h4>
                    <p className="mt-1">${product.price || "0.00"}</p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
