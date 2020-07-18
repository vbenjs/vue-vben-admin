/**
 * Definition like `const root = ref(null);`.
 * @param {*} t
 * @param {*} path
 * @returns {boolean}
 */
const isRefCallee = (t, path) => {
  if (!t.isVariableDeclaration(path)) return;
  const declarations = path.get('declarations');
  if (declarations.length !== 1) return;
  const init = declarations[0].get('init');
  if (!t.isCallExpression(init)) return;
  return init.node.callee.name === 'ref' && t.isNullLiteral(init.get('arguments')[0]);
};

/**
 * Match definedRefs in JSX
 * @param {*} t
 * @param {*} path ObjectMethod
 * @returns {*} `refs` to be processed
 */
const matchRefsInJSX = (t, path, definedRefs = []) => {
  const refs = [];
  path.traverse({
    // Definition like `h('h1', { ref: ... })`.
    CallExpression(path) {
      if (path.node.callee.name !== 'h') return;
      const [, obj] = path.get('arguments');
      if (!obj || !t.isObjectExpression(obj)) return;
      const props = obj.get('properties');
      const refProp = props.find((path) => path.node.key.name === 'ref');
      if (!refProp) return;
      const value = refProp.get('value');
      if (t.isIdentifier(value)) {
        const ref = value.node.name;
        if (definedRefs.indexOf(ref) > -1) {
          refs.push(ref);
          value.replaceWith(t.stringLiteral(ref));
        }
      } else if (t.isStringLiteral(value)) {
        const ref = value.node.value;
        if (definedRefs.indexOf(ref) > -1) {
          refs.push(ref);
        }
      }
    },
    // Definition like `<h1 ref={...}></h1>`.
    JSXAttribute(path) {
      if (path.node.name.name !== 'ref') return;
      const value = path.get('value');
      if (t.isJSXExpressionContainer(value)) {
        const exp = value.get('expression');
        if (!exp || !t.isIdentifier(exp)) return;
        const ref = exp.node.name;
        if (definedRefs.indexOf(ref) > -1) {
          refs.push(ref);
          value.replaceWith(t.stringLiteral(ref));
        }
      } else if (t.isStringLiteral(value)) {
        const ref = value.node.value;
        if (definedRefs.indexOf(ref) > -1) {
          refs.push(ref);
        }
      }
    },
  });
  return refs;
};

const autoImportVue = (t, path) => {
  const importSource = 'vue';
  const imports = path.node.body.filter(t.isImportDeclaration);
  const imported = imports.find((node) => node.source.value === importSource);
  const autoImport = () =>
    path.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier('Vue'))],
        t.stringLiteral(importSource)
      )
    );
  if (!imported) {
    autoImport();
    return;
  }
  const defaultSpecifier = imported.specifiers.find(t.isImportDefaultSpecifier);
  if (!defaultSpecifier) {
    imported.specifiers.push(t.importDefaultSpecifier(t.identifier('Vue')));
  } else if (defaultSpecifier.local.name !== 'Vue') {
    autoImport();
  }
};

/**
 * auto import lifeCycle
 * @param {*} t
 * @param {*} path Program
 * @param {*} lifeCycles
 */
const autoImportLifeCycle = (t, path, lifeCycles = []) => {
  const importSource = '@/setup/vue';
  const imports = path.node.body.filter(t.isImportDeclaration);
  const imported = imports.find((node) => node.source.value === importSource);
  const genImportSpecifiers = (list) =>
    list.map((name) => t.importSpecifier(t.identifier(name), t.identifier(name)));
  if (!imported) {
    path.unshiftContainer(
      'body',
      t.importDeclaration(genImportSpecifiers(lifeCycles), t.stringLiteral(importSource))
    );
    return lifeCycles;
  }
  const specifiers = imported.specifiers.filter(t.isImportSpecifier);
  const names = lifeCycles.map((name) => {
    const node = specifiers.find((node) => name === node.imported.name);
    if (node) {
      return node.local.name;
    } else {
      imported.specifiers.push(...genImportSpecifiers([name]));
      return name;
    }
  });
  return names;
};

/**
 * inject onMounted(() => {
 *   Vue.$nextTick(() => {
 *     ...
 *   });
 * });
 * @param {*} t
 * @param {*} path ObjectMethod
 * @param {*} lifeCycles
 * @param {*} refs
 */
const injectLifeCycle = (t, path, lifeCycles = [], refs = []) => {
  const [prop, ctx] = path.get('params');
  const props = ['refs'];
  const getProperties = () =>
    props.map((val) => t.objectProperty(t.identifier(val), t.identifier(val), false, true));
  if (!prop) {
    path.node.params.push(t.identifier('_'));
  }
  if (!ctx) {
    path.node.params.push(t.objectPattern(getProperties()));
  } else {
    if (t.isObjectPattern(ctx)) {
      const refsProp = ctx.node.properties.find((node) => node.key.name === props[0]);
      if (!refsProp) {
        ctx.node.properties.push(...getProperties());
      } else {
        props[0] = refsProp.value.name;
      }
    } else {
      props.unshift(ctx.node.name);
    }
  }

  const identifiers = props.map((val) => t.identifier(val));
  const statements = refs.map((val) => {
    return t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(t.identifier(val), t.identifier('value')),
        t.logicalExpression(
          '||',
          t.memberExpression(
            identifiers.length > 1 ? t.memberExpression(...identifiers) : identifiers[0],
            t.identifier(val)
          ),
          t.nullLiteral()
        )
      )
    );
  });

  const nextTick = t.expressionStatement(
    t.callExpression(t.memberExpression(t.identifier('Vue'), t.identifier('nextTick')), [
      t.arrowFunctionExpression([], t.blockStatement(statements)),
    ])
  );

  const content = lifeCycles.map((val) =>
    t.expressionStatement(
      t.callExpression(t.identifier(val), [
        t.arrowFunctionExpression([], t.blockStatement([...statements, nextTick])),
      ])
    )
  );

  path.get('body').unshiftContainer('body', content);
};

module.exports = ({ types: t }) => {
  return {
    visitor: {
      Program(p) {
        p.traverse({
          'ObjectMethod|ObjectProperty'(path) {
            if (path.node.key.name !== 'setup') return;
            let container = path;
            if (t.isObjectProperty(path)) {
              container = path.get('value');
            }
            if (!t.isBlockStatement(container.get('body'))) return;
            const body = container.get('body').get('body');
            const definedRefs = body
              .filter((path) => isRefCallee(t, path))
              .map((path) => path.get('declarations')[0].node.id.name);
            if (!definedRefs.length) return;

            const refs = matchRefsInJSX(t, container, definedRefs);

            if (!refs.length) return;
            autoImportVue(t, p);
            // const lifeCycles = autoImportLifeCycle(t, p, ['onMounted', 'onUpdated']);

            // injectLifeCycle(t, container, lifeCycles, refs);
          },
        });
      },
    },
  };
};
