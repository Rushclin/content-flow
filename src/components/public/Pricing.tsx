import { useState } from "react";
import { Check } from "lucide-react";
import Badge from "../common/Badge";
import { appConfig } from "@/config/app";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  // Plans traduits dynamiquement
  const getTranslatedPlans = () => {
    return appConfig.plans.map(plan => {
      const planKey = plan.name.toLowerCase();
      return {
        ...plan,
        name: t(`pricing.plans.${planKey}.name`, plan.name),
        description: t(`pricing.plans.${planKey}.description`, plan.description),
        badge: t(`pricing.plans.${planKey}.badge`, plan.badge),
        buttonText: t(`pricing.plans.${planKey}.buttonText`, plan.buttonText),
        features: plan.features.map(feature => 
          t(`pricing.plans.${planKey}.features.${feature}`, feature)
        ),
        limitations: plan.limitations?.map(limitation => 
          t(`pricing.plans.${planKey}.limitations.${limitation}`, limitation)
        ) || []
      };
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white" id="PricingSection">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 recoleta">
            {t("pricing.title", "Choisissez votre plan")}
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            {t("pricing.subtitle", "Des solutions adaptées à tous vos besoins de création de contenu IA")}
          </p>

          <div className="flex items-center justify-center space-x-4">
            <span
              className={`text-sm font-medium ${
                !isYearly ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {t("pricing.monthly", "Mensuel")}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? "bg-primary" : "bg-slate-300"
              }`}
              title={t("pricing.toggleBilling", "Basculer entre mensuel et annuel")}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isYearly ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {t("pricing.annual", "Annuel")}
            </span>
            <Badge title="-20% 🎉" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getTranslatedPlans().map((plan) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const yearlyTotal = plan.price.yearly * 12;
            const monthlyTotal = plan.price.monthly * 12;
            const savings = monthlyTotal - yearlyTotal;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "ring-2 ring-primary shadow-2xl scale-105"
                    : "ring-1 ring-slate-200 shadow-lg"
                } bg-white transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      ⭐ {t("pricing.mostPopular", "Le plus populaire")}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full ${
                        plan.popular ? "bg-primary/10" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          plan.popular ? "text-primary" : "text-slate-600"
                        }`}
                      />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2 recoleta">
                    {plan.name}
                  </h3>

                  <p className="text-slate-600 mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${plan.badgeColor}`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-slate-900">
                        {price}€
                      </span>
                      <span className="text-slate-600 ml-1">/mois</span>
                    </div>
                    {isYearly && plan.price.monthly > 0 && (
                      <div className="text-sm text-slate-500 mt-1">
                        Économisez {savings}€/an
                      </div>
                    )}
                    {!isYearly && plan.price.monthly > 0 && (
                      <div className="text-sm text-slate-500 mt-1">
                        {plan.price.monthly * 12}€ facturé annuellement
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations &&
                    plan.limitations.map((limitation, limitIndex) => (
                      <div
                        key={limitIndex}
                        className="flex items-start opacity-60"
                      >
                        <span className="h-5 w-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0">
                          ✗
                        </span>
                        <span className="text-slate-500 text-sm line-through">
                          {limitation}
                        </span>
                      </div>
                    ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-full cursor-pointer font-medium transition-all duration-200 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">
            {t("pricing.customSolution", "Besoin d'une solution sur mesure ?")}
          </p>
          <button className="bg-slate-800 text-white cursor-pointer px-8 py-3 rounded-full hover:bg-slate-900 transition-colors">
            {t("pricing.contactSales", "Contactez notre équipe commerciale")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
