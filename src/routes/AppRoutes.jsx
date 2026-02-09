import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import PrivateLayout from "../components/layout/PrivateLayout";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";

const renderRoutes = (routes) =>
  routes.map(({ path, element, index, ...rest }, idx) => (
    <Route
      key={path || `route-${idx}`}
      path={path}
      index={index}
      element={element}
      {...rest}
    />
  ));

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {renderRoutes(publicRoutes)}
        <Route element={<PrivateLayout />}>
          {renderRoutes(privateRoutes)}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
