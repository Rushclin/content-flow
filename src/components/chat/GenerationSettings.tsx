import React from "react";
import { appConfig } from "@/config/app";
import { Platform, Tone, Length } from "@/types/chat";
import { useTranslation } from "react-i18next";

interface GenerationSettingsProps {
  targetAudience: string;
  tone: Tone;
  length: Length;
  platform: Platform;
  onTargetAudienceChange: (value: string) => void;
  onToneChange: (value: Tone) => void;
  onLengthChange: (value: Length) => void;
  onPlatformChange: (value: Platform) => void;
}

const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  targetAudience,
  tone,
  length,
  platform,
  onTargetAudienceChange,
  onToneChange,
  onLengthChange,
  onPlatformChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t("generate.targetAudience", "Public cible")}
        </label>
        <select
          value={targetAudience}
          onChange={(e) => onTargetAudienceChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          title={t("generate.targetAudience", "Public cible")}
        >
          {appConfig.targetPeoples.map((people) => (
            <option key={people.value} value={people.value}>
              {people.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t("generate.tone", "Ton de la publication")}
        </label>
        <select
          value={tone}
          onChange={(e) => onToneChange(e.target.value as Tone)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          title={t("generate.tone", "Ton de la publication")}
        >
          {appConfig.pupblicationTonalities.map((tonality) => (
            <option key={tonality.value} value={tonality.value}>
              {tonality.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t("generate.length", "Longueur du contenu")}
        </label>
        <div className="grid grid-cols-3 gap-1">
          {(["courte", "moyenne", "longue"] as Length[]).map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => onLengthChange(len)}
              className={`px-2 py-1 text-xs font-medium rounded border transition-all ${
                length === len
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {len === "courte" ? "📝" : len === "moyenne" ? "📄" : "📚"} {len}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t("generate.platform", "Plateforme")}
        </label>
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value as Platform)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          title={t("generate.platform", "Plateforme")}
        >
          {appConfig.platforms.map((p) => (
            <option key={p.value} value={p.value.toLowerCase()}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GenerationSettings;
