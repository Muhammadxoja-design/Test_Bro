import React from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

type PageProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Page({ children, className }: PageProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const fadeTargets = rootRef.current?.querySelectorAll("[data-animate='fade']") ?? [];
      if (fadeTargets.length) {
        gsap.from(fadeTargets, {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08
        });
      }

      const cardTargets = rootRef.current?.querySelectorAll("[data-animate='card']") ?? [];
      if (cardTargets.length) {
        gsap.from(cardTargets, {
          opacity: 0,
          y: 22,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.1
        });
      }

      const lineTargets = rootRef.current?.querySelectorAll("[data-animate='line']") ?? [];
      if (lineTargets.length) {
        gsap.from(lineTargets, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.6,
          ease: "power2.out",
          delay: 0.05
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
