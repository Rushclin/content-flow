import React, { useMemo } from "react";
import DashboardLayout from "@/layout/dashboard";
import FeatureItem from "@/components/home/FeatureItem";
import { appConfig } from "@/config/app";
import { Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/InputForm";

// Schéma de validation pour les filtres
const filterSchema = z.object({
  search: z.string(),
  category: z.string(),
});

type FilterFormData = z.infer<typeof filterSchema>;

const HomePage = () => {
  // Extraction des catégories uniques depuis les features
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

  // Logique de filtrage
  const filteredFeatures = useMemo(() => {
    return appConfig.features.filter((feature) => {
      // Filtrage par recherche
      const matchesSearch =
        searchTerm === "" ||
        feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.desc.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtrage par catégorie
      const matchesCategory =
        selectedCategory === "all" ||
        feature.category === selectedCategory ||
        (selectedCategory === "uncategorized" && !feature.category);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setValue("category", category);
  };

  const clearFilters = () => {
    setValue("search", "");
    setValue("category", "all");
  };

  return (
    <DashboardLayout title="Accueil">
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
          <Input
            {...register("search")}
            type="text"
            placeholder="Rechercher des fonctionnalités..."
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
            Tout ({appConfig.features.length})
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
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {categoryCount})
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

        <div className="text-sm text-gray-600">
          {filteredFeatures.length === appConfig.features.length
            ? `${filteredFeatures.length} fonctionnalités au total`
            : `${filteredFeatures.length} résultat${
                filteredFeatures.length > 1 ? "s" : ""
              } sur ${appConfig.features.length} fonctionnalités`}
        </div>
      </div>

      {filteredFeatures.length > 0 ? (
        <div className="bg-white rounded-md border border-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-lg overflow-hidden">
            {filteredFeatures.map((f, i) => (
              <FeatureItem key={i} item={f} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune fonctionnalité trouvée
          </h3>
          <p className="text-gray-600 mb-4">
            Aucune fonctionnalité ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={clearFilters}
            className="bg-slate-500 text-white px-4 py-2 hover:bg-slate-600 transition-colors rounded-full"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HomePage;
