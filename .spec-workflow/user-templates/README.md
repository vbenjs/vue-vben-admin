# User Templates

This directory allows you to create custom templates that override the default Spec Workflow templates.

## How to Use Custom Templates

1. **Create your custom template file** in this directory with the exact same name as the default template you want to override:
   - `requirements-template.md` - Override requirements document template
   - `design-template.md` - Override design document template  
   - `tasks-template.md` - Override tasks document template
   - `product-template.md` - Override product steering template
   - `tech-template.md` - Override tech steering template
   - `structure-template.md` - Override structure steering template

2. **Template Loading Priority**:
   - The system first checks this `user-templates/` directory
   - If a matching template is found here, it will be used
   - Otherwise, the default template from `templates/` will be used

## Example Custom Template

To create a custom requirements template:

1. Create a file named `requirements-template.md` in this directory
2. Add your custom structure, for example:

```markdown
# Requirements Document

## Executive Summary
[Your custom section]

## Business Requirements
[Your custom structure]

## Technical Requirements
[Your custom fields]

## Custom Sections
[Add any sections specific to your workflow]
```

## Template Variables

Templates can include placeholders that will be replaced when documents are created:
- `{{projectName}}` - The name of your project
- `{{featureName}}` - The name of the feature being specified
- `{{date}}` - The current date
- `{{author}}` - The document author

## Best Practices

1. **Start from defaults**: Copy a default template from `../templates/` as a starting point
2. **Keep structure consistent**: Maintain similar section headers for tool compatibility
3. **Document changes**: Add comments explaining why sections were added/modified
4. **Version control**: Track your custom templates in version control
5. **Test thoroughly**: Ensure custom templates work with the spec workflow tools

## Notes

- Custom templates are project-specific and not included in the package distribution
- The `templates/` directory contains the default templates which are updated with each version
- Your custom templates in this directory are preserved during updates
- If a custom template has errors, the system will fall back to the default template
