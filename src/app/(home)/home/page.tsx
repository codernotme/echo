"use client";
import React, { useState } from "react";
import SideNavR from "@/components/common/SideNavR";
import PostPage from "./post-page";

export default function Home() {
  return (
    <>
      <div className="w-full">
        <PostPage />
      </div>
      {/*      <SideNavR />
       */}
    </>
  );
}
