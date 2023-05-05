import { describe, expect, it } from "vitest";
import {
  filterTree, findAllNodePaths,
  findFirstNodePath,
  findTreeNode,
  findTreeNodes,
  flattenToTree,
  flattenTree,
  mapTreeNodeStructure,
  mapTreeStructure,
  traverseTreeIterative,
  traverseTreeIterativeWithParent,
  traverseTreeRecursive,
} from "../tree.ts";

describe("Tree Helper", () => {
  interface TreeNode {
    id: number;
    parentId: number | null;
    children?: TreeNode[];
  }

  const sampleTree: TreeNode[] = [
    {
      id: 1,
      parentId: null,
      children: [
        {
          id: 2,
          parentId: 1,
          children: [
            { id: 3, parentId: 2 },
            { id: 4, parentId: 2 },
          ],
        },
        {
          id: 5,
          parentId: 1,
          children: [
            { id: 6, parentId: 5 },
            { id: 7, parentId: 5 },
          ],
        },
      ],
    },
  ];

  describe("flattenToTree", () => {
    it("converts a flat list to a tree structure", () => {
      const flattenedNodes = [
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
        { id: 4, parentId: 2 },
        { id: 5, parentId: 1 },
        { id: 6, parentId: 5 },
        { id: 7, parentId: 5 },
      ];
      const expectedTree = [
        {
          id: 1,
          parentId: null,
          children: [
            {
              id: 2,
              parentId: 1,
              children: [
                { id: 3, parentId: 2, children: [] },
                { id: 4, parentId: 2, children: [] },
              ],
            },
            {
              id: 5,
              parentId: 1,
              children: [
                { id: 6, parentId: 5, children: [] },
                { id: 7, parentId: 5, children: [] },
              ],
            },
          ],
        },
      ];

      const actualTree = flattenToTree(flattenedNodes);

      expect(actualTree).toEqual(expectedTree);
    });
  });

  describe("flattenTree", () => {
    it("should flatten a tree correctly", () => {
      const tree = [
        {
          id: 1,
          name: "Node 1",
          children: [
            {
              id: 2,
              name: "Node 1.1",
              children: [
                { id: 3, name: "Node 1.1.1" },
                { id: 4, name: "Node 1.1.2" },
              ],
            },
            { id: 5, name: "Node 1.2" },
          ],
        },
        {
          id: 6,
          name: "Node 2",
          children: [
            { id: 7, name: "Node 2.1" },
          ],
        },
      ];

      const flattenedNodes = flattenTree(tree);

      expect(flattenedNodes).toEqual([
        {
          id: 1,
          name: "Node 1",
          children: [
            {
              id: 2,
              name: "Node 1.1",
              children: [
                { id: 3, name: "Node 1.1.1" },
                { id: 4, name: "Node 1.1.2" },
              ],
            },
            { id: 5, name: "Node 1.2" },
          ],
        },
        {
          id: 2,
          name: "Node 1.1",
          children: [
            { id: 3, name: "Node 1.1.1" },
            { id: 4, name: "Node 1.1.2" },
          ],
        },
        { id: 3, name: "Node 1.1.1" },
        { id: 4, name: "Node 1.1.2" },
        { id: 5, name: "Node 1.2" },
        {
          id: 6,
          name: "Node 2",
          children: [
            { id: 7, name: "Node 2.1" },
          ],
        },
        { id: 7, name: "Node 2.1" },
      ]);
    });

    it("should return an empty array when the input tree is empty", () => {
      const tree = [];
      const flattenedNodes = flattenTree(tree);
      expect(flattenedNodes).toEqual([]);
    });

    it("should handle a tree with a single node correctly", () => {
      const tree = [{ id: 1, name: "Node 1" }];
      const flattenedNodes = flattenTree(tree);
      expect(flattenedNodes).toEqual([{ id: 1, name: "Node 1" }]);
    });

    it("should handle a tree with no children correctly", () => {
      const tree = [
        { id: 1, name: "Node 1" },
        { id: 2, name: "Node 2" },
        { id: 3, name: "Node 3" },
      ];
      const flattenedNodes = flattenTree(tree);
      expect(flattenedNodes).toEqual([
        { id: 1, name: "Node 1" },
        { id: 2, name: "Node 2" },
        { id: 3, name: "Node 3" },
      ]);
    });
  });

  describe("findTreeNode", () => {
    it("finds the first node in the tree that satisfies the predicate", () => {
      const expectedNode = { id: 3, parentId: 2 };

      const actualNode = findTreeNode(sampleTree, node => node.id === 3);

      expect(actualNode).toEqual(expectedNode);
    });

    it("returns null if no node satisfies the predicate", () => {
      const actualNode = findTreeNode(sampleTree, node => node.id === 999);

      expect(actualNode).toBeNull();
    });
  });

  describe("findTreeNodes", () => {
    it("finds all nodes in the tree that satisfy the predicate", () => {
      const expectedNodes = [
        { id: 3, parentId: 2 },
        { id: 4, parentId: 2 },
      ];

      const actualNodes = findTreeNodes(sampleTree, node => node.parentId === 2);

      expect(actualNodes).toEqual(expectedNodes);
    });

    it("returns an empty array if no node satisfies the predicate", () => {
      const actualNodes = findTreeNodes(sampleTree, node => node.id === 999);

      expect(actualNodes).toEqual([]);
    });
  });

  describe("findFirstNodePath", () => {
    it("should return null if no node satisfies the predicate", () => {
      const result = findFirstNodePath(sampleTree, node => node.id === 8);
      expect(result).toBeNull();
    });

    it("should return the path to the first node that satisfies the predicate", () => {
      const result = findFirstNodePath(sampleTree, node => node.id === 4);
      expect(result).toEqual([
        {
          id: 1,
          parentId: null,
          children: [
            {
              id: 2,
              parentId: 1,
              children: [
                {
                  id: 3,
                  parentId: 2,
                },
                {
                  id: 4,
                  parentId: 2,
                },
              ],
            },
            {
              id: 5,
              parentId: 1,
              children: [
                {
                  id: 6,
                  parentId: 5,
                },
                {
                  id: 7,
                  parentId: 5,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          parentId: 1,
          children: [
            {
              id: 3,
              parentId: 2,
            },
            {
              id: 4,
              parentId: 2,
            },
          ],
        },
        {
          id: 4,
          parentId: 2,
        },
      ]);
    });
  });

  describe("findAllNodePaths", () => {
    it("should return an empty array if no nodes are found", () => {
      const result = findAllNodePaths(sampleTree, node => node.id === 8);
      expect(result).toEqual([]);
    });

    it("should return an array with one path if one node is found", () => {
      const result = findAllNodePaths(sampleTree, node => node.id === 3);
      expect(result).toEqual([[sampleTree[0], sampleTree[0].children![0], sampleTree[0].children![0].children![0]]]);
    });

    it("should return an array with multiple paths if multiple nodes are found", () => {
      const result = findAllNodePaths(sampleTree, node => node.id === 4 || node.id === 7);
      expect(result).toEqual([
        [sampleTree[0], sampleTree[0].children![0], sampleTree[0].children![0].children![1]],
        [sampleTree[0], sampleTree[0].children![1], sampleTree[0].children![1].children![1]],
      ]);
    });
  });

  describe("filterTree", () => {
    it("filters the tree to contain only nodes that satisfy the predicate", () => {
      const expectedTree = [
        {
          id: 1,
          parentId: null,
          children: [
            {
              id: 5,
              parentId: 1,
              children: [
                {
                  id: 7,
                  parentId: 5,
                },
              ],
            },
          ],
        },
      ];
      const filteredTree = filterTree(sampleTree, node => node.id === 1 || node.id === 5 || node.id === 7);
      expect(filteredTree).toEqual(expectedTree);
      expect([{
        id: 1,
        parentId: null,
        children: [],
      }]).toEqual(filterTree(sampleTree, node => node.id === 1));
    });

    it("returns an empty array if no node satisfies the predicate", () => {
      const filteredTree = filterTree(sampleTree, node => node.id === 100);
      expect(filteredTree).toEqual([]);
    });
  });

  describe("traverseTreeRecursive", () => {
    it("executes the callback function for each node in the tree", () => {
      const nodes: unknown[] = [];
      const callback = node => nodes.push(node.id);
      traverseTreeRecursive(sampleTree, callback);
      const expectedNodes = [1, 2, 3, 4, 5, 6, 7];
      expect(nodes).toEqual(expectedNodes);
    });
  });

  describe("traverseTreeIterative", () => {
    it("executes the callback function for each node in the tree", () => {
      const nodes: unknown[] = [];
      const callback = (node) => {
        nodes.push(node.id);
      };
      traverseTreeIterative(sampleTree, callback);
      const expectedNodes = [1, 2, 3, 4, 5, 6, 7];
      expect(nodes).toEqual(expectedNodes);
    });
  });

  describe("traverseTreeIterativeWithParent", () => {
    it("should execute callback for each node with parent node", () => {
      const nodes: unknown[] = [];
      const callback = (node, parent) => {
        nodes.push({ id: node.id, parentId: parent?.id });
      };
      traverseTreeIterativeWithParent(sampleTree, callback);
      const expectedNodes = [
        { id: 1, parentId: undefined },
        { id: 5, parentId: 1 },
        { id: 7, parentId: 5 },
        { id: 6, parentId: 5 },
        { id: 2, parentId: 1 },
        { id: 4, parentId: 2 },
        { id: 3, parentId: 2 },
      ];
      expect(nodes).toEqual(expectedNodes);
    });
  });

  describe("mapTreeStructure", () => {
    it("should map a tree structure to a new tree structure with a specified structure", () => {
      const treeData = [
        {
          id: 1,
          name: "root",
          children: [
            {
              id: 2,
              name: "child1",
            },
            {
              id: 3,
              name: "child2",
              children: [
                {
                  id: 4,
                  name: "grandchild1",
                },
              ],
            },
          ],
        },
      ];

      const expectedResult = [
        {
          id: 1,
          label: "root",
          children: [
            {
              id: 2,
              label: "child1",
            },
            {
              id: 3,
              label: "child2",
              children: [
                {
                  id: 4,
                  label: "grandchild1",
                },
              ],
            },
          ],
        },
      ];

      const convertNodeToStructure = node => ({
        id: node.id,
        label: node.name,
      });

      const result = mapTreeStructure(treeData, convertNodeToStructure);
      expect(result).toEqual(expectedResult);
    });

    it("should use the provided configuration options if they are provided", () => {
      const treeData = [
        {
          id: 1,
          name: "root",
          nodes: [
            {
              id: 2,
              name: "child1",
            },
          ],
        },
      ];

      const expectedResult = [
        {
          id: 1,
          label: "root",
          copyNodes: [
            {
              id: 2,
              label: "child1",
              copyNodes: [],
            },
          ],
          nodes: [
            {
              id: 2,
              label: "child1",
              copyNodes: [],
            },
          ],
        },
      ];

      const convertNodeToStructure = node => ({
        id: node.id,
        label: node.name,
        copyNodes: node.nodes ? node.nodes.map(convertNodeToStructure) : [],
      });

      const config = {
        childrenKey: "nodes",
      };

      const result = mapTreeStructure(treeData, convertNodeToStructure, config);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("mapTreeNodeStructure", () => {
    const sampleTree = [
      {
        id: 1,
        name: "Parent",
        children: [
          { id: 2, name: "Child 1" },
          { id: 3, name: "Child 2" },
        ],
      },
    ];

    it("maps a tree node into a new node with specified structure", () => {
      const result = mapTreeNodeStructure(sampleTree[0], node => ({
        label: node.name,
      }));
      expect(result).toEqual({ label: "Parent", children: expect.any(Array) });
      expect(result.children[0]).toEqual({ label: "Child 1" });
      expect(result.children[1]).toEqual({ label: "Child 2" });
    });

    it("maps a tree node with empty children array into a new node with specified structure", () => {
      const node = { id: 1, name: "Leaf", children: [] };
      const result = mapTreeNodeStructure(node, node => ({ label: node.name }));
      expect(result).toEqual({ label: "Leaf" });
    });

    it("maps a tree node with custom children key into a new node with specified structure", () => {
      const node = { id: 1, name: "Parent", kids: [{ id: 2, name: "Kid 1" }] };
      const config = { childrenKey: "kids" };
      const result = mapTreeNodeStructure(node, node => ({ label: node.name }), config);
      expect(result).toEqual({ label: "Parent", kids: expect.any(Array) });
      expect(result.kids[0]).toEqual({ label: "Kid 1" });
    });

    it("maps a tree node with nested children into a new node with specified structure", () => {
      const node = {
        id: 1,
        name: "Grandparent",
        children: [
          {
            id: 2,
            name: "Parent",
            children: [
              { id: 3, name: "Child 1" },
              { id: 4, name: "Child 2" },
            ],
          },
        ],
      };
      const result = mapTreeNodeStructure(node, node => ({ label: node.name }));
      expect(result).toEqual({ label: "Grandparent", children: expect.any(Array) });
      expect(result.children[0]).toEqual({ label: "Parent", children: expect.any(Array) });
      expect(result.children[0].children[0]).toEqual({ label: "Child 1" });
      expect(result.children[0].children[1]).toEqual({ label: "Child 2" });
    });
  });
});
