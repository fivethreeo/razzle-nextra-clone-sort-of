import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  useEffect
} from "react";

import { useInView } from "react-intersection-observer";
import slugify from "@sindresorhus/slugify";

export const ActiveSectionCallbackContext = createContext();

export const ActiveSectionContext = createContext();

export const PageSectionProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(false);
  return (
    <ActiveSectionCallbackContext.Provider value={setActiveSection}>
      <ActiveSectionContext.Provider value={activeSection}>
        {children}
      </ActiveSectionContext.Provider>
    </ActiveSectionCallbackContext.Provider>
  );
};

export const PageSection = ({ title, shortTitle, ...props }) => {
  const id = slugify(
    (shortTitle || title || "Undefined Title").replace(/\|/, " ")
  );
  const setActiveSection = useContext(ActiveSectionCallbackContext);
  const [ref, inView, entry] = useInView({
    threshold: 0.2,
    rootMargin: "-250px 0px 0px 0px"
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(id);
      console.log(id);
    }
  }, [inView]);

  return <div id={id} ref={ref} {...props} />;
};
