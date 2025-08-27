import React, { useState, useEffect, useRef } from "react";
import GraphContainer from "./components/GraphContainer";
import Toolbox from "./components/Toolbox";
import Box from "@mui/material/Box";
import { EulerianPathFinder } from "./util/EulerianPathFinder";
import { myFavGraphShape } from "./data/myFavGraphShape";
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const GraphEditor = () => {
    const cyRef = useRef(null);
    const [highlightEulerianPath, setHighlightEulerianPath] = useState(false);

    const [selection, setSelection] = useState({
        nodes: [],
        edges: []
    });

    const [graphData, setGraphData] = useState(myFavGraphShape);

    const [eulerianData, setEulerianData] = useState({
        color: '',
        path: []
    });

    const [eulerStepIndex, setEulerStepIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    const resetEulerianStep = () => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.edges().forEach(edge => {
            edge.style({ 'line-color': '#999', 'width': 2 });
        });

        setEulerStepIndex(0);
    };

    const autoplayEulerianPath = () => {
        resetEulerianStep();
        const cy = cyRef.current;
        if (!cy || !eulerianData.path.length || isAutoPlaying) return;

        setIsAutoPlaying(true);
        setEulerStepIndex(0);

        let i = 0;
        const intervalId = setInterval(() => {
            if (i >= eulerianData.path.length - 1) {
                clearInterval(intervalId);
                setIsAutoPlaying(false);
                return;
            }

            const source = eulerianData.path[i];
            const target = eulerianData.path[i + 1];

            const matchingEdges = cy.edges().filter(edge =>
                (edge.data('source') === source && edge.data('target') === target) ||
                (edge.data('source') === target && edge.data('target') === source)
            );

            matchingEdges.forEach(edge => {
                edge.style({
                    'line-color': 'red',
                    'width': 5
                });
            });

            i++;
            setEulerStepIndex(i); // Optional: track live progress
        }, 1000); // 500ms between steps
    };




    const actions = (() => {
        const _removeNodes = function () {
            const remainingNodes = graphData.nodes.filter(node => !selection.nodes.includes(node.data.id));
            const remainingEdges = graphData.edges.filter(edge =>
                !selection.nodes.includes(edge.data.source) && !selection.nodes.includes(edge.data.target));
            setGraphData(prevData => ({
                ...prevData,
                nodes: remainingNodes,
                edges: remainingEdges
            }));
            setSelection(prevData => ({
                ...prevData,
                nodes: [],
                edges: []
            }));
        };
        const _removeEdges = function () {
            const remainingEdges = graphData.edges.filter(edge => !selection.edges.includes(edge.data.id));
            setGraphData(prevData => ({
                ...prevData,
                edges: remainingEdges
            }));
            setSelection(prevData => ({
                ...prevData,
                nodes: [],
                edges: []
            }));
        };

        return {
            addNode: function () {
                const largestId = graphData.nodes.length > 0
                    ? Math.max(...graphData.nodes.map(node => parseInt(node.data.id)))
                    : 0;
                const newNodeId = largestId + 1;
                const newNode = {
                    data: { id: newNodeId, label: newNodeId },
                    position: { x: Math.random() * 700, y: Math.random() * 700 }
                };

                setGraphData(prevData => ({
                    ...prevData,
                    nodes: [...prevData.nodes, newNode]
                }));

                if (selection.nodes.length !== 1) {
                    return;
                }

                const newEdge = { data: { source: newNodeId, target: selection.nodes[0] } };
                setGraphData(prevData => ({
                    ...prevData,
                    edges: [...prevData.edges, newEdge]
                }));
            },

            addEdge: function () {
                if (selection.nodes.length !== 2) {
                    return;
                }
                const [source, target] = selection.nodes;

                if (graphData.edges.some(
                    edge => (edge.data.source === source && edge.data.target === target) ||
                        (edge.data.source === target && edge.data.target === source)
                )) {
                    return;
                }


                const newEdge = { data: { source, target } };
                setGraphData(prevData => ({
                    ...prevData,
                    edges: [...prevData.edges, newEdge]
                }));
            },

            removeSelected: function () {
                if (selection.nodes.length) {
                    _removeNodes();
                } else if (selection.edges.length) {
                    _removeEdges();
                }
            },

            saveGraphAsSVG: function () {
                if (!cyRef.current) return;

                const cy = cyRef.current;
                const svgStr = cy.svg({ scale: 1, full: true });

                const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "graph.svg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            clearAll: function () {
                setGraphData({
                    nodes: [],
                    edges: []
                });

                setSelection({
                    nodes: [],
                    edges: []
                });

                setEulerianData({
                    color: '',
                    path: []
                });
            }
        };
    })();


    useEffect(() => {
        if (cyRef.current) {
            const cy = cyRef.current;

            cy.on('select', 'node', (event) => {
                const selectedNodeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newNodes = prevSelection.nodes.includes(selectedNodeId)
                        ? prevSelection.nodes
                        : [...prevSelection.nodes, selectedNodeId];
                    return { ...prevSelection, nodes: newNodes };
                });
            });

            cy.on('unselect', 'node', (event) => {
                const unselectedNodeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newNodes = prevSelection.nodes.filter(id => id !== unselectedNodeId);
                    return { ...prevSelection, nodes: newNodes };
                });
            });

            cy.on('select', 'edge', (event) => {
                const selectedEdgeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newEdges = prevSelection.edges.includes(selectedEdgeId)
                        ? prevSelection.edges
                        : [...prevSelection.edges, selectedEdgeId];
                    return { ...prevSelection, edges: newEdges };
                });
            });

            cy.on('unselect', 'edge', (event) => {
                const unselectedEdgeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newEdges = prevSelection.edges.filter(id => id !== unselectedEdgeId);
                    return { ...prevSelection, edges: newEdges };
                });
            });
        }

    }, []);

    useEffect(() => {
        const eulerianPathFinder = new EulerianPathFinder(graphData, setEulerianData);
        eulerianPathFinder.find();
    }, [graphData]);


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
        }}>
            <Toolbox
                graphData={graphData}
                actions={actions}
                selection={selection}
                eulerianData={eulerianData}
                toast={toast}
                setHighlightEulerianPath={setHighlightEulerianPath}
                autoplayEulerianPath={autoplayEulerianPath}
            />
            <GraphContainer
                graphData={graphData}
                cyRef={cyRef}
                eulerianData={eulerianData}
                highlightEulerianPath={highlightEulerianPath}
                setHighlightEulerianPath={setHighlightEulerianPath}
            />
            <ToastContainer
                position="top-right"
                theme="colored"
                autoClose={false}
                transition={Slide}
                style={{
                    marginTop: "50px"
                }}
                toastStyle={{
                    width: "50vW",
                    minWidth: "unset",
                    maxWidth: "100%",
                    padding: "1rem",
                    backgroundColor: "#008000",
                    color: "#fff",
                    marginTop: "1rem",
                }}
            />
        </Box>
    )
};

export default GraphEditor;
