export class EulerianPathFinder {
    #graph;
    #setEulerianData;
    #toast;
    constructor(graphData, setEulerianData, toast) {
        this.#graph = this.#initGraph(graphData);
        this.#setEulerianData = setEulerianData;
        this.#toast = toast;
    }

    #initGraph(graphData) {
        const graph = {};
        if (!graphData.nodes.length) {
            return graph;
        }
        graphData.nodes.forEach(node => {
            graph[node.data.id] = [];
        });
        graphData.edges.forEach(edge => {
            const { source, target } = edge.data;
            if (!graph[source]) {
                graph[source] = [];
            }
            if (!graph[target]) {
                graph[target] = [];
            }
            graph[source].push(target);
            graph[target].push(source);
        });
        return graph;
    }

    #findEulerianPath(graph, startNode) {
        const stack = [startNode];
        const path = [];
        while (stack.length > 0) {
            const currentNode = stack[stack.length - 1];
            if (graph[currentNode].length > 0) {
                const nextNode = graph[currentNode].pop();
                graph[nextNode] = graph[nextNode].filter(node => node !== currentNode);
                stack.push(nextNode);
            } else {
                path.push(stack.pop());
            }
        }
        return path.reverse();
    }

    #isGraphValid() {
        if (Object.keys(this.#graph).length === 0) {
            return false;
        }
        return Object.values(this.#graph).every(adj => adj.length > 0);
    }

    #oddEdgeNodes() {
        const oddEdgeNodes = [];
        for (const [node, adj] of Object.entries(this.#graph)) {
            if (adj.length % 2 !== 0) {
                oddEdgeNodes.push(node);
            }
        }
        return oddEdgeNodes;
    }

    find() {
        if (!this.#isGraphValid()) {
            this.#setEulerianData(p => ({
                    ...p,
                    color: 'yellow',
                    type: 'none',
                path: []
            }));
            return;
        }


        const oddEdgeNodes = this.#oddEdgeNodes();
        if (0 === oddEdgeNodes.length) {
            // Eulerian Cycle
            this.#setEulerianData(p => ({
                    ...p,
                    color: 'green',
                    type: 'cycle',
                path: this.#findEulerianPath(
                    JSON.parse(JSON.stringify(this.#graph)),
                        Object.keys(this.#graph)[0]
                    )
            }));
            return;
        }
        if (2 === oddEdgeNodes.length) {
            // Eulerian Path only
            this.#setEulerianData(p => ({
                    ...p,
                    color: 'green',
                    type: 'path',
                path: this.#findEulerianPath(
                    JSON.parse(JSON.stringify(this.#graph)),
                        oddEdgeNodes[0]
                    )
            }));
            return;
        }
        // No Eulerian Path/Cycle
        this.#setEulerianData(p => ({
                ...p,
                color: 'red',
                type: 'none',
            path: []
        }));

    }
}
