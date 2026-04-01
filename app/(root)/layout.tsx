import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import RootLayoutClient from "./layout.client";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RootLayoutClient>
      {children}
      <ReviewsSection />
      <Footer />
    </RootLayoutClient>
  );
};

export default Layout;
