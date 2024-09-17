"use client";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/components/theme/theme-provider";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import AuthPage from "./auth/[[...rest]]/page";
import { Toaster } from "@/components/ui/sonner";
import "animate.css";
import { useEffect } from "react";

// Load Poppins font with specific weight and subset
const poppins = Poppins({
  subsets: ["latin"], // Define the subsets of the font to include
  weight: "300" // Define the font weight
});

// Root layout component for the application
export default function RootLayout({
  children
}: {
  children: React.ReactNode; // Children components to be rendered within the layout
}) {
  // Use useEffect to ensure the code runs only on the client-side
  useEffect(() => {
    const mainContainer = document.querySelector(".main");

    if (mainContainer) {
      // Add enter class to main container
      mainContainer.classList.add("page-enter");

      setTimeout(() => {
        mainContainer?.classList.add("page-enter-active");
      }, 10);

      // Handle page transitions when unloading
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        mainContainer.classList.remove("page-enter", "page-enter-active");
        mainContainer.classList.add("page-exit-active");

        event.preventDefault();
        setTimeout(() => {
          window.location.href = (event.target as HTMLAnchorElement).href;
        }, 500);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Clean up event listener when the component unmounts
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  return (
    <ConvexClientProvider>
      <html lang="en">
        <body
          className={`${poppins.className} flex flex-col w-full min-h-screen no-scrollbar`}
          // Apply Poppins font, flexbox layout, padding, gap, and custom styling
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            // Provides theme context and options for theme management
          >
            <TooltipProvider>
              {/* Display different content based on user's authentication status */}
              <SignedIn>
                {/* Main content for signed-in users */}
                <main className="h-full w-full flex gap-4">
                  {children} {/* Render children components */}
                </main>
              </SignedIn>
              <SignedOut>
                {/* Redirect to authentication page for signed-out users */}
                <AuthPage />
              </SignedOut>
            </TooltipProvider>
            {/* Toast notifications provider */}
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
