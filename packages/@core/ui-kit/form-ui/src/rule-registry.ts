import type { FormRuleValidator } from './types';

const FORM_RULES = new Map<string, FormRuleValidator>();

export function getFormRule(name: string) {
  return FORM_RULES.get(name);
}

export function registerFormRules(
  rules: Partial<Record<string, FormRuleValidator>>,
) {
  for (const [name, validator] of Object.entries(rules)) {
    if (validator) {
      FORM_RULES.set(name, validator);
    }
  }
}
