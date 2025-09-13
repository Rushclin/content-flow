import { ArrowUpRight } from "lucide-react";
import React from "react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}

interface Props {
  item: FeatureItemProps;
}

const FeatureItem: React.FC<Props> = ({ item }) => {
  const { desc, icon, title, badge } = item;
  return (
    <div className="cursor-pointer relative bg-white p-6 hover:bg-slate-50 transition">
      <div className="text-2xl mb-3">{icon}</div>

      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <ArrowUpRight className="h-5 w-5 font-light text-slate-400" />
      </div>

      <p className="mt-2 text-sm text-slate-600">{desc}</p>

      {badge && (
        <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          {badge}
        </span>
      )}
    </div>
  );
};

export default FeatureItem;
