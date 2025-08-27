import React from 'react';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {Stack} from "@mui/material";
import {toast} from "react-toastify";


const ToolboxButton = ({ variant, text, color, icon, action, disabled = false }) => {
    return (
        <Button
            variant= {variant}
            color={color}
            onClick={action}
            endIcon={icon}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={disabled}
            sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease', // smooth animation
                '&:hover': {
                    transform: 'translateY(-2px)', // slight lift on hover
                    boxShadow: 3, // Material UI shadow preset
                    backgroundColor: color === 'success'
                        ? '#43a047' // slightly darker green for hover
                        : color === 'error'
                            ? '#d32f2f'
                            : undefined
                },
                '&:active': {
                    transform: 'translateY(0)', // reset lift when pressed
                    boxShadow: 1
                }
            }}
        >
            {text}
        </Button>
    );
};

const Actions = ({ actions, eulerianData, setShowModal, setHighlightEulerianPath, stepEulerianPath, resetEulerianStep, autoplayEulerianPath }) => {
    return (
        <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1}>
                    <ToolboxButton
                        variant='contained'
                        text='Add Vertex'
                        color='success'
                        icon={<AddCircleOutlinedIcon />}
                        action={actions.addNode}
                    />
                    <ToolboxButton
                        variant='contained'
                        text='Add Edge'
                        color='success'
                        icon={<LinkOutlinedIcon />}
                        action={actions.addEdge}
                    />
                    <ToolboxButton
                        variant='contained'
                        text='Remove Selected'
                        color='error'
                        icon={<CancelOutlinedIcon />}
                        action={actions.removeSelected}
                    />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <ToolboxButton
                        variant='outlined'
                        text='Find Eulerian Path'
                        color='success'
                        icon={<VisibilityOutlinedIcon />}
                        action={() => {
                            if (eulerianData.path.length) {
                                toast.dismiss();
                                toast(
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            Eulerian path: {eulerianData.path.join(' → ')}
                                        </div>
                                        <button
                                            onClick={autoplayEulerianPath}
                                            style={{
                                                padding: '0.5rem',
                                                backgroundColor: 'white',
                                                color: '#636363',
                                                border: 'none',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                width: '150px',
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                marginTop: '0.5rem'
                                            }}
                                        >
                                            Step-by-Step
                                        </button>
                                    </div>
                                );
                                setHighlightEulerianPath(true);
                            } else {
                                toast.dismiss();
                                toast.warn("No Eulerian path found.");
                            }
                        }
                        }
                    />
                    <ToolboxButton
                        variant='outlined'
                        text='Find Eulerian Cycle'
                        color='success'
                        icon={<VisibilityOutlinedIcon />}
                        action={() => {
                            if (eulerianData.type === 'cycle') {
                                toast.dismiss();
                                toast(
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            Eulerian cycle: {eulerianData.path.join(' → ')}
                                        </div>
                                        <button
                                            onClick={autoplayEulerianPath}
                                            style={{
                                                padding: '0.5rem',
                                                    backgroundColor: 'white',
                                                    color: '#636363',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    width: '150px',
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem',
                                                marginTop: '0.5rem'
                                        }}
                                        >
                                            Step-by-Step
                                        </button>
                                    </div>
                                );
                                setHighlightEulerianPath(true);
                            } else if (eulerianData.type === 'path') {
                                toast.dismiss();
                                toast.warn("This graph has an Eulerian path but not a cycle.");
                            } else {
                                toast.dismiss();
                                toast.error("No Eulerian cycle found.");
                            }
                        }}
                    />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <ToolboxButton
                        variant='contained'
                        text='Save Graph'
                        color='success'
                        icon={<SaveOutlinedIcon />}
                        action={actions.saveGraphAsSVG}
                    />
                    <ToolboxButton
                        variant='contained'
                        text='Clear All'
                        color='error'
                        icon={<DeleteOutlinedIcon />}
                        action={actions.clearAll}
                    />
                </Stack>
            </Box>
        </Toolbar>
    );

};



const Toolbox = ({ actions, eulerianData, showModal, setShowModal, setHighlightEulerianPath, autoplayEulerianPath }) => {
    return (
        <AppBar position="static" color="transparent">
            <Container maxWidth="xl">
                <Actions
                    actions={actions}
                    eulerianData={eulerianData}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setHighlightEulerianPath={setHighlightEulerianPath}
                    autoplayEulerianPath={autoplayEulerianPath}
                />
            </Container>
        </AppBar>
    );
}



export default Toolbox;
