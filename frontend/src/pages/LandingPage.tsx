import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Search, FileText, ChevronRight, Star, Shield, Cpu, Code2, Database } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  return (
    <div className="flex-1 w-full overflow-hidden relative pb-20">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] -left-[10%] w-[40%] h-[40%] bg-primary rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 z-10 w-full min-h-[90vh] flex flex-col justify-center">
        <div className="container mx-auto max-w-6xl text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-muted-foreground">Automata QA 2.0 is now live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-[1.1]"
          >
            Generate Tests <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/60">
              in Seconds with AI
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            Transform user stories and requirements into comprehensive regression, edge-case, and functional test protocols automatically. A Senior QA Engineer inside your browser.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-10px_rgba(124,58,237,0.7)] hover:-translate-y-1"
            >
              Start Generating Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a 
              href="#showcase" 
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-white/5 border border-white/10 text-foreground font-semibold text-lg hover:bg-white/10 transition-all"
            >
              See how it works
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl parallax-hero"
          >
            <div className="rounded-xl p-2 bg-white/5 border border-white/10 shadow-[0_0_100px_-20px_rgba(124,58,237,0.3)] backdrop-blur-xl">
              <div className="rounded-lg overflow-hidden border border-white/5 bg-background relative flex flex-col">
                <div className="bg-black/40 px-4 py-3 flex items-center space-x-2 border-b border-white/5 w-full absolute top-0 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm"></div>
                  <div className="mx-auto text-xs text-muted-foreground font-mono bg-white/5 px-24 py-1 rounded-md">automata-qa.app/workspace</div>
                </div>
                <div className="relative pt-10">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                    alt="Platform Dashboard" 
                    className="w-full h-auto object-cover opacity-80 filter contrast-125 saturate-150 hue-rotate-15 mix-blend-lighten"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Vision / Trusted By */}
      <section className="py-10 border-y border-white/5 bg-black/20 backdrop-blur-sm z-10 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">Trusted by innovative QA teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
             {/* Mock Company Logos using text for structural mockup */}
             <div className="flex items-center gap-2"><Cpu className="h-6 w-6"/> <span className="font-bold text-xl">TechFlow</span></div>
             <div className="flex items-center gap-2"><Shield className="h-6 w-6"/> <span className="font-bold text-xl">SecureNet</span></div>
             <div className="flex items-center gap-2"><Database className="h-6 w-6"/> <span className="font-bold text-xl">DataScale</span></div>
             <div className="flex items-center gap-2 hidden md:flex"><Code2 className="h-6 w-6"/> <span className="font-bold text-xl">DevSync</span></div>
          </div>
        </div>
      </section>

      {/* 3. Showcase Section */}
      <section id="showcase" className="py-24 relative z-10">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-white/10 bg-background/50 backdrop-blur-xl p-2 md:p-4 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {/* Authentic Dashboard UI Mockup */}
            <div className="aspect-video w-full bg-[#0a0a0a] rounded-xl border border-white/10 relative flex flex-col overflow-hidden text-left">
              {/* Window Header */}
              <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#111]">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-mono text-muted-foreground hidden sm:block">Automata QA Engine - Workspace</div>
                <div className="w-16"></div>
              </div>
              
              {/* App Body */}
              <div className="flex-1 flex flex-col md:flex-row">
                {/* Left: Input */}
                <div className="md:w-5/12 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 bg-[#0f0f0f] flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>User Story Input</span>
                  </div>
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-md p-4 font-mono text-xs sm:text-sm text-blue-300 leading-relaxed overflow-hidden relative">
                    <span className="text-muted-foreground">// Input</span><br/><br/>
                    As a user, I want to reset my password using my email address so that I can regain access if I forget it.<br/><br/>
                    <span className="text-purple-400">Acceptance Criteria:</span><br/>
                    - Must receive recovery link<br/>
                    - Link expires in 15 mins<br/>
                    - Cannot reuse last 3 passwords
                    
                    {/* Fake cursor pulse */}
                    <div className="absolute bottom-4 right-4 text-xs bg-white/10 px-2 py-1 rounded text-white font-sans animate-pulse flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-yellow-400" /> AI Processing
                    </div>
                  </div>
                </div>

                {/* Right: Output */}
                <div className="md:w-7/12 p-4 md:p-6 bg-black flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                      <Code2 className="w-4 h-4 text-green-400" />
                      <span>Generated Test Cases</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">21 Cases Found</span>
                  </div>
                  
                  {/* Fake Table */}
                  <div className="flex-1 border border-white/10 rounded-md overflow-hidden flex flex-col">
                    <div className="bg-[#1a1a1a] flex text-xs font-semibold text-muted-foreground border-b border-white/10 p-2">
                       <div className="w-16">ID</div>
                       <div className="flex-1">Scenario</div>
                       <div className="w-20">Type</div>
                    </div>
                    <div className="flex flex-col text-xs font-mono">
                      <div className="flex p-3 border-b border-white/5 hover:bg-white/5">
                        <div className="w-16 text-primary">TC-001</div>
                        <div className="flex-1 text-gray-300 truncate pr-2">Valid password reset flow with registered email</div>
                        <div className="w-20 text-green-400">Positive</div>
                      </div>
                      <div className="flex p-3 border-b border-white/5 hover:bg-white/5">
                        <div className="w-16 text-primary">TC-002</div>
                        <div className="flex-1 text-gray-300 truncate pr-2">Submit form with unregistered email address</div>
                        <div className="w-20 text-red-400">Negative</div>
                      </div>
                      <div className="flex p-3 border-b border-white/5 hover:bg-white/5">
                        <div className="w-16 text-primary">TC-003</div>
                        <div className="flex-1 text-gray-300 truncate pr-2">Clicking reset link after 16 minutes (Expiration)</div>
                        <div className="w-20 text-yellow-400">Edge</div>
                      </div>
                      <div className="flex p-3 hover:bg-white/5 opacity-50">
                        <div className="w-16 text-primary">TC-004</div>
                        <div className="flex-1 text-gray-300 truncate pr-2">Attempting to set new password to current password</div>
                        <div className="w-20 text-red-400">Negative</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="py-24 bg-black/20 border-t border-white/5 z-10 relative">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The ultimate testing engine</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to automate your QA processes without writing a single line of boilerplate.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0.1}
              icon={<Search className="h-8 w-8 text-blue-400" />}
              title="1. Parse Requirements"
              desc="Drop in any unformatted user story, JIRA ticket, or PR description."
            />
            <FeatureCard 
              delay={0.2}
              icon={<Zap className="h-8 w-8 text-purple-400" />}
              title="2. LLM Processing"
              desc="State of the art Cohere reasoning engine detects thousands of edge cases."
            />
            <FeatureCard 
              delay={0.3}
              icon={<FileText className="h-8 w-8 text-green-400" />}
              title="3. Review & Export"
              desc="Edit tests inline, view Extent-style reports, and export to JSON/CSV instantly."
            />
          </div>
        </div>
      </section>

      {/* 5. Client Reviews Marquee */}
      <section className="py-24 z-10 relative overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Loved by QA Engineers</h2>
          <p className="text-muted-foreground text-lg">Don't just take our word for it.</p>
        </div>
        
        {/* Infinite Scroll Wrapper */}
        <div className="relative flex overflow-hidden group w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex space-x-6 min-w-max px-4 group-hover:[animation-play-state:paused]"
          >
            {[
              { name: "Sarah Jenkins", role: "Lead QA @ TechFlow", img: "https://i.pravatar.cc/150?img=47", content: "Automata QA has cut our test creation time by 80%. We just paste Jira specs and get completely robust edge-case coverage." },
              { name: "Michael Rodriguez", role: "Senior SDET", img: "https://i.pravatar.cc/150?img=11", content: "The cinematic UI is gorgeous, but the Cohere integration is the real magic. It finds negative scenarios I would have completely missed." },
              { name: "Emily Chen", role: "Product Manager", img: "https://i.pravatar.cc/150?img=32", content: "I don't even write code, but I can generate full regression suites for our offshore team instantly. Absolute game changer." },
              { name: "David Kim", role: "QA Engineer", img: "https://i.pravatar.cc/150?img=15", content: "Finally, a tool that actually understands complex business logic. The exported JSON plugs right into our existing CI pipelines flawlessly." },
              { name: "Jessica Bloom", role: "CTO @ SaaSify", img: "https://i.pravatar.cc/150?img=5", content: "Our QA bottlenecks vanished overnight. The AI acts like a pair programmer that never sleeps and never misses an edge case." },
            ].concat([
              { name: "Sarah Jenkins", role: "Lead QA @ TechFlow", img: "https://i.pravatar.cc/150?img=47", content: "Automata QA has cut our test creation time by 80%. We just paste Jira specs and get completely robust edge-case coverage." },
              { name: "Michael Rodriguez", role: "Senior SDET", img: "https://i.pravatar.cc/150?img=11", content: "The cinematic UI is gorgeous, but the Cohere integration is the real magic. It finds negative scenarios I would have completely missed." },
              { name: "Emily Chen", role: "Product Manager", img: "https://i.pravatar.cc/150?img=32", content: "I don't even write code, but I can generate full regression suites for our offshore team instantly. Absolute game changer." },
              { name: "David Kim", role: "QA Engineer", img: "https://i.pravatar.cc/150?img=15", content: "Finally, a tool that actually understands complex business logic. The exported JSON plugs right into our existing CI pipelines flawlessly." },
              { name: "Jessica Bloom", role: "CTO @ SaaSify", img: "https://i.pravatar.cc/150?img=5", content: "Our QA bottlenecks vanished overnight. The AI acts like a pair programmer that never sleeps and never misses an edge case." },
            ]).map((review, i) => (
              <div key={i} className="w-[350px] md:w-[450px]">
                <ReviewCard {...review} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-24 bg-black/20 border-y border-white/5 z-10 relative">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <FAQItem 
              q="Does it integrate with JIRA?" 
              a="Currently, you can paste JIRA descriptions directly into the engine. Native two-way sync via Atlassian API is coming in Q3."
            />
            <FAQItem 
              q="What language models do you use?" 
              a="We rely on Cohere's Command-R-Plus architecture, specifically fine-tuned and prompted for Enterprise QA logic and deterministic JSON generation."
            />
            <FAQItem 
              q="Can I export the test cases?" 
              a="Yes! All test runs can be instantly exported to CSV or JSON formats for easy import into TestRail, Zephyr, or Xray."
            />
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="py-32 z-10 relative text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Ready to automate your QA setup?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of testers spending less time writing boilerplate and more time breaking things.</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center h-16 px-10 rounded-full bg-foreground text-background font-bold text-xl hover:bg-white/90 transition-transform hover:scale-105"
          >
            Go to App Dashboard
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// Subcomponents

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-start space-y-4 border border-white/10 hover:border-primary/50 transition-colors"
    >
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ReviewCard({ name, role, img, content }: { name: string, role: string, img: string, content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col space-y-4"
    >
      <div className="flex text-yellow-500 mb-2">
        <Star className="h-4 w-4 fill-current"/>
        <Star className="h-4 w-4 fill-current"/>
        <Star className="h-4 w-4 fill-current"/>
        <Star className="h-4 w-4 fill-current"/>
        <Star className="h-4 w-4 fill-current"/>
      </div>
      <p className="text-foreground/90 italic flex-1">"{content}"</p>
      <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
        <img src={img} alt={name} className="w-10 h-10 rounded-full bg-white/10" />
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-lg">{q}</span>
        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-2 text-muted-foreground border-t border-white/5 bg-black/20">
          {a}
        </div>
      )}
    </div>
  );
}
