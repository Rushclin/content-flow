import React from "react";
import { useTranslation } from "react-i18next";

const aboutUsPoints = [
  {
    key: "unlimitedCreativity",
    emoji: "🌟",
  },
  {
    key: "cuttingEdgeTechnology",
    emoji: "⚙️",
  },
  {
    key: "savePreciousTime",
    emoji: "🕒",
  },
  {
    key: "builtForCreators",
    emoji: "🤝",
  },
  {
    key: "publishEverywhere",
    emoji: "🌍",
  },
  {
    key: "securityPrivacy",
    emoji: "🔒",
  },
];

const AboutUs = () => {
  const { t } = useTranslation("home");
  return (
    <div id="Solutions" className="text-center my-10 mx-auto max-w-5xl p-3 pt-15">
      <h3 className="text-xl md:text-4xl max-w-2xl mx-auto my-10 text-slate-700">
        All-in-one platform to create and share generated content.
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl mx-auto">
        {aboutUsPoints.map((point, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 border border-slate-200 transition-all duration-300 hover:border-slate-500"
          >
            <h3 className="text-xl font-semibold text-slate-800 flex items-center justify-center gap-2">
              {t(`aboutUs.points.${point.key}.title`)}
            </h3>
            <p className="text-slate-500 mt-3">
              {t(`aboutUs.points.${point.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
