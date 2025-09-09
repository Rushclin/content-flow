import { useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import ContentGenerator from "@/components/dashboard/ContentGenerator";
import RecentContent from "@/components/dashboard/RecentContent";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full space-y-6">
        {/* Header avec bienvenue */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenue dans votre espace créatif ! 👋
              </h1>
              <p className="text-gray-600">
                Créez du contenu captivant et gérez vos publications en toute simplicité.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">CFT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <StatsCards />

        {/* Contenu principal selon l'onglet actif */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Générateur de contenu */}
          <div className="xl:col-span-2">
            <ContentGenerator />
          </div>

          {/* Actions rapides et contenu récent */}
          <div className="space-y-6">
            <QuickActions />
            <RecentContent />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
