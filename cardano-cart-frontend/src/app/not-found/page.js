export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import React from "react";

export default function NotFound() {
  redirect("/");
  return <div></div>;
}