const selectAll = require("unist-util-select").selectAll;
const valueToEstree = require("estree-util-value-to-estree").valueToEstree;

// please make sure you have installed these dependencies
// before proceeding further, or remove the require statements
// that you don't use

/**
 * This is a plugin for remark in mdx.
 * This should be a function that may take some options and
 * should return a function with the following signature
 * @param tree - the MDXAST
 * @param file - the file node
 * @return void - it should mutate the tree if needed
 */
module.exports = () => (tree, file) => {
  const sortedSections = selectAll("[name='PageSection']", tree);
  sortedSections.sort((a, b) => {
    return a.position.start.line - b.position.start.line;
  });

  const sections = sortedSections.map((node) => {
    const titleAttrs = (node.attributes || [])
      .filter((attr) => ["title", "shortTitle"].includes(attr.name))
      .map((attr) => [attr.name, attr.value.split("|")]);
    return Object.fromEntries(titleAttrs);
  });
  console.log(sections);

  tree.children.push({
    type: "mdxjsEsm",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ExportNamedDeclaration",
            source: null,
            specifiers: [],
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name: "headings" },
                  init: valueToEstree(sections)
                }
              ]
            }
          }
        ]
      }
    }
  });
};
