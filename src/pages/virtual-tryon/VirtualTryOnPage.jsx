import React, { useState } from "react";
import img1 from "../../assets/images/ui/img1.png";
import img2 from "../../assets/images/ui/img2.png";
import img3 from "../../assets/images/ui/img3.png";
import t1 from "../../assets/images/ui/t1.png";
import t2 from "../../assets/images/ui/t2.png";
import t3 from "../../assets/images/ui/t3.png";
import ARscreen from "../../assets/images/ui/ARScreen.png";
import cart from "../../assets/images/ui/ShoppingCart.svg";
import trust from "../../assets/images/ui/Trash.svg";
import tryon from "../../assets/images/ui/ic_try_on_now_blk.svg";
import btncart from "../../assets/images/ui/cart.svg";
import like from "../../assets/images/ui/like.svg";
import ColorPicker from "../../components/products/ColorPicker";

export default function ProductPage() {
  console.log("Harshal 8");
  const [color, setColor] = useState("beige");

  const colors = [
    { id: "beige", className: "bg-[#e6dcc8]" },
    { id: "brown", className: "bg-[#3d332f]" },
    { id: "teal", className: "bg-[#79d4e3]" },
    { id: "pink", className: "bg-[#feb4c1]" },
    { id: "yellow", className: "bg-[#ffe76a]" },
  ];

  const mixStyles = [
    { id: 1, img: img1, title: "White Dress", brand: "Al Karam", reviews: "(4.1k) Customer Reviews" },
    { id: 2, img: img2, title: "Colorful Dress", brand: "Al Karam", reviews: "(4.1k) Customer Reviews" },
    { id: 3, img: img3, title: "White Dress", brand: "Al Karam", reviews: "(4.1k) Customer Reviews" },
  ];

  const tryOnList = [
    { id: 1, img: t1, name: "Kids beige woven...", price: "$26", size: "100cm", color: "#c0b6a3" },
    { id: 2, img: t2, name: "Flecked jacquard...", price: "$126", size: "60cm", color: "#a8a39a" },
    { id: 3, img: t3, name: "Chukka Leon Mens...", price: "$226", size: "20", color: "#5b4c39" },
  ];

  return (
       <div className="  grid grid-cols-1 md:grid-cols-2  ">
        <div>
            <img src={ARscreen} alt="" />
        </div>
      
      <div>
        <div className="w-full bg-white px-8 py-12 flex flex-col gap-[24px]">

      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-gray-400">Trousers</p>
        <h1 className="text-3xl font-semibold text-gray-900">Polo Plain trousers</h1>
        <p className="text-gray-600">1,238 Sold</p>

        <div className="flex items-center gap-3 mt-2">
          <span className="line-through text-gray-400 text-lg">$80.00</span>
          <span className="text-gray-900 text-2xl font-semibold">$58.00</span>
        </div>
      </div>
      <div>
        <p className="text-[18px] mb-2">Color</p> 
              <div className="mt-2">
                                <ColorPicker />
                              </div>
      </div>
      

      <div className="flex items-center justify-start w-full gap-2">
        <p className="text-gray-900 font-medium">Size</p>
        <button className="text-gray-700 underline text-sm">View Size Guide</button>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-700 text-gray-700 font-medium bg-white hover:bg-gray-100 transition shadow-sm">
          <span className="text-lg"><img src={tryon} alt="" /></span> Virtual Try-on!
        </button>

        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gray-900 to-orange-300 text-white font-medium shadow-md hover:opacity-90 transition">
          <span className="text-lg"><img src={btncart} alt="" /></span> Add to Cart
        </button>

        <button className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100">
          <img src={like} alt="" />
        </button>
      </div>

      <h2 className="font-normal text-[18px] text-[#2A2A2A]">Best mix style with</h2>

      <div className="flex items-start gap-6 overflow-x-auto pb-4">
        {mixStyles.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 w-[260px]"
          >
            <img src={item.img} className="w-full h-[260px] object-cover" />
            <div className="p-4 flex flex-col gap-2">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.brand}</p>
              <p className="text-gray-400 text-sm">{item.reviews}</p>
              <div className="flex justify-end w-full">
                <button className="text-gray-600 hover:text-gray-900">♡</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      

    </div>
    <div className="w-full bg-white  p-5 border border-[#ECEEF2] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-gray-900 font-normal">Try-on list</p>

          <div className="flex items-center gap-6">
            <button className="text-gray-900 font-medium flex items-center gap-2">
              <span className="text-lg"><img src={cart} alt="" /></span> Add list to cart
            </button>
            <button className="text-gray-400 hover:text-gray-600 text-normal flex items-center gap-2"><span><img src={trust} alt="" /></span> Remove all</button>
          </div>
        </div>

        <div className="flex items-start gap-4 overflow-x-auto">
          {tryOnList.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2     w-fit"
            >
              <img src={item.img} className="w-14 h-14 rounded-lg object-cover" />

              <div className="flex flex-col">
                <p className="text-gray-800 font-medium text-sm">{item.name}</p>
                

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600 text-[12px]">{item.price}</p>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <p className="text-gray-600 text-[12px]">Size: {item.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
       </div>
    
  );
}
