import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../common/ProtectedRoute";

const PrivateLayout = ({ role }) => (
  <ProtectedRoute role={role}>
    <Outlet />
  </ProtectedRoute>
);

export default PrivateLayout;
