import { useSidebar } from "@/context/SidebarContext";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Backdrop from "./Backdrop";

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) =>{
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <Sidebar/>
      <Backdrop/>
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        <Header/>
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout