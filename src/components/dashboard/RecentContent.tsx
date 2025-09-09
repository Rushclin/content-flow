import { Clock, Eye, Heart, Share2, MoreVertical } from "lucide-react";

const RecentContent = () => {
  const recentContent = [
    {
      id: 1,
      title: "Les tendances marketing 2024",
      platform: "LinkedIn",
      tone: "Professionnel",
      length: "Moyenne",
      createdAt: "Il y a 2 heures",
      views: 24,
      likes: 8,
      shares: 3,
      isFavorite: true
    },
    {
      id: 2,
      title: "Comment améliorer sa productivité",
      platform: "Twitter",
      tone: "Amical",
      length: "Courte",
      createdAt: "Il y a 5 heures",
      views: 18,
      likes: 12,
      shares: 5,
      isFavorite: false
    },
    {
      id: 3,
      title: "Guide complet du marketing digital",
      platform: "Facebook",
      tone: "Formel",
      length: "Longue",
      createdAt: "Il y a 1 jour",
      views: 45,
      likes: 23,
      shares: 8,
      isFavorite: true
    },
    {
      id: 4,
      title: "Tips pour entrepreneurs",
      platform: "LinkedIn",
      tone: "Décontracté",
      length: "Moyenne",
      createdAt: "Il y a 2 jours",
      views: 32,
      likes: 15,
      shares: 6,
      isFavorite: false
    }
  ];

  const getPlatformColor = (platform: string) => {
    const colors = {
      LinkedIn: "bg-blue-100 text-blue-700",
      Twitter: "bg-sky-100 text-sky-700",
      Facebook: "bg-indigo-100 text-indigo-700",
      Instagram: "bg-pink-100 text-pink-700",
      WordPress: "bg-gray-100 text-gray-700"
    };
    return colors[platform as keyof typeof colors] || colors.LinkedIn;
  };

  const getToneColor = (tone: string) => {
    const colors = {
      Professionnel: "bg-purple-100 text-purple-700",
      Amical: "bg-green-100 text-green-700",
      Formel: "bg-gray-100 text-gray-700",
      Décontracté: "bg-orange-100 text-orange-700"
    };
    return colors[tone as keyof typeof colors] || colors.Professionnel;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Contenu récent</h3>
        <p className="text-sm text-gray-600">Vos dernières créations</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {recentContent.map((content) => (
          <div key={content.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate mb-2">
                  {content.title}
                </h4>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(content.platform)}`}>
                    {content.platform}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToneColor(content.tone)}`}>
                    {content.tone}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {content.length}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{content.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{content.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-3 h-3" />
                    <span>{content.shares}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{content.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <button className="w-full text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
          Voir tout l'historique
        </button>
      </div>
    </div>
  );
};

export default RecentContent;
