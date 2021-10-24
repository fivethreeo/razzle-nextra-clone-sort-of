import title from "title";

function convertToHierarchy(r, paths /* array of array of strings */) {
  // Build the node structure
  const rootNode = { name: "root", path: "", children: [], level: 0 };

  for (let path of paths) {
    buildNodeRecursive(r, rootNode, path.substring(2).split("/"), 0);
  }

  return rootNode;
}

function buildNodeRecursive(r, node, path, idx) {
  if (idx < path.length) {
    let fullPath = "./" + path.slice(0, idx + 1).join("/");
    const metaKey = fullPath.slice(0, fullPath.lastIndexOf("/"));
    const dirMetaKey = metaKey.slice(0, metaKey.lastIndexOf("/"));

    const meta =
      typeof metaMap[metaKey] !== "undefined" ? metaMap[metaKey] : {};
    let item = path[idx];
    let name = item.replace(/\.(mdx?|jsx?)$/, "");
    let dir = node.children.find((child) => child.name == item);
    if (!dir) {
      const mdxModule = /\.(mdx?|jsx?)$/.test(item) ? r(fullPath) : undefined;
      const itemMeta = normalizeMeta(
        meta[name],
        name,
        mdxModule ? mdxModule.frontMatter : {}
      );
      console.log(mdxModule ? mdxModule : "");

      if (!/index\.(mdx?|jsx?)$/.test(item)) {
        node.children.push(
          (dir = {
            level: idx + 1,
            name: name,
            path: fullPath
              .slice(2)
              .replace(/\.(mdx?|jsx?)$/, "")
              .replace(/^\d+\_/, ""),
            component: mdxModule ? mdxModule.default : mdxModule,
            headings: mdxModule ? mdxModule.headings : mdxModule,
            meta: itemMeta,
            children: []
          })
        );
      } else {
        console.log(mdxModule.default);
        node.component = mdxModule ? mdxModule.default : mdxModule;
        node.headings = mdxModule ? mdxModule.headings : mdxModule;
        node.meta = mdxModule ? mdxModule.frontMatter : {};
      }
      node.children.sort((a, b) => {
        // sorting every time, need better sort
        if (meta) {
          return (
            Object.keys(meta).indexOf(a.name) -
            Object.keys(meta).indexOf(b.name)
          );
        }
        // by default, we put directories first
        if (!!a.children !== !!b.children) {
          return !!a.children ? -1 : 1;
        }
        // sort by file name
        return a.name < b.name ? -1 : 1;
      });
    }
    buildNodeRecursive(r, dir, path, idx + 1);
  }
}

function normalizeMeta(meta, seg, frontMatter) {
  return Object.assign(
    typeof meta !== "undefined"
      ? typeof meta === "string"
        ? { title: meta }
        : meta
      : { title: title(seg.replace(/-/g, " ")) },
    frontMatter
  );
}
// watch all meta files
const metaMap = {};
function importAllMeta(r) {
  return r.keys().forEach((key) => {
    metaMap[key.slice(0, key.lastIndexOf("/"))] = r(key);
  });
}

// watch all module files

function importAllModules(r) {
  const Hierarchy = convertToHierarchy(r, r.keys());
  //  console.log(util.inspect(Hierarchy, {depth: null}))
  return Hierarchy;
}

importAllMeta(require.context("./pages/", true, /meta\.json$/));

const items = importAllModules(
  require.context("./pages/", true, /\.(mdx?|jsx?)$/)
);

export default () => {
  return items;
};
