import { MDXProvider } from "@mdx-js/react";
import slugify from "@sindresorhus/slugify";
import { Link } from "react-router-dom";
import Highlight, { defaultProps } from "prism-react-renderer";
import { createContext } from "react";
import { PageSection } from "./PageSections";

const THEME = {
  plain: {
    color: "#000",
    backgroundColor: "transparent"
  },
  styles: [
    {
      types: ["keyword"],
      style: {
        color: "#ff0078",
        fontWeight: "bold"
      }
    },
    {
      types: ["comment"],
      style: {
        color: "#999",
        fontStyle: "italic"
      }
    },
    {
      types: ["string", "url", "attr-value"],
      style: {
        color: "#028265"
      }
    },
    {
      types: ["builtin", "char", "constant", "language-javascript"],
      style: {
        color: "#000"
      }
    },
    {
      types: ["attr-name"],
      style: {
        color: "#d9931e",
        fontStyle: "normal"
      }
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#333"
      }
    },
    {
      types: ["number", "function", "tag"],
      style: {
        color: "#0076ff"
      }
    },
    {
      types: ["boolean", "regex"],
      style: {
        color: "#d9931e"
      }
    }
  ]
};

// Anchor links

const HeaderLink = ({ tag: Tag, dataShort, children, ...props }) => {
  const slug = slugify(
    dataShort
      ? dataShort
      : children.map
      ? children.map((c) => (c.props ? c.props.children : "")).join(" ")
      : children || ""
  );
  return (
    <Tag {...props}>
      <span className="subheading-anchor" id={slug} />
      {children}
      <a href={"#" + slug} className="text-current no-underline no-outline">
        <span className="anchor-icon select-none" aria-hidden>
          #
        </span>
      </a>
    </Tag>
  );
};

const H1 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h1" {...props}>
      {children}
    </HeaderLink>
  );
};

const H2 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h2" {...props}>
      {children}
    </HeaderLink>
  );
};

const H3 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h3" {...props}>
      {children}
    </HeaderLink>
  );
};

const H4 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h4" {...props}>
      {children}
    </HeaderLink>
  );
};

const H5 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h5" {...props}>
      {children}
    </HeaderLink>
  );
};

const H6 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h6" {...props}>
      {children}
    </HeaderLink>
  );
};

const A = ({ children, href, ...props }) => {
  const isExternal =
    href?.startsWith("https://") || href?.startsWith("mailto:");
  if (isExternal) {
    return (
      <a target="_blank" rel="noopener" href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link {...props} to={href}>
      {children}
    </Link>
  );
};

const Code = ({ children, className, highlight, ...props }) => {
  if (!className) return <code {...props}>{children}</code>;

  const highlightedLines = highlight ? highlight.split(",").map(Number) : [];

  // https://mdxjs.com/guides/syntax-highlighting#all-together
  const language = className.replace(/language-/, "");
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={THEME}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={{ ...style }}>
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line, key: i })}
              style={
                highlightedLines.includes(i + 1)
                  ? {
                      background: "#cce0f5",
                      margin: "0 -1rem",
                      padding: "0 1rem"
                    }
                  : null
              }
            >
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
};

const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: A,
  code: Code,
  PageSection: PageSection
};

export default ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};
