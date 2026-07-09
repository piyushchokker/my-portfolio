import HeroSection from "../Components/HeroSection";
import NavBar from "../Components/NavBar";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 selection:bg-white selection:text-zinc-950">
      <HeroSection />
      <NavBar />
    </div>
  );
}

export default HomePage;
