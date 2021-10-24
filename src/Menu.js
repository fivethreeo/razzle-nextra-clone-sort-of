import slugify from "@sindresorhus/slugify";
import cn from "classnames";
import React, { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import topLevelPages from "./topLevelPages.js";
import MenuCbCallbackContext from "./menuContext.js";

function Menu() {
  const [menuCbToggle, menuCbClose] = useContext(MenuCbCallbackContext);
  const router = useLocation();
  const { pathname } = router;

  const currentIndex = useMemo(
    () => topLevelPages.findIndex((dir) => dir.path === pathname.slice(1)),
    [topLevelPages, pathname]
  );
  const title = topLevelPages[currentIndex]?.meta?.title || "Untitled";
  const activeSection = slugify(title);
  return (
    <nav
      className="[ nav ] [ site-head__nav ] [ font-sans ]"
      aria-label="Primary navigaton"
    >
      <ul className="nav__list">
        {topLevelPages
          .filter((entry) => entry.component)
          .map((entry) => {
            const slug = slugify(
              entry.path !== ""
                ? entry.meta?.shortTitle ||
                    entry.meta?.title ||
                    "Untitled" ||
                    ""
                : ""
            );
            return (
              <li
                key={`a-${slug}`}
                className={cn({ active: slug === activeSection })}
              >
                <Link
                  to={"/" + slug}
                  aria-current={slug === activeSection ? "page" : null}
                  onClick={menuCbClose}
                >
                  {entry.meta?.shortTitle || entry.meta?.title || "Untitled"}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

export default Menu;
