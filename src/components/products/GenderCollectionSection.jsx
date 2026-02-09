import React from "react";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";
import { Link } from "react-router-dom";
import aiSuggestionsIcon from "../../assets/images/ui/ai-suggestions-icon.svg";
import tryOnIcon from "../../assets/images/ui/try-on-icon.svg";
import returnIcon from "../../assets/images/ui/return-icon.svg";
import secureIcon from "../../assets/images/ui/secure-icon.svg";

const GenderCollectionSection = () => {
  console.log("Harshal 25");
  return (
    <>
      <section className="lg:px-0">
        <div className="py-17.5 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* ITEM 1 */}
              <div className="flex items-start gap-4">
                <img
                  src={aiSuggestionsIcon}
                  alt="AI Suggestions"
                  className="w-6 h-6 sm:w-7 sm:h-7 "
                />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                    AI SUGGESTIONS
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Get recommendations on the fly with AI
                  </p>
                </div>
              </div>

              {/* ITEM 2 */}
              <div className="flex items-start gap-4">
                <img
                  src={tryOnIcon}
                  alt="3D Virtual Try-on"
                  className="w-6 h-6 sm:w-7 sm:h-7 "
                />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                    3D VIRTUAL TRY-ON
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Try outfits on your 3D avatar, virtually
                  </p>
                </div>
              </div>

              {/* ITEM 3 */}
              <div className="flex items-start gap-4">
                <img
                  src={returnIcon}
                  alt="30 Days Return"
                  className="w-6 h-6 sm:w-7 sm:h-7 "
                />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                    30 DAYS RETURN
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Simply return it within 30 days for an exchange
                  </p>
                </div>
              </div>

              {/* ITEM 4 */}
              <div className="flex items-start gap-4">
                <img
                  src={secureIcon}
                  alt="Payment Secure"
                  className="w-6 h-6 sm:w-7 sm:h-7 "
                />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                    100% PAYMENT SECURE
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Payments secured with 256-bit encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" lg:px-0">
        {/* <div className="container mx-auto flex flex-col md:flex-row gap-8"> */}
        {/* women collection */}
        {/* <div className="relative flex-1">
          <img
            src={womensCollectionImage}
            alt="womens collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div> */}
        {/* mens collection */}
        {/* <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="mens collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div> */}
        {/* </div> */}
      </section>
    </>
  );
};

export default GenderCollectionSection;
