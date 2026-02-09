import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => (
  <>
    <Header />
    <main className="pt-[65px] mx-auto flex flex-col  items-center min-h-[calc(100vh-160px)]">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default PublicLayout;
