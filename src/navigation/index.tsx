import {
  Bot,
  History,
  House,
} from "lucide-react";

export type NavItem = {
  name: string;
  nameKey?: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    nameKey?: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

export const navItems: NavItem[] = [
  {
    icon: <House className="h-5 w-5 font-extralight" />,
    name: "Accueil",
    nameKey: "navigation.home",
    path: "/dashboard",
  },
  {
    icon: <Bot className="h-5 w-5 font-extralight" />,
    name: "Générateur",
    nameKey: "navigation.generate",
    path: "/quick-off",
  },
  {
    icon: <History className="h-5 w-5 font-extralight" />,
    name: "Historique",
    nameKey: "navigation.history",
    path: "/history",
  },
];
