import CarsSection from "../components/cars/CarsSection";
import Brands from "../components/cars/Brands";
import Hero from "../components/cars/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <CarsSection />
    </>
  );
}