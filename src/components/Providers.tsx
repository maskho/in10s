"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider
        attribute="class"
        enableSystem
        defaultTheme="system"
        {...props}
      >
        <SessionProvider>{children}</SessionProvider>;
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
