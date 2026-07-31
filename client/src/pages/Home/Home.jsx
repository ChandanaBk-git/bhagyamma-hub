import Hero from "../../components/home/Hero";
import HeroBanner from "../../components/home/HeroBanner";
import Intro from "../../components/home/Intro";
import ProductPreview from "../../components/home/ProductPreview";
import Features from "../../components/home/Features";
import WhyBhagyamma from "../../components/home/WhyBhagyamma";
import HowItWorks from "../../components/home/HowItWorks";
import MembershipBenefits from "../../components/home/MembershipBenefits";
import Testimonials from "../../components/home/Testimonials";
import CallToAction from "../../components/home/CallToAction";


const Home = () => {
  return (
    <>
      <HeroBanner />

      <Intro />

      <ProductPreview />

      <Features />

      <WhyBhagyamma />

      <HowItWorks />

      <MembershipBenefits/>



      <Testimonials/>

      <CallToAction/>

    </>
  );
};

export default Home;