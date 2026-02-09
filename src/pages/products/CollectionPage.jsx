import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../../components/products/FilterSidebar";
import SortOptions from "../../components/products/SortOptions";
import ProductGrid from "../../components/products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../store/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Helper function to format collection name from URL to database format
  const formatCollectionName = (collectionParam) => {
    // Don't filter by collection if it's invalid, literal route param, or "all"
    if (
      !collectionParam || 
      collectionParam === ":collection" || 
      collectionParam === "all" ||
      collectionParam === "undefined" ||
      collectionParam === "null"
    ) {
      return null;
    }
    
    try {
      // Decode URL encoding (handles %20, etc.)
      let formatted = decodeURIComponent(collectionParam);
      
      // If it contains hyphens or underscores, convert to spaces and title case
      // (e.g., "men-collection" -> "Men Collection")
      if (formatted.includes('-') || formatted.includes('_')) {
        formatted = formatted
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      } else {
        // If already has spaces, just ensure proper title case
        formatted = formatted
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      
      return formatted;
    } catch (error) {
      console.error("Error formatting collection name:", error);
      return collectionParam; // Return original if decoding fails
    }
  };

  useEffect(() => {
    const formattedCollection = formatCollectionName(collection);
    const filters = { ...queryParams };
    
    // Only add collection filter if it's valid and not "all"
    if (formattedCollection) {
      filters.collection = formattedCollection;
    }
    
    // Add default pagination if not present
    if (!filters.page) {
      filters.page = 1;
    }
    if (!filters.page_size) {
      filters.page_size = 20;
    }
    
    console.log("CollectionPage - Fetching products with filters:", {
      originalCollection: collection,
      formattedCollection: formattedCollection,
      allFilters: filters
    });
    
    dispatch(fetchProductsByFilters(filters));
  }, [collection, dispatch, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    // close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    //Add EVent listener for CLicks
    document.addEventListener("mousedown", handleClickOutside);
    //clean event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync search query with URL params when URL changes externally
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchQuery(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Handle search submit (on Enter or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set("search", searchQuery.trim());
    } else {
      newParams.delete("search");
    }
    // Reset to page 1 when searching
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate total pages
  const totalPages = pagination?.total
    ? Math.ceil(pagination.total / (pagination.page_size || 20))
    : 1;
  const currentPage = parseInt(searchParams.get("page")) || pagination?.page || 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const total = totalPages;
    const current = currentPage;

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(total);
      } else if (current >= total - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = total - 3; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(total);
      }
    }

    return pages;
  };

  return (
    <>
      <section className="w-full bg-[#F9FAFB] flex items-center justify-center lg:px-12">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pt-[20px] pb-[10px]">
            {/* Search Box */}
            <div className="max-w-md ">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-[10px] bg-white border border-[#D1D5DB] rounded-[50px] px-4 h-[48px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search text-[#8A8A8A]"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>

                <input
                  type="text"
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full text-[14px] text-[#6B7280] focus:outline-none"
                />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="flex items-center justify-center text-[#8A8A8A] hover:text-[#6B7280] transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                    </svg>
                  </button>
                )}
                
                <button
                  type="submit"
                  className="sr-only"
                  aria-label="Search"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <ul className="hidden sm:flex text-sm font-medium text-center gap-[10px] -space-x-px">
                <li>
                  <a
                    href="#"
                    className="inline-block rounded-[24px] border border-[#ECEEF2] bg-white px-4 py-2.5 text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
                  >
                    Men’s Fashion
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="inline-block whitespace-nowrap rounded-[24px] border border-[#ECEEF2] bg-white px-4 py-2.5 text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
                  >
                    Women’s Fashion
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="inline-block whitespace-nowrap rounded-[24px] border border-[#ECEEF2] bg-white px-4 py-2.5 text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
                  >
                    Men Accessories
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="inline-block whitespace-nowrap rounded-[24px] border border-[#ECEEF2] bg-white px-4 py-2.5 text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
                  >
                    Women Accessories
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="inline-block whitespace-nowrap rounded-[24px] border border-[#ECEEF2] bg-white px-4 py-2.5 text-[14px] text-[#8A8A8A] hover:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] active:bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] hover:text-white active:text-white"
                  >
                    Discount Deals
                  </a>
                </li>
              </ul>
            </div>

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
                  <option className="text-[#484848] bg-white">
                    Women’s Fashion
                  </option>
                  <option className="text-[#484848] bg-white">
                    Women Accessories
                  </option>
                  <option className="text-[#484848] bg-white">
                    Men Accessories
                  </option>
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
          </div>
        </div>
      </section>

      <section className="px-auto lg:px-12 flex items-center justify-center w-full">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile filter button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden border p-2 flex justify-center items-center"
          >
            <FaFilter className="mr-2" />
          </button>

          {/* Breadcrumb */}
          <div className="my-[12px] flex items-center justify-between">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand text-[#8B949E]"
                  >
                    <svg
                      className="w-4 h-4 me-1.5"
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
                        strokeWidth="2"
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                      />
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="w-3.5 h-3.5 rtl:rotate-180 text-body text-[#8B949E]"
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
                        strokeWidth="2"
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                    <a
                      href=""
                      className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand text-[#8B949E]"
                    >
                      Shop
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center space-x-1.5">
                    <svg
                      className="w-3.5 h-3.5 rtl:rotate-180 text-body text-[#8B949E]"
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
                        strokeWidth="2"
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                    <span className="inline-flex items-center text-sm font-medium text-body-subtle">
                      Product details
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="flex items-baseline justify-center mt-2">
              <span className="text-[#6B7280]">Sort by:</span>
              <SortOptions />
            </div>
          </div>
          {/* filter sidebar */}
          <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start lg:relative">
            <div
              ref={sidebarRef}
              className={`${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } fixed inset-y-0 z-0 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0 lg:inset-auto lg:left-auto lg:top-auto lg:bottom-auto lg:right-auto mb-8 lg:mb-0 lg:w-[280px] lg:flex-shrink-0 lg:self-start lg:min-w-[280px] lg:max-w-[280px]`}
            >
              <FilterSidebar />
            </div>
            <div className="flex-grow p-6 lg:min-w-0 lg:flex-1">
              <h2 className="font-normal text-[26px]  text-center text=[#374151]">
                Discover the Latest Pieces by{" "}
                <span className="text-[#C98A5C]">NADINE</span>{" "}
              </h2>
              <p className="font-normal text-[16px] text-center text-[#797979] mb-4">
                Luxury fashion designed for timeless confidence.
              </p>
              {/* sort opeitons */}
              {/* <SortOptions /> */}

              {/* PRoduct grid */}

              <ProductGrid
                products={products}
                loading={loading}
                error={error}
              />

              {totalPages > 1 && (
                <div className="flex item-center justify-end mt-4">
                  <nav
                    className="flex items-center -space-x-px gap-[6px]"
                    aria-label="Pagination"
                  >
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination?.has_prev || currentPage === 1}
                      className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded bg-gray-300 border border-gray-200 text-gray-800 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                      aria-label="Previous"
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6"></path>
                      </svg>
                      <span className="sr-only">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => {
                      if (page === "ellipsis") {
                        return (
                          <div
                            key={`ellipsis-${index}`}
                            className="hs-tooltip inline-block border border-gray-200 dark:border-neutral-700 rounded"
                          >
                            <button
                              type="button"
                              className="hs-tooltip-toggle group min-h-9 min-w-9 flex justify-center items-center text-gray-400 hover:text-blue-600 p-2 text-sm focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:bg-white/10"
                              disabled
                            >
                              <span className="group-hover:hidden text-xs">•••</span>
                              <svg
                                className="group-hover:block hidden shrink-0 size-5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m6 17 5-5-5-5"></path>
                                <path d="m13 17 5-5-5-5"></path>
                              </svg>
                            </button>
                          </div>
                        );
                      }

                      const isActive = page === currentPage;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`min-h-9.5 min-w-9.5 flex justify-center items-center focus:outline-hidden disabled:pointer-events-none font-normal text-base rounded border border-gray-200 ${
                            isActive
                              ? "bg-[#DDAE8C] text-white border-[#DDAE8C]"
                              : "text-gray-700 text-gray-800 hover:bg-gray-100 dark:bg-neutral-600"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination?.has_next || currentPage === totalPages}
                      className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded border border-gray-200 text-gray-800 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 bg-[#DDAE8C]"
                      aria-label="Next"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CollectionPage;
