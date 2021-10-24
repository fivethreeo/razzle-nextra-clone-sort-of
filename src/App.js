import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.scss";
import routedPages from "./routedPages";
import Layout from "./layout";
import Menu from "./Menu";
import Blog from "./Blog";
import MenuCbCallbackContext from "./menuContext.js";

import { CSSTransition } from "react-transition-group";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuCbToggle = () => {
    setMenuOpen((state) => {
      return !state;
    });
  };

  const menuCbClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <a className="[ skip-link ] [ button ]" href="#main-content">
        Hopp til innhold
      </a>

      <div
        className={cn("site-wrap", {
          "menu-open": menuOpen
        })}
      >
        <MenuCbCallbackContext.Provider value={[menuCbToggle, menuCbClose]}>
          <header role="banner" className="site-head">
            <a
              href="/"
              aria-label="aquasecure - hjem"
              className="site-head__brand"
            ></a>
            <Menu />
            <FontAwesomeIcon
              onClick={menuCbToggle}
              icon={menuOpen ? faTimes : faBars}
              className="site-head__menutoggle"
            />
          </header>

          <Route key={"blog"} path={"/blog"} exact>
            {({ match }) => (
              <CSSTransition
                in={match != null}
                timeout={300}
                classNames="page"
                unmountOnExit
              >
                <div className="page">
                  <Layout anchors={routedPages[0].headings}>
                    <Blog />
                  </Layout>
                </div>
              </CSSTransition>
            )}
          </Route>
          {routedPages
            .filter((directory) => !!directory.component)
            .map((directory) => (
              <Route key={directory.path} path={"/" + directory.path} exact>
                {({ match }) => (
                  <CSSTransition
                    in={match != null}
                    timeout={300}
                    classNames="page"
                    unmountOnExit
                  >
                    <div className="page">
                      <Layout anchors={routedPages[0].headings}>
                        <directory.component />
                      </Layout>
                    </div>
                  </CSSTransition>
                )}
              </Route>
            ))}
        </MenuCbCallbackContext.Provider>
      </div>
    </>
  );
};

export default App;
