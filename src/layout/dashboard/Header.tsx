import { useSidebar } from "@/context/SidebarContext";
import { PanelLeftOpen } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface HeaderProps {
  actions?: React.ReactNode;
}
const Header: React.FC<HeaderProps> = ({ actions }) => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-100">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10  z-100 lg:flex lg:h-11 lg:w-11 cursor-pointer"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <PanelLeftOpen className="h-5 w-5 text-slate-500 hover:text-slate-700 transition-colors" />
          </button>

          {/* {actions ? (
            actions
          ) : (
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
