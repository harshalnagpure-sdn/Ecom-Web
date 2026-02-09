import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productService } from "../../api/services";

const FilterSidebar = () => {
  console.log("Harshal 24");
  const [searchParams, setSearchParams] = useSearchParams();
  // x.com/?a=1&b=2
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 300,
  });

  const [priceRange, setPriceRange] = useState([0, 300]);
  
  // State for filter options fetched from API
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Hardcoded options as fallback
  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];

  const genders = ["Men", "Women"];

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      try {
        // Fetch all filter options in parallel
        const [categoriesData, colorsData, sizesData, brandsData] = await Promise.all([
          productService.fetchCategories(),
          productService.fetchColors(),
          productService.fetchSizes(),
          productService.fetchBrands(),
        ]);

        // Set categories - store both name and slug
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData.map(cat => ({
            name: cat.name || cat.slug || cat,
            slug: cat.slug || cat.name || cat
          })));
        }

        // Set colors - store both label and hex
        if (Array.isArray(colorsData)) {
          setColors(colorsData.map(color => ({
            label: color.label || color.name || color,
            hex: color.hex_value || null
          })));
        }

        // Set sizes - store both label and code
        if (Array.isArray(sizesData)) {
          setSizes(sizesData.map(size => ({
            label: size.label || size.code || size,
            code: size.code || size.label || size
          })));
        }

        // Set brands - extract name
        if (Array.isArray(brandsData)) {
          setBrands(brandsData.map(brand => brand.name || brand));
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        // Keep default empty arrays on error
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    //{category: 'Top Wear', maxPrice: 300} => params.category
    const newFilters = {
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: Array.isArray(params.size) ? params.size : (params.size ? params.size.split(",").filter(Boolean) : []),
      material: Array.isArray(params.material) ? params.material : (params.material ? params.material.split(",").filter(Boolean) : []),
      brand: Array.isArray(params.brand) ? params.brand : (params.brand ? params.brand.split(",").filter(Boolean) : []),
      minPrice: params.minPrice || params.min_price ? parseInt(params.minPrice || params.min_price) : 0,
      maxPrice: params.maxPrice || params.max_price ? parseInt(params.maxPrice || params.max_price) : 300,
    };
    setFilters(newFilters);
    setPriceRange([newFilters.minPrice, newFilters.maxPrice]);
  }, [searchParams]);

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`); //?category=Bottom+Wear&size=XS%2C5
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Reset all filters except price when changing any filter (single filter at a time)
    let newFilters = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 300,
    };

    if (type === "checkbox") {
      // If unchecking the currently selected filter, leave it empty
      // If checking a new filter, set it
      if (checked) {
        newFilters[name] = [value];
      } else {
        // Unchecking - leave the filter empty (already empty in newFilters)
        newFilters[name] = [];
      }
    } else if (type === "radio") {
      // If clicking the same radio button, deselect it
      if (filters[name] === value) {
        newFilters[name] = "";
      } else {
        newFilters[name] = value;
      }
    }
    
    setFilters(newFilters);
    
    // Auto-apply filter immediately (update URL)
    applyFiltersToURL(newFilters);
  };

  // Helper function to apply filters to URL
  const applyFiltersToURL = (filtersToApply) => {
    const params = new URLSearchParams(searchParams);
    
    Object.keys(filtersToApply).forEach((key) => {
      if (Array.isArray(filtersToApply[key])) {
        // Handle arrays (size, brand, material)
        if (filtersToApply[key].length > 0) {
          params.set(key, filtersToApply[key].join(","));
        } else {
          // Remove empty arrays from URL
          params.delete(key);
        }
      } else if (key === "minPrice") {
        // Only include min_price if it's not the default (0)
        if (filtersToApply[key] && filtersToApply[key] > 0) {
          params.set('min_price', filtersToApply[key].toString());
        } else {
          params.delete('min_price');
        }
      } else if (key === "maxPrice") {
        // Only include max_price if it's changed from default
        const defaultMax = 300;
        if (filtersToApply[key] && filtersToApply[key] < defaultMax) {
          params.set('max_price', filtersToApply[key].toString());
        } else {
          params.delete('max_price');
        }
      } else if (filtersToApply[key] && filtersToApply[key] !== "") {
        // Only add non-empty string values (category, gender, etc.)
        params.set(key, filtersToApply[key]);
      } else {
        // Remove empty values from URL
        params.delete(key);
      }
    });
    
    // Reset to page 1 when applying filters
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    // Don't update URL immediately - wait for Apply Filter button
  };

  // Apply filters - update URL params (mainly used for price range slider)
  const handleApplyFilters = () => {
    // Use the same helper function for consistency
    applyFiltersToURL(filters);
  };

  // Reset filters - clear all and update URL
  const handleResetFilters = () => {
    const defaultFilters = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 300,
    };
    setFilters(defaultFilters);
    setPriceRange([0, 300]);
    // Clear filter URL params but preserve search and other params
    const params = new URLSearchParams(searchParams);
    // Remove filter-related params
    params.delete("category");
    params.delete("gender");
    params.delete("color");
    params.delete("size");
    params.delete("material");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("min_price");
    params.delete("max_price");
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="p-4 bg-[#8B5CF60D] rounded-[10px] gap-[34px] flex flex-col w-full">
      {/* <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3> */}
      {/* Price Range */}
      <div >
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Prices</label>
        <div className="flex items-center justify-between">
          <span className="font-normal text-[14px] text-[#1F2937]">Range</span>
          <span className="font-normal text-[14px] text-[#1F2937]">AED {filters.minPrice ?? 0} - AED {filters.maxPrice ?? 300}</span>
        </div>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={300}
          value={filters.maxPrice ?? priceRange[1] ?? 300}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#9B59B6]"
        />
      </div>

      {/* size filter */}
      <div >
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Size</label>
        {sizes.map((size) => (
          <div key={size.code} className="flex items-center mb-[20px]">
            <input
              type="checkbox"
              id={`size-${size.code}`}
              name="size"
              value={size.code}
              onChange={handleFilterChange}
              checked={Array.isArray(filters.size) && filters.size.includes(size.code)}
              className="peer mr-2 w-[18px] h-[18px] text-[#374151] focus:ring-[#374151] border-[1.5px] border-[#374151] accent-[#374151] cursor-pointer"
            />
            <label htmlFor={`size-${size.code}`} className="text-[14px] peer-checked:text-[#1F2937] cursor-pointer ml-1">
              {size.label}
            </label>
          </div>
        ))}
      </div>

       {/* brand filter */}
      <div >
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Brand</label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-[20px]">
            <input
              type="checkbox"
              id={`brand-${brand}`}
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={Array.isArray(filters.brand) && filters.brand.includes(brand)}
              className="peer mr-2 w-[18px] h-[18px] text-[#374151] focus:ring-[#374151] border-[1.5px] border-[#374151] accent-[#374151] cursor-pointer"
            />
            <label htmlFor={`brand-${brand}`} className="text-[14px] peer-checked:text-[#1F2937] cursor-pointer ml-1">
              {brand}
            </label>
          </div>
        ))}
      </div>

      {/* category filter */}
      <div >
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Category</label>
        {categories.map((category) => (
          <div key={category.slug} className="flex items-center mb-[20px]">
            <input
              type="radio"
              id={`category-${category.slug}`}
              name="category"
              value={category.slug}
              onChange={handleFilterChange}
              checked={filters.category === category.slug}
              className="peer mr-2 w-[18px] h-[18px] text-[#374151] focus:ring-[#374151] border-[1.5px] border-[#374151] accent-[#374151]"
            />
            <label htmlFor={`category-${category.slug}`} className="font-normal text-[14px] text-[#1F2937] cursor-pointer peer-checked:text-[#1F2937]">
              {category.name}
            </label>
          </div>
        ))}
      </div>

      {/* Genders filter */}
      <div className="mb-6 hidden">
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/* colors section */}
      <div className="mb-6">
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.label}
              name="color"
              value={color.label}
              onClick={(e) => {
                e.preventDefault();
                const event = {
                  target: {
                    name: 'color',
                    value: color.label,
                    type: 'radio'
                  }
                };
                handleFilterChange(event);
              }}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition hover:scale-105 ${filters.color === color.label ? "ring-2 ring-offset-2 ring-[#9B59B6]" : "border-gray-300"
                }`}
              style={{ backgroundColor: color.hex || color.label.toLowerCase() }}
              title={color.label}
            ></button>
          ))}
        </div>
      </div>



      {/* material filter */}
      <div className="mb-6">
        <label className="block font-normal text-[16px] uppercase text-[#1F2937] mb-[32px]">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={`material-${material}`}
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={Array.isArray(filters.material) && filters.material.includes(material)}
              className="peer mr-2 w-[18px] h-[18px] text-[#374151] focus:ring-[#374151] border-[1.5px] border-[#374151] accent-[#374151] cursor-pointer"
            />
            <label htmlFor={`material-${material}`} className="text-gray-700 cursor-pointer ml-1">{material}</label>
          </div>
        ))}
      </div>

     

      {/* Price Range */}
      <div className="mb-8 hidden">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={300}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>AED 0</span>
          <span>AED {priceRange[1]}</span>
        </div>
      </div>

      {/* Apply and Reset Filter Buttons */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-5 py-2 cursor-pointer md:px-6 md:py-2.5 rounded-full bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] text-white shadow-md font-medium w-full sm:w-auto disabled:opacity-60"
        >
          Apply Filter
        </button>
        <button
          onClick={handleResetFilters}
          className="px-5 py-2 cursor-pointer md:px-6 md:py-2.5 rounded-full bg-white border-2 border-[#DDAE8C] text-[#DDAE8C] shadow-md font-medium w-full sm:w-auto hover:bg-[#F9FAFB] transition-colors duration-200"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
