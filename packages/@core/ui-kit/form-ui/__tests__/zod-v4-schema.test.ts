import { describe, expect, it } from 'vitest';
import { z, ZodString } from 'zod';
import { getDefaultsForSchema } from 'zod-defaults';

import {
  getBaseRules,
  getDefaultValueInZodStack,
} from '../src/form-render/helper';

describe('zod v4 schema helpers', () => {
  it('unwraps optional and default schemas with public APIs', () => {
    const schema = z.string().default('default value').optional();

    expect(getBaseRules(schema)).toBeInstanceOf(ZodString);
    expect(getDefaultValueInZodStack(schema)).toBe('default value');
  });

  it('unwraps the input side of a transform pipe', () => {
    const schema = z.string().transform((value) => value.length);

    expect(getBaseRules(schema)).toBeInstanceOf(ZodString);
  });

  it('returns undefined when a schema rejects undefined', () => {
    expect(getDefaultValueInZodStack(z.string())).toBeUndefined();
  });

  it('does not throw for an asynchronous default pipeline', () => {
    const schema = z
      .string()
      .default('default value')
      .transform(async (value) => value.toUpperCase());

    expect(getDefaultValueInZodStack(schema)).toBeUndefined();
  });

  it('uses zod v4 error callbacks for required and invalid inputs', () => {
    const schema = z.number({
      error: (issue) =>
        issue.input === undefined ? 'required' : 'invalid number',
    });

    expect(schema.safeParse(undefined).error?.issues[0]?.message).toBe(
      'required',
    );
    expect(schema.safeParse('1').error?.issues[0]?.message).toBe(
      'invalid number',
    );
  });

  it('extracts defaults from intersections without private schema access', () => {
    const schema = z.intersection(
      z.object({ enabled: z.boolean().default(true), name: z.string() }),
      z.object({ count: z.number(), note: z.string().default('note') }),
    );

    expect(getDefaultsForSchema(schema)).toEqual({
      count: 0,
      enabled: true,
      name: '',
      note: 'note',
    });
  });

  it('keeps nullable and coerce input semantics explicit', () => {
    expect(z.string().nullable().safeParse(undefined).success).toBe(false);
    expect(z.coerce.number().parse('42')).toBe(42);
  });
});
