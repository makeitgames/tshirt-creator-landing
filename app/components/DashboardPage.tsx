import { useEffect, useState } from 'react'
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    Toolbar,
    Button,
    Grid,
    Badge,
    Divider,
} from '@mui/material'
import {
    Menu as MenuIcon,
    LocationOn as LocationOnIcon,
    ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material'
import FAQList from './FAQList'
import { useAuth } from '~/contexts/AuthContext'
import { useNavigate } from '@remix-run/react'
import SideBarMenu from './SideBarMenu'
import ThemeToggleButton from './ThemeToggleButton'
import AchievementSection from './AchievementSection'
import PopularProductSection from './PopularProductSection'

const drawerWidth = 240

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        if (user === null) navigate('/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    color="default"
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Spacer to push the buttons to the right */}
                        <Box sx={{ flexGrow: 1 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: '0 12px',
                            }}
                        >
                            <ThemeToggleButton />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                sx={{
                                    backgroundColor: '#e8e7e7',
                                    color: '#000',
                                }}
                                startIcon={<LocationOnIcon />}
                            >
                                Thailand
                            </Button>
                            <Divider
                                orientation="vertical"
                                sx={{ height: '30px', padding: '0 8px' }}
                            />
                            <Button color="inherit" sx={{ ml: 2 }}>
                                ฿260.50
                                <Badge
                                    badgeContent={1}
                                    color="error"
                                    sx={{ ml: 1 }}
                                >
                                    <ShoppingBagIcon />
                                </Badge>
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                    >
                        <SideBarMenu />
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                        open
                    >
                        <SideBarMenu />
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: {
                            sm: `calc(100% - ${drawerWidth}px)`,
                            padding: '4vh 8vw',
                        },
                    }}
                >
                    <Toolbar />
                    <AchievementSection />
                    <PopularProductSection
                        sx={{
                            pt: 8,
                            display: { xs: 'none', md: 'block' },
                        }}
                    />
                    <Grid container>
                        <Grid item xs={12}>
                            <FAQList sx={{ pt: 8 }} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}
