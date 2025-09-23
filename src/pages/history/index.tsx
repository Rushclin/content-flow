import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/layout/dashboard";
import { Copy, Trash2, Download, Sparkles } from "lucide-react";

type HistoryMessage = {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  metadata?: { platform: string; tone: string; length: string };
};

const HistoryPage = () => {
  const [items, setItems] = useState<HistoryMessage[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cf_conversation_history");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Array<
        Omit<HistoryMessage, "timestamp"> & { timestamp: string }
      >;
      const withDates = parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      setItems(withDates);
    } catch (e) {
      console.error("Erreur de chargement de l'historique", e);
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem("cf_conversation_history");
    setItems([]);
  };

  const handleCopyAll = async () => {
    const text = items
      .map((m) => `${m.type === "user" ? "Vous" : "Content Flow"} (${m.timestamp.toLocaleString()}):\n${m.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
  };

  // Regrouper par date (AAAA-MM-JJ)
  const groupedByDay = useMemo(() => {
    const groups: Record<string, HistoryMessage[]> = {};
    for (const m of items) {
      const key = m.timestamp.toISOString().slice(0, 10);
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }
    // Conserver l'ordre d'origine
    return Object.entries(groups).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [items]);

  return (
    <DashboardLayout title="Historique">
      <div className="flex-1 overflow-hidden bg-white relative h-full">
        {/* En-tête collant avec actions */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Historique des conversations</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="px-3 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-1"
              >
                <Copy className="w-4 h-4" /> Copier tout
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-2 text-sm border rounded-lg text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Effacer
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-full px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Aucun historique pour le moment. Générez du contenu pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {groupedByDay.map(([day, messages]) => (
                  <div key={day}>
                    {/* Séparateur de jour */}
                    <div className="flex items-center gap-3 my-2">
                      <div className="h-px bg-gray-200 flex-1" />
                      <div className="text-xs text-gray-500">
                        {new Date(day).toLocaleDateString()}
                      </div>
                      <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <div className="space-y-6">
                      {messages.map((m, idx) => (
                        <div key={`${day}-${idx}`} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-3xl">
                            {m.type === 'user' ? (
                              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md px-6 py-4 shadow">
                                <div className="text-sm opacity-90 mb-1">
                                  Vous • {m.timestamp.toLocaleTimeString()}
                                </div>
                                <div className="text-lg font-medium whitespace-pre-line">{m.content}</div>
                                {m.metadata && (
                                  <div className="mt-2 text-xs opacity-90">
                                    <span className="bg-white/20 px-2 py-1 rounded-full mr-2">{m.metadata.platform}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-full mr-2">{m.metadata.tone}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-full">{m.metadata.length}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
                                    <div className="text-sm text-gray-500 mb-1">Content Flow • {m.timestamp.toLocaleTimeString()}</div>
                                    <div className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">{m.content}</div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 ml-11">
                                    <button
                                      onClick={() => navigator.clipboard.writeText(m.content)}
                                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                      <Copy className="w-4 h-4" /> Copier
                                    </button>
                                    <button
                                      onClick={() => {
                                        const blob = new Blob([m.content], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `contenu_${day}_${idx}.txt`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                      }}
                                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                      <Download className="w-4 h-4" /> Télécharger
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;


