import Hero from "@/app/components/landing/Hero";
import LevelsShowcase from "@/app/components/landing/LevelsShowcase";
import FeaturedTeachers from "@/app/components/landing/FeaturedTeachers";
import Features from "@/app/components/landing/Features";
import CallToAction from "@/app/components/landing/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <LevelsShowcase />
      <FeaturedTeachers />
      <Features />
      <CallToAction />
    </>
  );
}
