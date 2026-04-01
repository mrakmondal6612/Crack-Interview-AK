import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import RootLayoutClient from "./layout.client";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <RootLayoutClient>
        {children}
      </RootLayoutClient>
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Layout;
