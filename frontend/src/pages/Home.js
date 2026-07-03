import Navbar from "../components/Navbar";
import FeatureCard from "../components/Featurecard";

export default function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
  <div className="hero-content">
    {/* Just use the absolute path from the public folder */}
    <img 
      src="/pic/logo.png" 
      alt="EduMind Logo" 
      className="hero-logo" 
    />
    
    <div className="hero-text">
      <h1>EduMind Toolkit</h1>
      <p>Learn smarter. Plan better. Execute faster.</p>
    </div>
  </div>
</section>

      <section className="features">
        <FeatureCard
          title="PDF Key Points"
          desc="Upload PDFs and get instant key points"
        />
        <FeatureCard
          title="Quiz Generator"
          desc="Upload PDFs and get instant MCQS"
        />
        <FeatureCard
          title="Task Roadmap"
          desc="Create a step-by-step study roadmap"
        />
        
        <FeatureCard
          title="Code Explainer"
          desc="Upload the code and Get explaination "
        />
        
        <FeatureCard
          title="Resume Builder"
          desc="Upload details Generate Resume"
        />
        <FeatureCard
          title="More Tools"
          desc="New smart tools coming soon"
        />
      </section>
    </>
  );
}