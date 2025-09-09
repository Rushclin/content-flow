import { Plus, FileText, BarChart3, Users, Settings, Zap } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      name: "Nouveau contenu",
      description: "Créer un nouveau contenu",
      icon: Plus,
      color: "purple",
      href: "#"
    },
    {
      name: "Templates",
      description: "Modèles prédéfinis",
      icon: FileText,
      color: "blue",
      href: "#"
    },
    {
      name: "Analytics",
      description: "Voir les statistiques",
      icon: BarChart3,
      color: "green",
      href: "#"
    },
    {
      name: "Équipe",
      description: "Gérer l'équipe",
      icon: Users,
      color: "orange",
      href: "#"
    },
    {
      name: "Paramètres",
      description: "Configuration",
      icon: Settings,
      color: "gray",
      href: "#"
    },
    {
      name: "IA Avancée",
      description: "Outils IA premium",
      icon: Zap,
      color: "yellow",
      href: "#"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "from-purple-500 to-purple-600",
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      orange: "from-orange-500 to-orange-600",
      gray: "from-gray-500 to-gray-600",
      yellow: "from-yellow-500 to-yellow-600"
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
        <p className="text-sm text-gray-600">Accès rapide aux fonctionnalités</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="group p-4 text-left rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-purple-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getColorClasses(action.color)} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                      {action.name}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
