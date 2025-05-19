import Link from "next/link";
import React from "react";
import ThemeLogo from "../theme-logo";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10">
                <ThemeLogo width={18} height={18} alt="Quizify logo" />
              </div>
              <span className="font-semibold text-lg">Quizify</span>
            </div>
            <p className="text-muted-foreground mb-4">
              The ultimate platform for creating, taking, and sharing quizzes.
              Challenge your mind and expand your knowledge.
            </p>
            <div className="flex space-x-4">
              {["twitter", "facebook", "instagram", "linkedin"].map(
                (social) => (
                  <Link
                    key={social}
                    href={`https://${social}.com`}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="sr-only">{social}</span>
                      {/* Social icons would go here */}
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Testimonials", "FAQ", "Roadmap"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Blog", "Documentation", "Help Center", "API", "Community"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Careers", "Contact", "Privacy", "Terms"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Quizify. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
