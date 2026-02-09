import React from "react";
import OrderConfirmationPage from "../pages/orders/OrderConfirmationPage";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";
import MyOrdersPage from "../pages/orders/MyOrdersPage";
import BasicInfoPage from "../pages/profile/BasicInfoPage";
import AvatarBuilderPage from "../pages/profile/AvatarBuilderPage";
import EditAvatarPage from "../pages/profile/EditAvatarPage";

export const privateRoutes = [
  {
    path: "order-confirmation/:orderId",
    element: <OrderConfirmationPage />,
  },
  {
    path: "order/:id",
    element: <OrderDetailsPage />,
  },
  {
    path: "my-orders",
    element: <MyOrdersPage />,
  },
  {
    path: "basicinfo",
    element: <BasicInfoPage />,
  },
  {
    path: "avatarbuilder",
    element: <AvatarBuilderPage />,
  },
  {
    path: "edit-avatar",
    element: <EditAvatarPage />,
  },
];
