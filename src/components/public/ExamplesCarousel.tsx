import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExamplePost {
  id: number;
  image: string;
  title: string;
  description: string;
  platform: string;
}

const ExamplesCarousel = () => {
  const { t } = useTranslation("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const examples: ExamplePost[] = [
    {
      id: 1,
      image: "/images/post/1.jpeg",
      title:  "LinkedIn Post professionnel",
      description: 
        "Post optimisé pour l'engagement professionnel",
      platform: "LinkedIn",
    },
    {
      id: 2,
      image: "/images/post/brandbird.jpg",

      title:  "Contenu visuel attractif",
      description: "Design moderne et engageant",
      platform: "Instagram",
    },
    {
      id: 3,
      image: "/images/post/brandbird",
      title: "Post viral Twitter",
      description: "“L’avenir appartient à ceux qui allient vision et exécution.” — Chez Novalitix, on fait des idées une réalité.",
      platform: "Twitter",
    },
    {
      id: 4,
      image: "/images/post/brandbird.jpg",
      title:  "Contenu Facebook engageant",
      description: 
        "Post optimisé pour les interactions",
      platform: "Facebook",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === examples.length - 1 ? 0 : prevIndex + 1
    );
  }, [examples.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? examples.length - 1 : prevIndex - 1
    );
  }, [examples.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="w-full py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {t("examples.title", "Découvrez nos créations")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t(
              "examples.subtitle",
              "Des exemples concrets de posts générés avec ContentFlow. De l'idée à la publication, tout devient simple."
            )}
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-md shadow-sm bg-white">
            <div className="relative h-[500px] md:h-[600px]">
              {examples.map((example, index) => (
                <div
                  key={example.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 translate-x-0 scale-100"
                      : index < currentIndex
                      ? "opacity-0 -translate-x-full scale-95"
                      : "opacity-0 translate-x-full scale-95"
                  }`}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
                      <div className="relative w-full h-full max-w-md mx-auto">
                        <div className="relative bg-white rounded-md shadow-md p-0 h-full w-full">
                          <img
                            src={example.image}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit">
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                          <span className="font-semibold text-sm">
                            {example.platform}
                          </span>
                        </div>

                        <h3 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                          {example.title}
                        </h3>

                        <p className="text-lg text-slate-600 leading-relaxed">
                          {example.description}
                        </p>

                        <div className="space-y-3 pt-4">
                          {[
                            t("examples.features.ai", "✨ Généré par IA"),
                            t(
                              "examples.features.optimized",
                              "🎯 Optimisé pour l'engagement"
                            ),
                            t("examples.features.ready", "⚡ Prêt à publier"),
                          ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span className="text-slate-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? "bg-primary w-12 h-2"
                    : "bg-slate-300 hover:bg-slate-400 w-2 h-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-center mt-6">
            <span className="text-slate-600 font-medium">
              {currentIndex + 1} / {examples.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesCarousel;
