const TurboType = {
  SEQUENCE_FLOW: 1,
  START_EVENT: 2,
  END_EVENT: 3,
  USER_TASK: 4,
  SERVICE_TASK: 5,
  EXCLUSIVE_GATEWAY: 6,
};

function getTurboType(type) {
  switch (type) {
    case 'bpmn:sequenceFlow':
      return TurboType.SEQUENCE_FLOW;
    case 'bpmn:startEvent':
      return TurboType.START_EVENT;
    case 'bpmn:endEvent':
      return TurboType.END_EVENT;
    case 'bpmn:userTask':
      return TurboType.USER_TASK;
    case 'bpmn:serviceTask':
      return TurboType.SERVICE_TASK;
    case 'bpmn:exclusiveGateway':
      return TurboType.EXCLUSIVE_GATEWAY;
    default:
      return type;
  }
}

function convertNodeToTurboElement(node) {
  const { id, type, x, y, text = '', properties } = node;
  return {
    incoming: [],
    outgoing: [],
    dockers: [],
    type: getTurboType(node.type),
    properties: {
      ...properties,
      name: (text && text.value) || '',
      x: x,
      y: y,
      text,
      logicFlowType: type,
    },
    key: id,
  };
}

function convertEdgeToTurboElement(edge) {
  const {
    id,
    type,
    sourceNodeId,
    targetNodeId,
    startPoint,
    endPoint,
    pointsList,
    text = '',
    properties,
  } = edge;
  return {
    incoming: [sourceNodeId],
    outgoing: [targetNodeId],
    type: getTurboType(type),
    dockers: [],
    properties: {
      ...properties,
      name: (text && text.value) || '',
      text,
      startPoint,
      endPoint,
      pointsList,
      logicFlowType: type,
    },
    key: id,
  };
}

export function toTurboData(data) {
  const nodeMap = new Map();
  const turboData = {
    flowElementList: [],
  };
  data.nodes.forEach((node) => {
    const flowElement = convertNodeToTurboElement(node);
    turboData.flowElementList.push(flowElement);
    nodeMap.set(node.id, flowElement);
  });
  data.edges.forEach((edge) => {
    const flowElement = convertEdgeToTurboElement(edge);
    const sourceElement = nodeMap.get(edge.sourceNodeId);
    sourceElement.outgoing.push(flowElement.key);
    const targetElement = nodeMap.get(edge.targetNodeId);
    targetElement.incoming.push(flowElement.key);
    turboData.flowElementList.push(flowElement);
  });
  return turboData;
}

function convertFlowElementToEdge(element) {
  const { incoming, outgoing, properties, key } = element;
  const { text, startPoint, endPoint, pointsList, logicFlowType } = properties;
  const edge = {
    id: key,
    type: logicFlowType,
    sourceNodeId: incoming[0],
    targetNodeId: outgoing[0],
    text,
    startPoint,
    endPoint,
    pointsList,
    properties: {},
  };
  const excludeProperties = ['startPoint', 'endPoint', 'pointsList', 'text', 'logicFlowType'];
  Object.keys(element.properties).forEach((property) => {
    if (excludeProperties.indexOf(property) === -1) {
      edge.properties[property] = element.properties[property];
    }
  });
  return edge;
}

function convertFlowElementToNode(element) {
  const { properties, key } = element;
  const { x, y, text, logicFlowType } = properties;
  const node = {
    id: key,
    type: logicFlowType,
    x,
    y,
    text,
    properties: {},
  };
  const excludeProperties = ['x', 'y', 'text', 'logicFlowType'];
  Object.keys(element.properties).forEach((property) => {
    if (excludeProperties.indexOf(property) === -1) {
      node.properties[property] = element.properties[property];
    }
  });
  return node;
}

export function toLogicflowData(data) {
  const lfData = {
    nodes: [],
    edges: [],
  };
  const list = data.flowElementList;
  list &&
    list.length > 0 &&
    list.forEach((element) => {
      if (element.type === TurboType.SEQUENCE_FLOW) {
        const edge = convertFlowElementToEdge(element);
        lfData.edges.push(edge);
      } else {
        const node = convertFlowElementToNode(element);
        lfData.nodes.push(node);
      }
    });
  return lfData;
}
