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
    path: "/generate",
    // subItems: [
    //   { name: "Nouveau chat", nameKey: "generation.newGeneration", path: "/generate" },
    // ],
  },
  // {
  //   icon: <MessageCircleDashedIcon className="h-5 w-5 font-extralight" />,
  //   name: "Chat",
  //   nameKey: "navigation.chat",
  //   path: "/chat",
  // },
  {
    icon: <History className="h-5 w-5 font-extralight" />,
    name: "Historique",
    nameKey: "navigation.history",
    path: "/history",
  },

  // {
  //   name: "Plus d'outil",
  //   nameKey: "navigation.moreTools",
  //   icon: <Blend className="h-5 w-5 font-extralight" />,
  //   subItems: [{ name: "Voice to voice", nameKey: "navigation.voiceToVoice", path: "/voice", pro: true }],
  // },
];
