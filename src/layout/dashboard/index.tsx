import { useSidebar } from "@/context/SidebarContext";
import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Backdrop from "./Backdrop";
import Head from "next/head";
import { appConfig } from "@/config/app";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  description,
  title,
  actions,
}) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  useEffect(() => {
    if (!isLoading) if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, isLoading]);
  return (
    <div className="min-h-screen xl:flex">
      <Head>
        <title>
          {title ? `${title} -- ${appConfig.name}` : `${appConfig.name}`}
        </title>

        <meta
          name="description"
          content={description || appConfig.description}
        />

        <meta property="og:title" content={title || appConfig.name} />
        <meta
          property="og:description"
          content={description || appConfig.description}
        />
        <meta property="og:type" content="website" />
      </Head>

      <Sidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        <Header actions={actions} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
      <LanguageSwitcher className="bottom-5 z-70" />
    </div>
  );
};

export default DashboardLayout;
