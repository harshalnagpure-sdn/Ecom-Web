import React from "react";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import CollectionPage from "../pages/products/CollectionPage";
import ProductDetails from "../components/products/ProductDetails";
import WelcomeScreen from "../pages/home/WelcomeScreen";
import VirtualTryOnPage from "../pages/virtual-tryon/VirtualTryOnPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AboutUsPage from "../pages/info/AboutUsPage";
import CareersPage from "../pages/info/CareersPage";
import TryOnFooterPage from "../pages/virtual-tryon/TryOnFooterPage";
import AIStylistPage from "../pages/ai-stylist/AIStylistPage";
import AIStylingQuizPage from "../pages/ai-stylist/AIStylingQuizPage";
import DigitalResponsibility from "../pages/info/DigitalResponsibility.jsx";
import Faqs from "../pages/info/Faqs.jsx";
import SecurityAndData from "../pages/info/SecurityAndData.jsx";
import TermsAndPrivacy from "../pages/info/TermsAndPrivacy.jsx";
import AnimationDemoPage from "../pages/demo/AnimationDemoPage.jsx";
import PayPalSuccessPage from "../pages/payment/PayPalSuccessPage";
import PayPalCancelPage from "../pages/payment/PayPalCancelPage";


export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "collections/:collection",
    element: <CollectionPage />,
  },
  {
    path: "product/:id", 
    element: <ProductDetails />,
  },
  {
    path:"welcome",
    element: <WelcomeScreen />
  },
  {
    path:"3Dtry-on",
    element: <VirtualTryOnPage />
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "aboutus",
    element: <AboutUsPage />,
  },
  {
    path : "careers",
    element: <CareersPage />,
  },
  {
    path : "virtualtryon",
    element: <TryOnFooterPage />,
  },
  {
    path : "aistylist",
    element: <AIStylistPage />,
  },
  {
    path : "aistylingquiz",
    element: <AIStylingQuizPage  />,
  },
  {
    path : "digitalresponsibility",
    element: <DigitalResponsibility  />,
  },
   {
    path : "faqs",
    element: <Faqs  />,
  },
   {
    path : "securityanddata",
    element: <SecurityAndData  />,
  },
  {
    path : "termsandprivacy",
    element: <TermsAndPrivacy  />,
  },
  {
    path : "animation-demo",
    element: <AnimationDemoPage  />,
  },
  {
    path: "payment/success",
    element: <PayPalSuccessPage />,
  },
  {
    path: "payment/cancel",
    element: <PayPalCancelPage />,
  },
];
