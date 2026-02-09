import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/layout/Hero.jsx";
import GenderCollectionSection from "../../components/products/GenderCollectionSection.jsx";
import NewArrivals from "../../components/products/NewArrivals.jsx";
import ProductDetails from "../../components/products/ProductDetails.jsx";
import ProductGrid from "../../components/products/ProductGrid.jsx";
import FeaturedCollection from "../../components/products/FeaturedCollection.jsx";
import FeaturesSection from "../../components/products/FeaturesSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../store/slices/productsSlice.js";
import { productService } from "../../api/services";

const Home = () => {
  console.log("Harshal 1");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [bestSellerLoading, setBestSellerLoading] = useState(false);
  const [bestSellerError, setBestSellerError] = useState(null);

  const handleShowMoreBestSellers = () => {
    // Navigate to collections page with best sellers filter (sorted by popular)
    navigate("/collections/all?sort_by=popular");
  };

  useEffect(() => {
    // fetch the product of specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
    
    // fetch best seller products
    const fetchBestSellers = async () => {
      setBestSellerLoading(true);
      setBestSellerError(null);
      try {
        // Backend returns single best seller product
        // But we'll show multiple, so fetch products sorted by popular
        const response = await productService.fetchProducts({
          sort_by: 'popular',
          page_size: 8
        });
        
        let productsData = [];
        if (response?.products && Array.isArray(response.products)) {
          productsData = response.products;
        } else if (Array.isArray(response)) {
          productsData = response;
        }
        
        // If no products from sorted list, try fetching best seller endpoint
        if (productsData.length === 0) {
          const bestSeller = await productService.fetchBestSeller();
          productsData = bestSeller ? [bestSeller] : [];
        }
        
        console.log("Processed Best Seller Products:", productsData);
        setBestSellerProducts(productsData);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setBestSellerError(error.message);
        setBestSellerProducts([]);
      } finally {
        setBestSellerLoading(false);
      }
    };
    
    fetchBestSellers();
  }, [dispatch]);

  return (
    <div className="g-white w-full">
      <Hero />
      <GenderCollectionSection />
      <div className="container  bg-white pt-[40px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
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
          Top Sellers
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
          Browse our top-selling products
        </p>

        <ProductGrid products={bestSellerProducts} loading={bestSellerLoading} error={bestSellerError} />
        <div className="flex items-center justify-center mt-[42px] mb-[54px]">
          <button
            type="button"
            onClick={handleShowMoreBestSellers}
            className="flex items-center justify-center  rounded-[50px] bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] border border-[#E5E7EB]  text-white  py-[13px] px-[51px] font-normal text-[16px] uppercase text-white"
          >
            Show More
          </button>
        </div>
      </div>
      <NewArrivals />

      {/* best sellers */}
      {/* <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2> */}
      {/* {bestSellerProduct?._id ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller products ...</p>
      )} */}

      {/* <FeaturedCollection />
      <FeaturesSection /> */}
    </div>
  );
};

export default Home;
