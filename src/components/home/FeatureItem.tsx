import { ArrowUpRight, LucideProps } from "lucide-react";
import { useRouter } from "next/router";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

interface FeatureItemProps {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  desc: string;
  badge?: string;
  category?: string;
  href?: string;
}

interface Props {
  item: FeatureItemProps;
}

const FeatureItem: React.FC<Props> = ({ item }) => {
  const { desc, icon, title, badge, href } = item;

  const Icon = icon;

  const router = useRouter();

  return (
    <div
      className="cursor-pointer relative bg-white p-6 hover:bg-primary/10 transition"
      onClick={() => href && router.push(href)}
    >
      <div className="text-2xl mb-3">
        <Icon />
      </div>

      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <ArrowUpRight className="h-5 w-5 text-slate-400" />
      </div>

      <p className="mt-2 text-sm text-slate-600">{desc}</p>

      {badge && (
        <span className="absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full bg-primary text-white">
          {badge}
        </span>
      )}
    </div>
  );
};

export default FeatureItem;
