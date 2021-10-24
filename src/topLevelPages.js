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

const topLevelPages = flatten([directories]).filter((directory) =>
  [0, 1].includes(directory.level)
);

export default topLevelPages;
