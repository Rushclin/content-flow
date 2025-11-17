import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown, MessageSquare, Loader2 } from "lucide-react";
import Logo from "@/components/common/Logo";
import { NavItem, navItems } from "@/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { ConversationListItem } from "@/types/chat";

const Sidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [conversations, setConversations] = useState<ConversationListItem[]>(
    []
  );
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingConversations(true);
      try {
        const { data } = await axiosInstance.get<{
          data: ConversationListItem[];
        }>("/conversations");

        setConversations(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    fetchHistory();
  }, []);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>
                  {nav.nameKey ? t(nav.nameKey, nav.name) : nav.name}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>
                    {nav.nameKey ? t(nav.nameKey, nav.name) : nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.nameKey
                        ? t(subItem.nameKey, subItem.name)
                        : subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge bg-green-600`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge bg-slate-500 `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
                {isLoadingConversations && (
                  <li className="text-xs italic text-gray-400">
                    {t("sidebar.loading", "Chargement...")}
                  </li>
                )}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Logo
          justLogo={isExpanded || isHovered || isMobileOpen ? false : true}
          size={140}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="flex flex-col flex-1 pb-20">
          <div className="flex flex-col gap-4 mb-6">
            {renderMenuItems(navItems, "main")}
          </div>

          {(isExpanded || isHovered || isMobileOpen) && (
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="mb-3 px-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("sidebar.history", "Historique")}
                </h3>
              </div>

              {isLoadingConversations ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-400 italic">
                  {t("sidebar.noConversations", "Aucune conversation")}
                </div>
              ) : (
                <ul className="space-y-1 max-h-64 overflow-y-auto">
                  {conversations.slice(0, 10).map((conversation) => (
                    <li key={conversation.id}>
                      <Link
                        href={`/quick-off/${conversation.id}`}
                        className={`flex items-start gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === `/quick-off/${conversation.id}`
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="truncate flex-1">
                          {conversation.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {conversations.length > 10 && (
                <div className="mt-2 px-3">
                  <Link
                    href="/history"
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    {t("sidebar.viewAll", "Voir tout")} ({conversations.length})
                  </Link>
                </div>
              )}
            </div>
          )}

          <div
            className={`absolute ${
              isMobileOpen ? "bottom-24" : "bottom-5"
            } right-10`}
          >
            <span className="text-sm text-gray-600">{user?.name}</span>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
