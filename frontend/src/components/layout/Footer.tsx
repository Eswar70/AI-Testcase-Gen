import { Link } from 'react-router-dom';
import { BeakerIcon, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <BeakerIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">Automata QA</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering enterprise QA teams to generate edge-case and functional regression suites instantly using advanced LLMs.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Test Generator</Link></li>
              <li><Link to="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:support@automataqa.com" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Automata QA Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
