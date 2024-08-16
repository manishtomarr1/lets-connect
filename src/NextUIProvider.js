// src/NextUIProvider.js
"use client";
import { NextUIProvider } from "@nextui-org/react";

const NextUIProviderWrapper = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default NextUIProviderWrapper;
