import FormGeneration from "@/components/public/FormGeneration";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import PublicLayout from "@/layout/PublicLayout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <PublicLayout>
      <Header />
      <Hero />
      <FormGeneration />
      
      {/* Section d'accès au dashboard */}
      <div className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à passer au niveau supérieur ? 🚀
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Accédez à votre dashboard personnel pour gérer tous vos contenus, 
            suivre vos performances et collaborer avec votre équipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Accéder au Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-200"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Home;
