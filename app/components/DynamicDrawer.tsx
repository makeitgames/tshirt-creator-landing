import type { FC } from 'react'
import { Fragment, useEffect, useState } from 'react'
import type { Anchor, DrawerOpenState } from '../types/drawer'
import {
    Box,
    Button,
    Drawer,
    Grid,
    List,
    ListItemButton,
    Typography,
} from '@mui/material'
import { useAuth } from '~/contexts/AuthContext'
import { useNavigate } from '@remix-run/react'

interface DynamicDrawerProps {
    position: Anchor
    isDrawerOpen: boolean
    onClose: () => void
}

const DynamicDrawer: FC<DynamicDrawerProps> = ({
    position,
    isDrawerOpen = false,
    onClose,
}) => {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [drawerPositionOpenState, setDrawerPositionOpenState] =
        useState<DrawerOpenState>({
            top: false,
            left: false,
            bottom: false,
            right: false,
        })

    useEffect(() => {
        setDrawerPositionOpenState({
            ...drawerPositionOpenState,
            [position]: isDrawerOpen,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDrawerOpen])

    const handleClose = () => {
        setDrawerPositionOpenState({
            ...drawerPositionOpenState,
            [position]: false,
        })

        onClose()
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            handleClose()
        }
    }

    const list = (anchor: Anchor) => (
        <Box
            sx={{
                width:
                    anchor === 'top' || anchor === 'bottom'
                        ? '90vw'
                        : { lg: '25vw', md: '45vw', sm: '40vh', xs: '40vh' },
                height: '60vh',
                padding: 5,
                zIndex: '9999',
            }}
            role="presentation"
        >
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Typography
                        className="drawer-title"
                        variant="h5"
                        sx={{
                            marginBottom: 2,
                            textTransform: !user ? 'uppercase' : 'none',
                            paddingTop: '8px',
                        }}
                    >
                        {user
                            ? `Welcome, ${user?.displayName}`
                            : 'This is your studio'}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="outlined"
                        sx={{
                            width: '24px',
                            height: '30px',
                            backgroundColor: 'transparent',
                            border: '1px solid #000',
                            color: '#000',
                        }}
                        onClick={handleClose}
                    >
                        X
                    </Button>
                </Grid>
            </Grid>

            {/* Two-column text menu */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <List>
                        <ListItemButton
                            component="a"
                            onClick={() => scrollToSection('contact-us')}
                        >
                            <div className="menu-list-item">Contact Us</div>
                        </ListItemButton>
                        {user !== null && (
                            <ListItemButton
                                component="a"
                                onClick={() => navigate('/dashboard')}
                            >
                                <div className="menu-list-item">
                                    Your Dashboard
                                </div>
                            </ListItemButton>
                        )}
                    </List>
                </Grid>
            </Grid>

            {/* Sign Up and Log In buttons */}
            <Grid
                container
                spacing={2}
                sx={{
                    paddingTop:
                        anchor === 'bottom' || anchor === 'top'
                            ? '30vh'
                            : { md: '75vh', sm: '70vh', xs: '70vh' },
                }}
            >
                {user === null ? (
                    <>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                href="/signup"
                                sx={{
                                    marginBottom: 1,
                                    backgroundColor: '#000',
                                    color: '#fff',
                                }}
                            >
                                Sign Up
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                sx={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #000',
                                    color: '#000',
                                }}
                                href="/login"
                            >
                                Log In
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                sx={{
                                    backgroundColor: '#000',
                                    border: '1px solid #000',
                                    color: '#fff',
                                }}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    )

    return (
        <div>
            <Fragment key={position}>
                <Drawer
                    className="dynamic-drawer"
                    anchor={position}
                    open={drawerPositionOpenState[position]}
                    onClose={handleClose}
                >
                    {list(position)}
                </Drawer>
            </Fragment>
        </div>
    )
}

export default DynamicDrawer
