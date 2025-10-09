import {
  Blend,
  Bot,
  History,
  House,
  MessageCircleDashedIcon,
} from "lucide-react";

export type NavItem = {
  name: string;
  nameKey?: string; // Translation key for dynamic names
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; nameKey?: string; path: string; pro?: boolean; new?: boolean }[];
};

export const navItems: NavItem[] = [
  {
    icon: <House className="h-5 w-5 font-extralight" />,
    name: "Accueil",
    nameKey: "navigation.home",
    path: "/home",
  },
  {
    icon: <Bot className="h-5 w-5 font-extralight" />,
    name: "Générateur",
    nameKey: "navigation.generate",
    subItems: [
      { name: "Nouveau chat", nameKey: "generation.newGeneration", path: "/generate" },
      // { name: "Historique", path: "/generate/history" }
    ],
  },
  {
    icon: <MessageCircleDashedIcon className="h-5 w-5 font-extralight" />,
    name: "Chat",
    nameKey: "navigation.chat",
    path: "/chat",
  },
  {
    icon: <History className="h-5 w-5 font-extralight" />,
    name: "Historique",
    nameKey: "navigation.history",
    path: "/history",
  },

  {
    name: "Plus d'outil",
    nameKey: "navigation.moreTools",
    icon: <Blend className="h-5 w-5 font-extralight" />,
    subItems: [{ name: "Voice to voice", nameKey: "navigation.voiceToVoice", path: "/voice", pro: true }],
  },
];
