import { useEffect } from 'react';

const useScrollEffects = (
  setBackgroundColor: (value: string) => void,
  setIsVisible: (value: boolean) => void,
) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) / 2;

      const minAlpha = 0.1;
      const maxAlpha = 1;
      const newAlpha = Math.min(
        maxAlpha,
        (scrollTop / maxScroll) * (maxAlpha - minAlpha) + minAlpha,
      );
      setBackgroundColor(`rgba(0, 0, 0, ${newAlpha})`);

      const element = document.querySelector('.scroll-aware');
      if (element) {
        const rect = element.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        setIsVisible(rect.top > viewportCenter);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setBackgroundColor, setIsVisible]);
};

const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  setIsInView: (value: boolean) => void,
  threshold = 0.5,
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold,
    });

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [ref, setIsInView, threshold]);
};

export { useIntersectionObserver, useScrollEffects };
