
import React, { ReactNode } from 'react';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNativeInView } from '../hooks/useNativeInView';

const ScrollReveal = React.memo(({ children, delay = 0, active = true }: { children?: ReactNode, delay?: number, active?: boolean }) => {
  const [ref, isInView] = useNativeInView<HTMLDivElement>({ once: true, threshold: 0.1, rootMargin: '-100px' });

  return (
    <div
      ref={ref}
      style={{
        opacity: !active || isInView ? 1 : 0,
        transform: !active || isInView ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
});

const BenefitCard = ({ item, className = "" }: { item: any, className?: string }) => {
  return (
    <m.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`relative rounded-3xl overflow-hidden group shadow-xl cursor-pointer bg-slate-900 ${item.size === "large" ? "h-full" : "h-[280px]"} ${className}`}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-40"
      />
      {/* Dark Overlay - matching the screenshot's dark theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight transform group-hover:-translate-y-2 transition-transform duration-500 ease-out">
          {item.title}
        </h3>
        <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed transform group-hover:-translate-y-2 transition-transform duration-500 delay-100 ease-out">
          {item.desc}
        </p>
        
        {/* Subtle Arrow Indicator (as seen in screenshot) */}
        <div className="absolute bottom-8 right-8 text-white/30 group-hover:text-white transition-all duration-500 group-hover:translate-x-1">
          <ArrowRight size={20} />
        </div>
      </div>
    </m.div>
  );
};

const LearningBenefits = ({ benefitsData }: { benefitsData?: any[] }) => {
  const defaultBenefits = [
    {
      id: 1,
      title: "Lasak LMS Portal",
      desc: "with ready-to-access 10,000+ modules and practice tests",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
      size: "small"
    },
    {
      id: 2,
      title: "Coursera Access",
      desc: "with guidance for 30+ certifications and specializations",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
      size: "small"
    },
    {
      id: 3,
      title: "Industry Exposure Sessions",
      desc: "workshops and discussions with industry leaders",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
      size: "large"
    },
    {
      id: 4,
      title: "Placement & Career Support",
      desc: "assured interviews and dedicated career mentorship",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=800&auto=format&fit=crop",
      size: "small"
    },
    {
      id: 5,
      title: "Communication & Aptitude",
      desc: "intensive professional-grade soft skills training for workplace-readiness",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      size: "small"
    },
    {
      id: 6,
      title: "Real-world Projects",
      desc: "Guided, practice, and capstone projects from industry partners",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
      size: "small"
    }
  ];

  const benefits = (benefitsData && benefitsData.length > 0) ? benefitsData : defaultBenefits;

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Our Learning Ecosystem
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
              Experience a world-class training environment designed to accelerate your professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {benefits.map((benefit, idx) => (
              <BenefitCard 
                key={benefit.id || idx} 
                item={benefit} 
                className={benefit.size === 'large' ? 'md:row-span-2' : ''}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LearningBenefits;
