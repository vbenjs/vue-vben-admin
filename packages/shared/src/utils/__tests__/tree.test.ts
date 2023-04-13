import { describe, expect, test } from 'vitest';

import { traverseTree } from '../tree';

describe('traverseTree', () => {
  interface Node {
    name: string;
    children?: Node[];
  }

  type NodeValue = string;

  const sampleTree: Node[] = [
    {
      name: 'A',
      children: [
        { name: 'B' },
        {
          name: 'C',
          children: [{ name: 'D' }, { name: 'E' }],
        },
      ],
    },
    {
      name: 'F',
      children: [
        { name: 'G' },
        {
          name: 'H',
          children: [{ name: 'I' }],
        },
      ],
    },
  ];

  test('traverses tree and returns all node values', () => {
    const values = traverseTree<Node, NodeValue>(
      sampleTree,
      (node) => node.children,
      (node) => node.name,
    );
    expect(values).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
  });

  test('handles empty tree', () => {
    const values = traverseTree<Node, NodeValue>(
      [],
      (node) => node.children,
      (node) => node.name,
    );
    expect(values).toEqual([]);
  });

  test('handles tree with only root node', () => {
    const rootNode = { name: 'A' };
    const values = traverseTree<Node, NodeValue>(
      [rootNode],
      (node) => node.children,
      (node) => node.name,
    );
    expect(values).toEqual(['A']);
  });

  test('handles tree with only leaf nodes', () => {
    const leafNodes = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    const values = traverseTree<Node, NodeValue>(
      leafNodes,
      (_) => undefined,
      (node) => node.name,
    );
    expect(values).toEqual(['A', 'B', 'C']);
  });
});
