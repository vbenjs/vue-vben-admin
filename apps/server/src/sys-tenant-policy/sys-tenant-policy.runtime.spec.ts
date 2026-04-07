import {
  normalizeTenantPolicy,
  stripDisallowedPreferencePatch,
} from './sys-tenant-policy.runtime';

describe('sys-tenant-policy runtime helpers', () => {
  it('normalizes invalid payloads into empty policy sections', () => {
    expect(normalizeTenantPolicy(null)).toEqual({
      actions: {},
      attachments: {},
      fields: {},
      print: {},
    });
  });

  it('strips preference overrides that exceed tenant policy ceilings', () => {
    const stripped = stripDisallowedPreferencePatch(
      {
        'form.basic.amount': { readonly: false },
        'search.status': { defaultValue: '1', visible: true },
        'toolbar.detail': { visible: false },
        'toolbar.history': { visible: true },
      },
      normalizeTenantPolicy({
        actions: {
          'toolbar.history': { visible: false },
        },
        fields: {
          'form.basic.amount': { readonly: true },
          'search.status': { visible: false },
        },
      }),
    );

    expect(stripped['search.status'].defaultValue).toBe('1');
    expect(stripped['search.status'].visible).toBeUndefined();
    expect(stripped['form.basic.amount'].readonly).toBeUndefined();
    expect(stripped['toolbar.history']).toBeUndefined();
    expect(stripped['toolbar.detail']).toMatchObject({ visible: false });
  });
});
