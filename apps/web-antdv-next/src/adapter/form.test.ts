import { describe, expect, it, vi } from 'vitest';

import { initSetupVbenForm } from './form';

const mocks = vi.hoisted(() => ({
  setupVbenForm: vi.fn(),
}));

vi.mock('@vben/common-ui', () => ({
  setupVbenForm: mocks.setupVbenForm,
  useVbenForm: vi.fn(),
  z: {},
}));

vi.mock('@vben/locales', () => ({
  $t: (key: string) => key,
}));

describe('antdv-next form adapter', () => {
  it('keeps VbenTiptap on the standard Vue model protocol', async () => {
    await initSetupVbenForm();

    expect(mocks.setupVbenForm).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          modelPropNameMap: expect.objectContaining({
            RichEditor: 'modelValue',
          }),
        }),
      }),
    );
  });
});
