
const autoImportVue = (t, path) => {
  const importSource = "vue";
  const imports = path.node.body.filter(t.isImportDeclaration);
  const imported = imports.find(node => node.source.value === importSource);
  const autoImport = () =>
    path.unshiftContainer(
      "body",
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier("Vue"))],
        t.stringLiteral(importSource)
      )
    );
  if (!imported) {
    autoImport();
    return;
  }
  const defaultSpecifier = imported.specifiers.find(t.isImportDefaultSpecifier);
  if (!defaultSpecifier) {
    imported.specifiers.push(t.importDefaultSpecifier(t.identifier("Vue")));
  } else if (defaultSpecifier.local.name !== "Vue") {
    autoImport();
  }
};

module.exports = ({ types: t }) => {
  return {
    visitor: {
      Program(p) {
        p.traverse({
          "ObjectMethod|ObjectProperty"(path) {
            if (path.node.key.name !== "setup") return;
            path.traverse({
              JSXAttribute(path) {
                const n = path.get("name");
                const isInputOrModel = n.node.name === "on-input" || n.node.name === "on-change" || n.node.name === "model";
                if (!isInputOrModel) return;
                path.traverse({
                  MemberExpression(path) {
                    const obj = path.get("object");
                    const prop = path.get("property");
                    if (t.isThisExpression(obj) && t.isIdentifier(prop) && prop.node.name === "$set") {
                      autoImportVue(t, p);
                      obj.replaceWith(t.identifier("Vue"));
                      prop.replaceWith(t.identifier("set"));
                    }
                  }
                });
              }
            });
          }
        });
      }
    }
  };
};
