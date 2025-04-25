import { useState, useRef } from 'react';
import { useScrollEffects, useIntersectionObserver } from '@/hooks/home';
import { Button } from '@/components/home';
import { FramerItem } from '@/components/home';
import { CATEGORIES } from '@/lib/Categories';
import BgVideo from '@/assets/bg-video.mp4';
import Logo from '@/assets/images/logo.png';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

export const Landing: React.FC = () => {
  const animateTextElementRef = useRef(null);
  const { setSelectedCategory } = useStore();

  const [isInView, setIsInView] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>('rgba(0, 0, 0, 0.1)');

  useScrollEffects(setBackgroundColor, setIsVisible);
  useIntersectionObserver(animateTextElementRef, setIsInView);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] grayscale"
      >
        <source
          src={BgVideo}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 text-white px-12 py-5 mb-12">
        <section className="min-h-screen flex flex-col mix-blend-exclusion">
          <div className="fixed w-44 h-20">
            <img
              src={Logo}
              alt="logo"
              className="w-full h-full"
            />
          </div>
          <div className="flex-1 flex md:flex-col flex-col-reverse md:pt-14 pt-20 pb-14 justify-between">
            <div className="flex flex-col gap-4 items-end">
              <p className="max-w-sm text-end font-satoshi">
                Our mission is to provide the car community with every need to make your ride in
                your vision. No more having to search the web and social media ads for a slight
                chance of finding what you need. Mod Central is your solution to a one stop shop for
                all!
              </p>
              <Link to="/shop">
                <Button content="SHOP NOW" />
              </Link>
            </div>
            <div>
              <h1 className="md:text-9xl text-5xl text-center tracking-tight font-clash transparent-text">
                Your Car. Your mods.
              </h1>
              <div
                className={`px-5 py-3 border-b-[1px] border-gray-50/50 transition-opacity duration-300 ${
                  isVisible ? '' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="text-xs font-inter scroll-aware">Scroll to Explore</p>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex flex-col gap-6">
          <h2 className="text-start md:text-9xl text-5xl text-yellow-400 font-clash">
            Let's ride …
          </h2>
          <div className="w-full flex justify-end">
            <div className="md:max-w-xl max-w-full flex flex-col gap-4">
              <div className="flex gap-3 flex-wrap">
                <Button content="MAKE" />
                <Button content="MODEL" />
              </div>
              <div className="">
                <p className="font-satoshi md:text-4xl text-3xl">
                  Browse parts that are compatible with your car. Don't see what you like? Let us
                  know what you need and we will look to add it to our inventory.
                </p>
              </div>
            </div>
          </div>
          <div
            ref={animateTextElementRef}
            className="md:h-36 h-14 overflow-hidden"
          >
            <h2
              className={`text-center md:text-9xl text-5xl text-yellow-400 font-clash ${
                isInView ? 'animate-fadeInUp' : 'opacity-0'
              }`}
            >
              Categories
            </h2>
          </div>
          <div
            className="flex flex-col gap-14 justify-center items-center md:items-start px-3 xs:px-10 mx-auto"
            style={{ width: 'max-content' }}
          >
            {CATEGORIES.map((item) => (
              <FramerItem
                key={item.alt}
                item={item}
                onClick={() => setSelectedCategory(item.alt.toLowerCase())}
              />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
