import { Blend, Bot, History, House } from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const navItems: NavItem[] = [
  {
    icon: <House className="h-5 w-5 font-extralight" />,
    name: "Accueil",
    path: "/home",
  },
  {
    icon: <Bot className="h-5 w-5 font-extralight" />,
    name: "Générateur",
    path: "/generate",
  },
  {
    icon: <History className="h-5 w-5 font-extralight" />,
    name: "Historique",
    path: "/history",
  },

  {
    name: "Plus d'outil",
    icon: <Blend className="h-5 w-5 font-extralight" />,
    subItems: [{ name: "Voice to voice", path: "/voice", pro: true }],
  },
];
