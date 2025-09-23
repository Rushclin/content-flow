import Footer from "@/components/public/Footer";
import FormGeneration from "@/components/public/FormGeneration";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import PublicLayout from "@/layout/public/PublicLayout";

const Home = () => {
  return (
    <PublicLayout title="Home">
      <Header />
      <Hero />
      <FormGeneration />
      <Footer/>
    </PublicLayout>
  );
};

export default Home;
