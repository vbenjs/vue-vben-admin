/**
 * Convert object to functional component
 * @param t
 * @param path
 */
const convertSetupFunctionalComponent = (t, path) => {
    const properties = path.node.properties;
    const nameProp = properties.find(node => node.key.name === 'name');
    const renderProp = properties.find(node => node.key.name === 'render');
    const renderBody = renderProp.value.body;
    const renderParams = renderProp.value.params;
    const name = nameProp && nameProp.value.value;
    const params = [...renderParams.slice(renderParams.length && renderParams[0].name === 'h' ? 1 : 0)];

    const props = [
        t.objectProperty(t.identifier('setup'), t.arrowFunctionExpression(params, renderBody))
    ];
    if (name) {
        props.unshift(t.objectProperty(t.identifier('name'), t.stringLiteral(name)));
    }
    path.replaceWith(t.objectExpression(props));
}

/**
 * Check if it's a setup functional componet declarator
 * @param t
 * @param path
 * @returns boolean
 */
const isSetupFunctionalComponentDeclarator = (t, path) => {
    const properties = path.node.properties;

    const isFunctional = properties.filter(node => {
        return (
            t.isObjectProperty(node) && 
            ((node.key.name === 'functional' && node.value.value === true) || node.key.name === 'render')
        );
    }).length === 2;

    if (!isFunctional) return false;

    const renderBody = properties.find(node => node.key.name === 'render').value.body;

    const returnStatement = t.isBlockStatement(renderBody) && renderBody.body.find(node => t.isReturnStatement(node));

    return (
        t.isArrowFunctionExpression(renderBody) ||
        t.isFunctionExpression(renderBody) ||
        (returnStatement && t.isArrowFunctionExpression(returnStatement.argument)) ||
        (returnStatement && t.isFunctionExpression(returnStatement.argument))
    );
}

module.exports = ({ types: t }) => {
    return {
        visitor: {
            Program(path) {
                path.traverse({
                    ExportDefaultDeclaration(path) {
                        const declaration = path.get('declaration');
                        if (
                            !t.isObjectExpression(declaration) ||
                            !isSetupFunctionalComponentDeclarator(t, declaration)
                        ) {
                            return;
                        }
                        convertSetupFunctionalComponent(t, declaration);
                    },
                    VariableDeclaration(path) {
                        if (
                            path.node.declarations.length !== 1 ||
                            !t.isVariableDeclarator(path.node.declarations[0]) ||
                            !t.isObjectExpression(path.node.declarations[0].init)
                        ) {
                            return;
                        }
                        const declarator = path.get('declarations')[0];
                        const init = declarator.get('init');
                        if (!isSetupFunctionalComponentDeclarator(t, init)) {
                            return;
                        }
                        convertSetupFunctionalComponent(t, init);
                    }
                });
            }
        }
    };
}
