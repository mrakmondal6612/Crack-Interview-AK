import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="root-layout min-h-screen flex flex-col bg-dark-950">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6 pt-[72px]">
        {children}
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
