import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import Header from "@/components/Header";

const Layout = ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  const user = getCurrentUser();

  return (
    <div className="root-layout min-h-screen flex flex-col bg-dark-950">
      <Header user={user} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6 pt-[72px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
