import { TrendingUp, FileText, Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const StatsCards = () => {
  const { t } = useTranslation();
  
  const stats = [
    {
      name: t("dashboard.stats.generatedContent", "Contenus générés"),
      value: "24",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
      color: "purple"
    },
    {
      name: t("dashboard.stats.totalViews", "Vues totales"),
      value: "1,234",
      change: "+8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "blue"
    },
    {
      name: t("dashboard.stats.timeSaved", "Temps économisé"),
      value: "12h",
      change: "+2h",
      changeType: "positive",
      icon: Clock,
      color: "green"
    },
    {
      name: t("dashboard.stats.collaborators", "Collaborateurs"),
      value: "3",
      change: "+1",
      changeType: "positive",
      icon: Users,
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "from-purple-500 to-purple-600",
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      orange: "from-orange-500 to-orange-600"
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{t("dashboard.stats.vsLastMonth", "vs mois dernier")}</span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(stat.color)} rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
