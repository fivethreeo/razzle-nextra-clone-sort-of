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

const routedPages = flatten([directories]).filter(
  (directory) => !directory?.meta?.noRoute
);

export default routedPages;
