import { useState } from "react";

type Platform = "wordpress" | "twitter" | "facebook" | "linkedin" | "reddit";

interface GeneratedContent {
  title: string;
  content: string;
  images?: string[];
  videos?: string[];
}

export default function Home() {
  const [theme, setTheme] = useState("");
  const [details, setDetails] = useState("");
  const [platform, setPlatform] = useState<Platform>("wordpress");
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://automation.novalitix.com/webhook/generate-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            theme,
            details,
            platform,
          }),
        }
      );

      if (response.ok) {
        const { output } = await response.json();

        setGeneratedContent({ content: output, title: theme });
      } else {
        console.error("Erreur lors de la génération du contenu");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    console.log("Export PDF en cours...");
  };

  const exportToMarkdown = () => {
    if (!generatedContent) return;

    let markdown = `# ${generatedContent.title}\n\n${generatedContent.content}`;

    if (generatedContent.images?.length) {
      markdown += "\n\n## Images\n";
      generatedContent.images.forEach((img) => {
        markdown += `![Image](${img})\n`;
      });
    }

    if (generatedContent.videos?.length) {
      markdown += "\n\n## Vidéos\n";
      generatedContent.videos.forEach((video) => {
        markdown += `[Vidéo](${video})\n`;
      });
    }

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const publishContent = () => {
    console.log("Publication en cours...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          ContentFlow Toolbox
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Créer du contenu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thème
                </label>
                <input
                  id="theme"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le thème de votre contenu..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Détails
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajoutez des détails spécifiques..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="platform"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Plateforme
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="wordpress">WordPress</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="reddit">Reddit</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Génération en cours..." : "Générer le contenu"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Contenu généré
            </h2>

            {generatedContent ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {generatedContent.title}
                  </h3>
                  <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {generatedContent.content}
                  </div>
                </div>

                {generatedContent.images &&
                  generatedContent.images.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Images:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {generatedContent.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {generatedContent.videos &&
                  generatedContent.videos.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Vidéos:
                      </h4>
                      {generatedContent.videos.map((video, index) => (
                        <a
                          key={index}
                          href={video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline mb-1"
                        >
                          Vidéo {index + 1}
                        </a>
                      ))}
                    </div>
                  )}

                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    onClick={exportToPDF}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={exportToMarkdown}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Export MD
                  </button>
                  <button
                    onClick={publishContent}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Publier
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Aucun contenu généré pour le moment. Remplissez le formulaire et
                cliquez sur &quot;Générer le contenu&quot;.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
