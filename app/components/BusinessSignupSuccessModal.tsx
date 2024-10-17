import React, { useEffect } from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'
import { useAuth } from '~/contexts/authContext'

interface SuccessModalProps {
    open: boolean
    onClose: () => void
}

export default function BusinessSignupSuccessModal({
    open,
    onClose,
}: SuccessModalProps) {
    const { fetchBusinessDetails } = useAuth()
    const [isOpen, setIsOpen] = React.useState(open)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    const handleClose = () => {
        fetchBusinessDetails()
        setIsOpen(false)
        onClose()
    }

    return (
        <Modal
            open={isOpen}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: '#1e1e1e',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <CheckCircleOutline
                    sx={{
                        fontSize: 80,
                        color: '#fff',
                        mb: 2,
                    }}
                />
                <Typography
                    id="success-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ color: '#fff', mb: 2 }}
                >
                    ALL DONE!
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#b8e986',
                        mb: 2,
                        fontWeight: 'bold',
                    }}
                >
                    Your business details have been submitted!
                </Typography>
                <Typography
                    id="success-modal-description"
                    sx={{ color: '#fff', mb: 4 }}
                >
                    Your company information is registered and will be validated
                    by our team within 24 hours.
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{
                        bgcolor: '#fff',
                        color: '#000',
                        '&:hover': {
                            bgcolor: '#e0e0e0',
                        },
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 'bold',
                        py: 1.5,
                        width: '100%',
                    }}
                >
                    Go to dashboard
                </Button>
            </Box>
        </Modal>
    )
}
