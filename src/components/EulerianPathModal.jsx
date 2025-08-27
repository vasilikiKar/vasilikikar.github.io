import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const EulerianPathModal = ({ showModal, setShowModal, eulerianPath }) => {
    const formattedPath = eulerianPath.join(' → ');
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translate(-50%, -15%)',
                width: 700,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                boxShadow: 24,
                borderRadius: '3px',
                p: 2,
                overflow: 'auto'
            }}>
                <Typography variant="body2">
                    {formattedPath}
                </Typography>

            </Box>
        </Modal>
    )
};
export default EulerianPathModal;