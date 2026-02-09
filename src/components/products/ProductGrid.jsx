
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import like from "../../assets/images/ui/like.svg"
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../store/slices/wishlistSlice'

const ProductGrid = ({products, loading, error}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { wishlist } = useSelector((state) => state.wishlist)
  
  // Helper to check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!wishlist?.items) return false
    // Convert to number for consistent comparison
    const numProductId = Number(productId)
    return wishlist.items.some(item => Number(item.product_id) === numProductId)
  }

  // Handle wishlist toggle
  const handleWishlistToggle = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()

    // Check authentication
    if (!user) {
      toast.error("Please login to add items to wishlist", {
        duration: 2000,
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      })
      return
    }

    const inWishlist = isInWishlist(productId)

    try {
      // Ensure productId is a number
      const numProductId = Number(productId)
      if (inWishlist) {
        await dispatch(removeFromWishlist(numProductId)).unwrap()
        toast.success("Removed from wishlist", {
          duration: 1500,
          style: {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
          },
        })
      } else {
        await dispatch(addToWishlist(numProductId)).unwrap()
        toast.success("Added to wishlist", {
          duration: 1500,
          style: {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
          },
        })
      }
    } catch (error) {
      // Handle different error formats from Redux Toolkit unwrap()
      const message = 
        error?.message || 
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        (typeof error === 'string' ? error : "Failed to update wishlist")
      toast.error(message, { duration: 1500 })
    }
  }
  console.log("ProductGrid - Received props:", { 
    products, 
    loading, 
    error,
    productsCount: Array.isArray(products) ? products.length : 'not an array'
  });
  
  // Ensure products is always an array
  const productsArray = Array.isArray(products) ? products : [];
  
  if(loading && productsArray.length > 0){
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[35px]'>
        {[...Array(productsArray.length)].map((_, index) => (
          <div key={index} className='flex'>
            <div className="rounded-[10px] bg-white shadow-[0px_40px_90px_0px_#0000000F] px-[24px] py-[15px] w-full min-h-[450px]">
              <div className="w-full h-[244px] rounded-[10px] mb-[15px]">
                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              <div className="flex justify-between w-full mb-2">
                <div className="h-[20px] w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="h-[12px] w-1/2 bg-gray-200 rounded mb-[25px] animate-pulse"></div>
              
              <div className="h-[12px] w-2/3 bg-gray-200 rounded mb-[25px] animate-pulse"></div>
              
              <div className='flex items-center gap-2'>
                <div className="h-[20px] w-1/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if(error){
    return <p className="text-center text-red-600">Error: {error}</p>
  }
  
  if(productsArray.length === 0){
    return <p className="text-center text-gray-600">No products available</p>
  }
  
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[35px]'>
      {productsArray.map((product, index) => {
        // Handle different image structures - prioritize primary_image, then images array
        let primaryImage = "/placeholder.jpg";
        let imageAlt = product?.name || "Product image";
        
        if (product?.primary_image) {
          primaryImage = product.primary_image;
        } else if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
          primaryImage = product.images[0]?.url || product.images[0]?.image_url || primaryImage;
          imageAlt = product.images[0]?.altText || product.images[0]?.alt_text || imageAlt;
        }
        
        // Use id (preferred) or _id as fallback, since API returns 'id'
        const productId = product.id || product._id;
        const inWishlist = isInWishlist(productId)
        
        return (
        <Link key={productId || index} to={`/product/${productId}`} className='flex'>
            <div className="rounded-[10px] bg-white shadow-[0px_40px_90px_0px_#0000000F] px-[24px] py-[15px] w-full">
                <div className="w-full h-[244px] rounded-[10px] mb-[15px] ">
                    <img
                      src={primaryImage}
                      alt={imageAlt}
                      className='w-full h-full object-cover rounded-lg'
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                </div>
                
                <div className="flex justify-between w-full">
                <h3 className='font-normal text-[20px] text-[#484848] mb-2'>{product.name}</h3>
                <button 
                  onClick={(e) => handleWishlistToggle(e, productId)}
                  className={`text-gray-600 hover:text-gray-900 transition-all ${
                    inWishlist ? 'opacity-100' : 'opacity-70'
                  }`}
                  title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={inWishlist ? "#EF4444" : "none"}
                    stroke={inWishlist ? "#EF4444" : "#374151"}
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
                <p className='font-bold text-[12px] text-[#8A8A8A] mb-[25px]'>
                  {product.brand_name || product.brand || 'Brand'}
                </p>
                <p className='font-normal text-[12px] text-[#484848] mb-[25px]'>
                  {product.num_reviews ? `(${product.num_reviews})` : ''} 
                  {product.rating > 0 ? ` ${product.rating.toFixed(1)}★` : ''} 
                  {product.num_reviews > 0 || product.rating > 0 ? ' Customer Reviews' : 'No reviews yet'}
                </p>
                <div className='flex items-center gap-2'>
                  <p className='font-normal text-[20px] text-[#484848]'>
                    ${product.price}
                  </p>
                </div>
            </div>
        </Link>
        );
      })}
    </div>
  )
}

export default ProductGrid
