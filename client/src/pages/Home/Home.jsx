import HeroBanner from "../../components/home/HeroBanner";
import MovingText from "../../components/home/MovingText";
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
      {/* TOP MARQUEE */}
      <MovingText direction="right" />

      {/* HERO BANNER */}
      <HeroBanner />

      {/* BOTTOM MARQUEE */}
      <MovingText direction="left" />

      {/* EXISTING HOME SECTIONS */}
      <Intro />
      <ProductPreview />
      <Features />
      <WhyBhagyamma />
      <HowItWorks />
      <MembershipBenefits />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;