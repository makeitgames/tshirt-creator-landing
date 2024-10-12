import { useEffect, useState } from 'react'
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    Card,
    CardMedia,
    Grid,
    Badge,
    Divider,
    Avatar,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    Collapse,
} from '@mui/material'
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    LocationOn as LocationOnIcon,
    ShoppingBag as ShoppingBagIcon,
    CheckCircleRounded as CheckCircleRoundedIcon,
    BusinessOutlined as BusinessOutlinedIcon,
    SellOutlined as SellOutlinedIcon,
    StorefrontOutlined as StorefrontOutlinedIcon,
    FileUploadOutlined as FileUploadOutlinedIcon,
    ShoppingBagOutlined as ShoppingBagOutlinedIcon,
    CheckroomOutlined as CheckroomOutlinedIcon,
    Business as BusinessIcon,
    BarChart as BarChartIcon,
    QuestionAnswer as QuestionAnswerIcon,
    AccountCircle,
    ExitToApp,
    ExpandLess,
    ExpandMore,
    Person,
} from '@mui/icons-material'
import BusinessSignupFormModal from './BusinessSignupFormModal'
import PreBusinessSignupModal from './PreBusinessSignupModal'
import FAQList from './FAQList'
import { useAuth } from '~/contexts/authContext'
import BusinessSignupSuccessModal from './BusinessSignupSuccessModal'
import BusinessSetupMenu from './BusinessSetupMenu'
import { useNavigate } from '@remix-run/react'

const drawerWidth = 240

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, isLoading, isBusinessActivate, logout } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [expandedPanel, setExpandedPanel] = useState<string | false>(false)
    const [isBusinessSignupFormOpen, setIsBusinessSignupFormOpen] =
        useState<boolean>(false)
    const [isPreBusinessSignupModalOpen, setIsPreBusinessSignupModalOpen] =
        useState<boolean>(false)
    const [
        isBusinessSignupSuccessModalOpen,
        setIsBusinessSignupSuccessModalOpen,
    ] = useState<boolean>(false)
    const [accountOpen, setAccountOpen] = useState(false)

    const handleAccountClick = () => {
        setAccountOpen(!accountOpen)
    }

    useEffect(() => {
        if (user === null) navigate('/login')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleAccordionChange =
        (panel: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedPanel(isExpanded ? panel : false)
        }

    const drawer = (
        <div>
            {isLoading ? (
                <div
                    style={{
                        width: 'auto',
                        height: 'auto',
                        textAlign: 'center',
                        padding: '18px 0',
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                        pt: 2,
                    }}
                >
                    <Avatar
                        alt="User Avatar"
                        src={user?.photoURL ?? '/assets/images/avatar.jpg'} // Path to the user's avatar image
                        sx={{ width: 56, height: 56 }}
                    />
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        {user?.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manager
                    </Typography>
                </Box>
            )}
            <Divider />
            <List>
                {[
                    'Home',
                    'My products',
                    'Catalogue',
                    'Orders',
                    'Users',
                    'FAQ',
                ].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index === 0 ? (
                                    <HomeIcon />
                                ) : index === 1 ? (
                                    <CheckroomOutlinedIcon />
                                ) : index === 2 ? (
                                    <ShoppingCartIcon />
                                ) : index === 3 ? (
                                    <ShoppingBagOutlinedIcon />
                                ) : index === 4 ? (
                                    <PeopleIcon />
                                ) : (
                                    <QuestionAnswerIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            {isBusinessActivate ? (
                <List>
                    {['Stores', 'Organisation', 'Brands', 'Statistics'].map(
                        (text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    onClick={
                                        index === 1
                                            ? () => {} // handel here
                                            : () => {}
                                    }
                                >
                                    <ListItemIcon>
                                        {index === 0 ? (
                                            <StorefrontOutlinedIcon />
                                        ) : index === 1 ? (
                                            <BusinessIcon />
                                        ) : index === 2 ? (
                                            <SellOutlinedIcon />
                                        ) : (
                                            <BarChartIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ),
                    )}
                </List>
            ) : (
                <div style={{ padding: '12px 6px' }}>
                    <BusinessSetupMenu
                        onClick={() => setIsPreBusinessSignupModalOpen(true)}
                    />
                </div>
            )}
            <Divider />
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleAccountClick}>
                        <ListItemIcon>
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary="Account" />
                        {accountOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <Person />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={logout}>
                            <ListItemIcon>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    )

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        backgroundColor: '#fff',
                        color: '#000',
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
                        {drawer}
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
                        {drawer}
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
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    style={{ height: '52vh' }}
                                    image="/assets/images/carousel-1.jpg"
                                    alt="Product design"
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        padding: '32px 24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Typography variant="overline" gutterBottom>
                                        THE FUN PART
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        gutterBottom
                                    >
                                        Get your hands on the good stuff
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        The time has come... Order your design
                                        and feel that crisp, fresh print in your
                                        hands. Bring your design to life and
                                        love it to threads!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            alignSelf: 'flex-start',
                                            backgroundColor: '#dbeed8',
                                            color: '#000',
                                            borderRadius: '1px',
                                        }}
                                    >
                                        SAMPLE THE GOODS
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ t: 1 }}>
                            <Accordion
                                className="expandable-card-item"
                                expanded={expandedPanel === 'panel1'}
                                onChange={handleAccordionChange('panel1')}
                                variant="outlined"
                            >
                                <AccordionSummary
                                    aria-controls="create-product-content"
                                    id="create-product-header"
                                >
                                    <Grid container>
                                        <Grid item xs={1}>
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    color: 'green',
                                                    mt: 1,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Grid
                                                container
                                                sx={{ pl: { xs: 2, md: 3 } }}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Create product
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        sx={{ color: 'green' }}
                                                    >
                                                        complete
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Unleash your creativity and go create
                                        your first product!
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                className="expandable-card-item"
                                expanded={expandedPanel === 'panel2'}
                                onChange={handleAccordionChange('panel2')}
                                variant="outlined"
                            >
                                <AccordionSummary
                                    aria-controls="verify-business-content"
                                    id="verify-business-header"
                                >
                                    <Grid container>
                                        <Grid item xs={1}>
                                            <div
                                                style={{
                                                    backgroundColor: '#bbbbbb',
                                                    borderRadius: '50%',
                                                    marginTop: 8,
                                                    width: 36,
                                                    height: 36,
                                                }}
                                            >
                                                <BusinessOutlinedIcon
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        mt: 1,
                                                        color: '#fff',
                                                        ml: 1,
                                                    }}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Grid
                                                container
                                                sx={{ pl: { xs: 2, md: 3 } }}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Verify your business
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography
                                                        sx={{ color: 'orange' }}
                                                    >
                                                        In review
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        In To start selling your merch online
                                        and pay via invoice, we need proof that
                                        you have a legally registered business.
                                        Once we receive and verify, you’re all
                                        set to go. It’s a quick job you only
                                        need to do once.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                className="expandable-card-item"
                                expanded={expandedPanel === 'panel3'}
                                onChange={handleAccordionChange('panel3')}
                                variant="outlined"
                            >
                                <AccordionSummary
                                    aria-controls="order-design-content"
                                    id="order-design-header"
                                >
                                    <Grid container>
                                        <Grid item xs={1}>
                                            <div
                                                style={{
                                                    backgroundColor: '#bbbbbb',
                                                    borderRadius: '50%',
                                                    width: 36,
                                                    height: 36,
                                                }}
                                            >
                                                <SellOutlinedIcon
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        mt: 1,
                                                        color: '#fff',
                                                        ml: 1,
                                                    }}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Grid
                                                container
                                                sx={{ pl: { xs: 2, md: 3 } }}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Order your desisgn
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Nothing beats that fresh merch feeling.
                                        So hit the happy 'confirm' button and
                                        order your new design. It'll be in your
                                        hands in days.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                className="expandable-card-item"
                                expanded={expandedPanel === 'panel4'}
                                onChange={handleAccordionChange('panel4')}
                                variant="outlined"
                            >
                                <AccordionSummary
                                    aria-controls="connect-to-store"
                                    id="connect-to-store"
                                >
                                    <Grid container>
                                        <Grid item xs={1}>
                                            <div
                                                style={{
                                                    backgroundColor: '#bbbbbb',
                                                    borderRadius: '50%',
                                                    width: 36,
                                                    height: 36,
                                                }}
                                            >
                                                <StorefrontOutlinedIcon
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        mt: 1,
                                                        color: '#fff',
                                                        ml: 1,
                                                    }}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Grid
                                                container
                                                sx={{ pl: { xs: 2, md: 3 } }}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Connect to store
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Use our integrations to connect with
                                        your Shopify. It takes just a few clicks
                                        to reach more customers than ever before
                                        and become a merch powerhouse.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                className="expandable-card-item"
                                expanded={expandedPanel === 'panel5'}
                                onChange={handleAccordionChange('panel5')}
                                variant="outlined"
                            >
                                <AccordionSummary
                                    aria-controls="connect-to-store"
                                    id="connect-to-store"
                                >
                                    <Grid container>
                                        <Grid item xs={1}>
                                            <div
                                                style={{
                                                    backgroundColor: '#bbbbbb',
                                                    borderRadius: '50%',
                                                    width: 36,
                                                    height: 36,
                                                }}
                                            >
                                                <FileUploadOutlinedIcon
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        mt: 1,
                                                        color: '#fff',
                                                        ml: 1,
                                                    }}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={11}>
                                            <Grid
                                                container
                                                sx={{ pl: { xs: 2, md: 3 } }}
                                            >
                                                <Grid item xs={12}>
                                                    <Typography variant="h6">
                                                        Export products
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        With your business verified and your
                                        store connected, you’re free to export
                                        your merch instantly to your e-store and
                                        sell to your fans.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <FAQList sx={{ pt: 8 }} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <PreBusinessSignupModal
                open={isPreBusinessSignupModalOpen && !isBusinessActivate}
                onClose={() => {
                    setIsPreBusinessSignupModalOpen(false)
                }}
                onContinue={() => {
                    setIsPreBusinessSignupModalOpen(false)
                    setIsBusinessSignupFormOpen(true)
                }}
            />
            <BusinessSignupFormModal
                open={isBusinessSignupFormOpen && !isBusinessActivate}
                onClose={() => {
                    setIsBusinessSignupFormOpen(false)
                }}
                onSuccess={() => {
                    setIsBusinessSignupFormOpen(false)
                    setIsBusinessSignupSuccessModalOpen(true)
                }}
            />
            <BusinessSignupSuccessModal
                open={isBusinessSignupSuccessModalOpen && !isBusinessActivate}
                onClose={() => {}}
            />
        </>
    )
}
