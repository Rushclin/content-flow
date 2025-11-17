import React, { useMemo } from "react";
import DashboardLayout from "@/layout/dashboard";
import FeatureItem from "@/components/home/FeatureItem";
import { appConfig } from "@/config/app";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/Input";
import { useTranslation } from "react-i18next";

const filterSchema = z.object({
  search: z.string(),
  category: z.string(),
});

type FilterFormData = z.infer<typeof filterSchema>;

const HomePage = () => {
  const { t } = useTranslation();

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    appConfig.features.forEach((feature) => {
      if (feature.category) {
        uniqueCategories.add(feature.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, []);

  const { register, watch, setValue } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      category: "all",
    },
  });

  const searchTerm = watch("search");
  const selectedCategory = watch("category");

  const filteredFeatures = useMemo(() => {
    return appConfig.features
      .map((feature) => ({
        ...feature,
        title: t(
          `dashboard.home.features.${feature.title.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )}.title`,
          feature.title
        ),
        desc: t(
          `dashboard.home.features.${feature.title.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )}.desc`,
          feature.desc
        ),
        badge: t(
          `dashboard.home.features.${feature.title.replace(
            /[^a-zA-Z0-9]/g,
            ""
          )}.badge`,
          feature.badge || ""
        ),
      }))
      .filter((feature) => {
        const matchesSearch =
          searchTerm === "" ||
          feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feature.desc.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          feature.category === selectedCategory ||
          (selectedCategory === "uncategorized" && !feature.category);

        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, selectedCategory, t]);

  const handleCategoryClick = (category: string) => {
    setValue("category", category);
  };

  const clearFilters = () => {
    setValue("search", "");
    setValue("category", "all");
  };

  return (
    <DashboardLayout title={t("dashboard.home.title", "Accueil")}>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
          <Input
            {...register("search")}
            type="text"
            placeholder={t(
              "dashboard.home.searchPlaceholder",
              "Rechercher des fonctionnalités..."
            )}
            prefix={<Search className="h-5 w-5 text-gray-400" />}
            inputClassName="py-3"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("dashboard.home.all", "Tout")} ({appConfig.features.length})
          </button>

          {categories.map((category) => {
            const categoryCount = appConfig.features.filter(
              (f) => f.category === category
            ).length;

            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? "bg-slate-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t(
                  `dashboard.home.categories.${category}`,
                  category.charAt(0).toUpperCase() + category.slice(1)
                )}{" "}
                ({categoryCount})
              </button>
            );
          })}

          {appConfig.features.some((f) => !f.category) && (
            <button
              onClick={() => handleCategoryClick("uncategorized")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === "uncategorized"
                  ? "bg-slate-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Autres ({appConfig.features.filter((f) => !f.category).length})
            </button>
          )}
        </div>

        {/* <div className="text-sm text-gray-600">
          {filteredFeatures.length === appConfig.features.length
            ? t("dashboard.home.totalFeatures", "{{count}} fonctionnalités au total", { count: filteredFeatures.length })
            : t("dashboard.home.searchResults", "{{count}} résultat{{plural}} sur {{total}} fonctionnalités", { 
                count: filteredFeatures.length,
                plural: filteredFeatures.length > 1 ? "s" : "",
                total: appConfig.features.length
              })}
        </div> */}
      </div>

      {filteredFeatures.length > 0 ? (
        <div className="bg-white rounded-md border border-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 rounded-lg overflow-hidden">
            {filteredFeatures.map((f, i) => (
              <FeatureItem key={i} item={f} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t(
              "dashboard.home.noFeaturesFound",
              "Aucune fonctionnalité trouvée"
            )}
          </h3>
          <p className="text-gray-600 mb-4">
            {t(
              "dashboard.home.noFeaturesDescription",
              "Aucune fonctionnalité ne correspond à vos critères de recherche."
            )}
          </p>
          <button
            onClick={clearFilters}
            className="bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 transition-colors rounded-full"
          >
            {t("dashboard.home.resetFilters", "Réinitialiser les filtres")}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HomePage;
