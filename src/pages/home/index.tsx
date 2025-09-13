import React from "react";
import DashboardLayout from "@/layout/dashboard";
import FeatureItem from "@/components/home/FeatureItem";
import { appConfig } from "@/config/app";

const HomePage = () => {
  return (
    <DashboardLayout title="Accueil">
      <div className="bg-white rounded-md border border-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-lg overflow-hidden">
          {appConfig.features.map((f, i) => (
            <FeatureItem item={f} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
