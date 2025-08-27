import React, { useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Box from '@mui/material/Box';
import cytoscape from "cytoscape";
import svg from "cytoscape-svg";

svg(cytoscape);
const GraphContainer = ({ graphData, cyRef, eulerianData, highlightEulerianPath, setHighlightEulerianPath  }) => {

    // 🔁 Reset styles when graphData changes
    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.edges().forEach(edge => {
            edge.style({ 'line-color': '#999', 'width': 2 });
        });
    }, [graphData]);


    useEffect(() => {
        const cy = cyRef.current;
        if (!cy || !highlightEulerianPath || !eulerianData.path || eulerianData.path.length < 2) return;

        // Reset all edges to default style
        cy.edges().forEach(edge => {
            edge.style({
                'line-color': '#999',
                'width': 2
            });
        });

        // Highlight edges in Eulerian path
        for (let i = 0; i < eulerianData.path.length - 1; i++) {
            const source = eulerianData.path[i];
            const target = eulerianData.path[i + 1];

            const matchingEdges = cy.edges().filter(edge =>
                (edge.data('source') === source && edge.data('target') === target) ||
                (edge.data('source') === target && edge.data('target') === source)
            );

            matchingEdges.forEach(edge => {
                edge.style({
                    'line-color': 'red',
                    'width': 4
                });
            });
        }
        // Reset trigger flag
        setHighlightEulerianPath(false);

    }, [eulerianData, highlightEulerianPath]);

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid black'
            }}
            // className={eulerianData.color}
        >
            <CytoscapeComponent
                className='GraphContainer'
                cy={(cy) => { cyRef.current = cy; }}
                elements={CytoscapeComponent.normalizeElements({ nodes: graphData.nodes, edges: graphData.edges })}
                style={{ width: '100%', height: '100%' }}
            />
        </Box>
    );
};

export default GraphContainer;
