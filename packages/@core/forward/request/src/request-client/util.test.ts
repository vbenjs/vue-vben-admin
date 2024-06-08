import axios from 'axios';
import { describe, expect, it } from 'vitest';

import { isCancelError } from './util';

describe('isCancelError', () => {
  const source = axios.CancelToken.source();
  source.cancel('Operation canceled by the user.');

  it('should detect cancellation', () => {
    const error = new axios.Cancel('Operation canceled by the user.');

    const result = isCancelError(error);

    expect(result).toBe(true);
  });

  it('should not detect cancellation on regular errors', () => {
    const error = new Error('Regular error');

    const result = isCancelError(error);

    expect(result).toBe(false);
  });
});
