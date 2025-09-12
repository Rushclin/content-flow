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
    </PublicLayout>
  );
};

export default Home;
