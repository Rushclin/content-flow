import { Building, Star, Zap } from "lucide-react";

export const appConfig = {
  name: "Content Flow Toolbox",
  description: "Generate content fastly",
  targetPeoples: [
    {
      value: "Professionnels",
      label: "💼 Professionnels",
    },
    {
      value: "Étudiants",
      label: "🎓 Étudiants",
    },
    {
      value: "Entrepreneurs",
      label: "🚀 Entrepreneurs",
    },
    {
      label: "Grand public",
      value: "👥 Grand public",
    },
  ],
  pupblicationTonalities: [
    {
      value: "professionnel",
      label: "💼 Professionnels",
    },
    {
      value: "amical",
      label: "😊 Amical",
    },
    {
      value: "formel",
      label: "🎩 Formel",
    },
    {
      value: "décontracté",
      label: "😎 Décontracté",
    },
  ],
  platforms: [
    {
      value: "LinkedIn",
      label: "💼 LinkedIn",
    },
    {
      value: "Facebook",
      label: "📘 Facebook",
    },
    {
      value: "Twitter/X",
      label: "🐦 Twitter/X",
    },
    {
      value: "WordPress",
      label: "📝 WordPress",
    },
    {
      value: "Reddit",
      label: "🤖 Reddit",
    },
  ],
  features: [
    {
      icon: "📰",
      title: "News Article Generator",
      desc: "Generate professional news articles on various topics.",
      badge: "Paid plans only",
      category: "content",
    },
    {
      icon: "💬",
      title: "Chat with MARKy",
      desc: "Easily create content by just chatting with AI.",
      category: "HR",
    },
    {
      icon: "🎤",
      title: "AI Text-to-Speech",
      desc: "Generate audio from text using AI. Supports 30+ languages.",
      category: "musique",
    },
    {
      icon: "🖼️",
      title: "AI Art & Images",
      desc: "Generate stunning images and art with AI. Express ideas. Stand out.",
    },
    {
      icon: "🎥",
      title: "AI Video Generator",
      desc: "Create videos with AI. Transform text or images into engaging video content.",
    },
    {
      icon: "🗣️",
      title: "AI Talking Videos",
      desc: "Upload an image, enter text, and create realistic talking videos with AI.",
    },
    {
      icon: "📷",
      title: "AI Photo Generator",
      desc: "Generate realistic photos with AI. Create custom images for any purpose.",
      badge: "New",
    },
    {
      icon: "👤",
      title: "AI Headshot Generator",
      desc: "Generate professional headshots with AI. For LinkedIn, email signatures, and more.",
      badge: "New",
    },
    {
      icon: "👤",
      title: "AI Headshot Generator",
      desc: "Generate professional headshots with AI. For LinkedIn, email signatures, and more.",
      badge: "New",
    },
  ],
  plans: [
    {
      name: "Basique",
      description: "Parfait pour débuter avec l'IA",
      icon: Star,
      price: {
        monthly: 0,
        yearly: 0,
      },
      badge: "Gratuit",
      badgeColor: "bg-green-100 text-green-800",
      features: [
        "5 générations de contenu/jour",
        "Chat avec MARKy (limité)",
        "Templates de base",
        "Export en format texte",
        "Support communautaire",
        "Watermark sur les images",
      ],
      limitations: [
        "Pas d'export avancé",
        "Pas de support prioritaire",
        "Fonctionnalités limitées",
      ],
      buttonText: "Commencer gratuitement",
      buttonStyle: "bg-slate-600 hover:bg-slate-700 text-white",
      popular: false,
    },
    {
      name: "Individuel",
      description: "Idéal pour les professionnels créatifs",
      icon: Zap,
      price: {
        monthly: 19,
        yearly: 15, // 19 * 12 * 0.8 / 12 = 15.2 ≈ 15€/mois
      },
      badge: "Populaire",
      badgeColor: "bg-primary text-white",
      features: [
        "Générations illimitées",
        "Chat avec MARKy complet",
        "Tous les templates premium",
        "AI Text-to-Speech (30+ langues)",
        "AI Art & Images (sans watermark)",
        "AI Video Generator",
        "Export en tous formats",
        "Support prioritaire par email",
        "Historique des projets",
        "API Access (100 req/jour)",
      ],
      buttonText: "Commencer l'essai gratuit",
      buttonStyle: "bg-primary hover:bg-blue-700 text-white",
      popular: true,
    },
    {
      name: "Entreprise",
      description: "Solution complète pour les équipes",
      icon: Building,
      price: {
        monthly: 49,
        yearly: 39, // 49 * 12 * 0.8 / 12 = 39.2 ≈ 39€/mois
      },
      badge: "Pro",
      badgeColor: "bg-secondary text-slate-800",
      features: [
        "Tout du plan Individuel",
        "Gestion d'équipe (jusqu'à 10 utilisateurs)",
        "AI Talking Videos",
        "AI Photo Generator",
        "AI Headshot Generator",
        "News Article Generator",
        "Branding personnalisé",
        "API Access illimité",
        "Support téléphonique dédié",
        "Formation personnalisée",
        "Intégrations avancées",
        "Rapports d'utilisation détaillés",
      ],
      buttonText: "Contactez-nous",
      buttonStyle: "bg-secondary hover:bg-yellow-500 text-slate-800",
      popular: false,
    },
  ],
  footer: {
    description:
      "est votre plateforme tout-en-un pour la génération de contenu IA. Créez facilement du contenu professionnel avec nos outils d'intelligence artificielle avancés pour tous vos besoins créatifs et marketing.",
  },
};
