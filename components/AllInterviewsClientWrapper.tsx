"use client";
import dynamic from "next/dynamic";

const AllInterviewsClient = dynamic(() => import("@/components/AllInterviewsClient"), { ssr: false });

export default function AllInterviewsClientWrapper(props: any) {
  return <AllInterviewsClient {...props} />;
}
