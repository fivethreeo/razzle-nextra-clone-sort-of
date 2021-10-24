import slugify from "@sindresorhus/slugify";
import cn from "classnames";
import "focus-visible";
import React, { useContext, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import topLevelPages from "./topLevelPages.js";
import MDXTheme from "./mdx-theme";
import MenuCbCallbackContext from "./menuContext.js";
import { ActiveSectionContext, PageSectionProvider } from "./PageSections";

function Menuu({ anchors }) {
  const [menuCbToggle, menuCbClose] = useContext(MenuCbCallbackContext);
  const activeSection = useContext(ActiveSectionContext);
  return (
    <nav
      className="[ nav ] [ site-head__nav ] [ font-sans ]"
      aria-label="Primary navigaton"
    >
      <ul className="nav__list">
        {anchors.map((anchor) => {
          const slug = slugify(
            (anchor.shortTitle || anchor.title || ["Untitled"]).join(" ") || ""
          );
          return (
            <li
              key={`a-${slug}`}
              className={cn({ active: slug === activeSection })}
            >
              <a
                href={"#" + slug}
                aria-current={slug === activeSection ? "page" : null}
                onClick={menuCbClose}
              >
                {(anchor.shortTitle || anchor.title || ["Untitled"]).map(
                  (part) => (
                    <span key={`a-${part}`}>{part}</span>
                  )
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
const Layout = ({ anchors, children }) => {
  const router = useLocation();
  const { pathname } = router;

  const currentIndex = useMemo(
    () => topLevelPages.findIndex((dir) => dir.path === pathname.slice(1)),
    [topLevelPages, pathname]
  );

  const title = topLevelPages[currentIndex]?.meta?.title || "Untitled";

  return (
    <>
      <PageSectionProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <main tabIndex="-1" id="main-content" className="flow flow-space-300">
          <MDXTheme>{children}</MDXTheme>
        </main>
      </PageSectionProvider>
    </>
  );
};

export default Layout;
