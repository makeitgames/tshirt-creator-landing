import {
    CircularProgress,
    Box,
    Avatar,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material'
import { useAuth } from '~/contexts/AuthContext'
import BusinessSetupMenu from './BusinessSetupMenu'
import {
    Home as HomeIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    SellOutlined as SellOutlinedIcon,
    StorefrontOutlined as StorefrontOutlinedIcon,
    ShoppingBagOutlined as ShoppingBagOutlinedIcon,
    CheckroomOutlined as CheckroomOutlinedIcon,
    Business as BusinessIcon,
    BarChart as BarChartIcon,
    QuestionAnswer as QuestionAnswerIcon,
    ExitToApp,
    ExpandLess,
    ExpandMore,
    Person,
    Settings,
    Group,
} from '@mui/icons-material'
import { useState } from 'react'
import BusinessSignupFormModal from './BusinessSignupFormModal'
import BusinessSignupSuccessModal from './BusinessSignupSuccessModal'
import PreBusinessSignupModal from './PreBusinessSignupModal'
import { useNavigate } from '@remix-run/react'

export default function Component() {
    const navigate = useNavigate()
    const { isLoading, user, isBusinessActivate, logout } = useAuth()
    const [isPreBusinessSignupModalOpen, setIsPreBusinessSignupModalOpen] =
        useState<boolean>(false)
    const [isBusinessSignupFormOpen, setIsBusinessSignupFormOpen] =
        useState<boolean>(false)
    const [
        isBusinessSignupSuccessModalOpen,
        setIsBusinessSignupSuccessModalOpen,
    ] = useState<boolean>(false)
    const [settingOpen, setSettingOpen] = useState(false)
    const [organisationOpen, setOrganisationOpen] = useState(false)

    return (
        <>
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
                            src={user?.photoURL ?? '/assets/images/avatar.jpg'}
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
                        { title: 'Home', action: () => navigate('/dashboard') },
                        {
                            title: 'My products',
                            action: () => navigate('/dashboard'),
                        },
                        {
                            title: 'Catalogue',
                            action: () => navigate('/dashboard'),
                        },
                        {
                            title: 'Orders',
                            action: () => navigate('/dashboard'),
                        },
                        {
                            title: 'Users',
                            action: () => navigate('/dashboard'),
                        },
                        { title: 'FAQ', action: () => navigate('/dashboard') },
                    ].map((menu, index) => (
                        <ListItem key={menu.title} disablePadding>
                            <ListItemButton onClick={menu.action}>
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
                                <ListItemText primary={menu.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                {isBusinessActivate ? (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <StorefrontOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Stores" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() =>
                                    setOrganisationOpen(!organisationOpen)
                                }
                            >
                                <ListItemIcon>
                                    <BusinessIcon />
                                </ListItemIcon>
                                <ListItemText primary="Organisation" />
                                {organisationOpen ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItemButton>
                        </ListItem>
                        <Collapse
                            in={organisationOpen}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <Group />
                                    </ListItemIcon>
                                    <ListItemText primary="Members" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {}}>
                                <ListItemIcon>
                                    <SellOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Brands" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Statistics" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                ) : (
                    <div style={{ padding: '12px 6px' }}>
                        <BusinessSetupMenu
                            onClick={() =>
                                setIsPreBusinessSignupModalOpen(true)
                            }
                        />
                    </div>
                )}
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => setSettingOpen(!settingOpen)}
                        >
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                            {settingOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={settingOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={logout}>
                        <ListItemIcon>
                            <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </div>
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
                open={isBusinessSignupSuccessModalOpen}
                onClose={() => {}}
            />
        </>
    )
}
