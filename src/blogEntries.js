import React, { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import getDirectories from "./directories";

const directories = getDirectories();

const flatten = (list) => {
  return list.reduce((flat, toFlatten) => {
    return flat.concat(
      toFlatten.children.length
        ? [toFlatten].concat(flatten(toFlatten.children))
        : [toFlatten]
    );
  }, []);
};

const blogEntries = flatten([directories]);

export const BlogentriesList = () => {
  return (
    <ul>
      {blogEntries
        .filter((entry) => entry.component)
        .map((entry) => {
          return (
            <li key={`a-${entry.path}`}>
              <Link to={"/" + entry.path}>
                {entry.meta?.shortTitle || entry.meta?.title || "Untitled"}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default blogEntries;
