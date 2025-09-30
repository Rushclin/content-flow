import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon; // Icône Lucide passée en prop
  iconColor?: string; // couleur du texte de l'icône
  iconBg?: string; // couleur de fond de l'icône
  title: string; // titre du stat
  value: number | string; // valeur affichée
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
  title,
  value,
}) => {
  return (
    <div className="bg-white p-4 rounded-md border border-primary/30 shadow-xs">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${iconBg} rounded-md flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <div>
          <p className="text-xs text-slate-600">{title}</p>
          <p className="text-xl font-bold text-slate-900 recoleta">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
