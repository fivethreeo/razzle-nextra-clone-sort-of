const locateInfo = (rules, loaderName) => {
  // i.e.: /eslint-loader/
  const loaderRegex = new RegExp(`[/\\\\]${loaderName}[/\\\\]`);

  return rules.reduce((info, rule, ruleIndex) => {
    if (rule.use) {
      // Checks if there is an object inside rule.use with loader matching loaderRegex, OR
      // Checks another condition, if rule is not an object, but pure string (ex: "style-loader", etc)
      const useIndex = (typeof rule.use === "function"
        ? rule.use({})
        : rule.use
      ).findIndex(
        (loader) =>
          (typeof loader.loader === "string" &&
            loader.loader.match(loaderRegex)) ||
          rule.loader === loaderName ||
          (typeof loader === "string" &&
            (loader.match(loaderRegex) || loader === loaderName))
      );
      if (useIndex !== -1) {
        info.push({
          rule: rule,
          ruleIndex: ruleIndex,
          useIndex: useIndex
        });
      }
    } else if (rule.oneOf) {
      // Checks if there is an object inside rule.oneOf with loader matching loaderRegex, OR
      // Checks another condition, if rule is not an object, but pure string (ex: "style-loader", etc)
      const locatedOneOfRules = locateInfo(info.oneOf, loaderName);
      if (locatedOneOfRules.length) {
        info.push({
          rule: rule,
          ruleIndex: ruleIndex,
          oneOfRules: locatedOneOfRules
        });
      }
    } else {
      // Checks if there's a loader string in rule.loader matching loaderRegex
      const inLoaderString =
        typeof rule.loader === "string" &&
        (rule.loader.match(loaderRegex) || rule.loader === loaderName);
      if (inLoaderString) {
        info.push({
          rule: rule,
          ruleIndex: ruleIndex
        });
      }
    }
    return info;
  }, []);
};

module.exports = locateInfo;
