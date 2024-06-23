import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { getElementVisibleHeight } from './dom'; // 假设函数位于 utils.ts 中

describe('getElementVisibleHeight', () => {
  // Mocking the getBoundingClientRect method
  const mockGetBoundingClientRect = vi.fn();
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  beforeAll(() => {
    // Mock getBoundingClientRect method
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
  });

  afterAll(() => {
    // Restore original getBoundingClientRect method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should return 0 if the element is null or undefined', () => {
    expect(getElementVisibleHeight(null)).toBe(0);
    expect(getElementVisibleHeight()).toBe(0);
  });

  it('should return the visible height of the element', () => {
    // Mock the getBoundingClientRect return value
    mockGetBoundingClientRect.mockReturnValue({
      bottom: 500,
      height: 400,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: 100,
      width: 0,
      x: 0,
      y: 0,
    });

    const mockElement = document.createElement('div');
    document.body.append(mockElement);

    // Mocking window.innerHeight and document.documentElement.clientHeight
    const originalInnerHeight = window.innerHeight;
    const originalClientHeight = document.documentElement.clientHeight;

    Object.defineProperty(window, 'innerHeight', {
      value: 600,
      writable: true,
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 600,
      writable: true,
    });

    expect(getElementVisibleHeight(mockElement)).toBe(400);

    // Restore original values
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true,
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: originalClientHeight,
      writable: true,
    });

    mockElement.remove();
  });

  it('should return the visible height when element is partially out of viewport', () => {
    // Mock the getBoundingClientRect return value
    mockGetBoundingClientRect.mockReturnValue({
      bottom: 300,
      height: 400,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: -100,
      width: 0,
      x: 0,
      y: 0,
    });

    const mockElement = document.createElement('div');
    document.body.append(mockElement);

    // Mocking window.innerHeight and document.documentElement.clientHeight
    const originalInnerHeight = window.innerHeight;
    const originalClientHeight = document.documentElement.clientHeight;

    Object.defineProperty(window, 'innerHeight', {
      value: 600,
      writable: true,
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 600,
      writable: true,
    });

    expect(getElementVisibleHeight(mockElement)).toBe(300);

    // Restore original values
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true,
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: originalClientHeight,
      writable: true,
    });

    mockElement.remove();
  });

  it('should return 0 if the element is completely out of viewport', () => {
    // Mock the getBoundingClientRect return value
    mockGetBoundingClientRect.mockReturnValue({
      bottom: -100,
      height: 400,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: -500,
      width: 0,
      x: 0,
      y: 0,
    });

    const mockElement = document.createElement('div');
    document.body.append(mockElement);

    expect(getElementVisibleHeight(mockElement)).toBe(0);

    mockElement.remove();
  });
});
