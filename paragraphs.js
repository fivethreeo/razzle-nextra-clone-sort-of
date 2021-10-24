const visit = require("unist-util-visit");

module.exports = unwrapMdxBlockElements;

const mdxBlockElementStr = "mdxJsxFlowElement";
const paragraphStr = "paragraph";

const splice = [].splice;

function unwrapMdxBlockElements() {
  return transform;
}

function transform(tree) {
  visit(tree, visitor);
}

function shouldChildStayWrapped([{ children = [] }, { attributes } = {}]) {
  if (children.length && /h\d|p|figure/.test(children[0].name)) {
    return false;
  }

  // if (!Array.isArray(attributes)) {
  //   return false
  // }

  // const iil = attributes.length

  // for (let ii = 0; ii < iil; ++ii) {
  //   const {
  //     type,
  //     name,
  //     value,
  //   } = attributes[ii]

  //   if ((
  //     type === 'mdxJsxAttribute' &&
  //     name === 'noUnwrap' &&
  //     value &&
  //     value.type === 'mdxValueExpression' &&
  //     value.value === 'true'
  //   )) {
  //     return true
  //   }
  // }

  return true;
}

function visitor(node, index, parent) {
  // if there are children available keep diving into them
  if (Array.isArray(node.children)) {
    node.children.forEach(function (child) {
      visit(child, visitor);
    });
  }

  // if an mdxBlockElement has a paragraph as a child, remove the paragraph layer
  if (
    node.type === paragraphStr &&
    parent &&
    parent.type === mdxBlockElementStr
  ) {
    // but don't remove the paragraph layer if the parent mdxBlockElement has
    // `noUnwrap={true}` in their props/attributes
    if (shouldChildStayWrapped([node, parent])) {
      return;
    }

    splice.apply(parent.children, [index, 1].concat(node.children));
    return [visit.SKIP, index];
  }
}
