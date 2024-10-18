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
import { useAuth } from '~/contexts/authContext'
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
    AccountCircle,
    ExitToApp,
    ExpandLess,
    ExpandMore,
    Person,
} from '@mui/icons-material'
import { useState } from 'react'
import BusinessSignupFormModal from './BusinessSignupFormModal'
import BusinessSignupSuccessModal from './BusinessSignupSuccessModal'
import PreBusinessSignupModal from './PreBusinessSignupModal'

export default function SideBarMenu() {
    const { isLoading, user, isBusinessActivate, logout } = useAuth()
    const [isPreBusinessSignupModalOpen, setIsPreBusinessSignupModalOpen] =
        useState<boolean>(false)
    const [isBusinessSignupFormOpen, setIsBusinessSignupFormOpen] =
        useState<boolean>(false)
    const [
        isBusinessSignupSuccessModalOpen,
        setIsBusinessSignupSuccessModalOpen,
    ] = useState<boolean>(false)
    const [accountOpen, setAccountOpen] = useState(false)

    const handleAccountClick = () => {
        setAccountOpen(!accountOpen)
    }

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
                            onClick={() =>
                                setIsPreBusinessSignupModalOpen(true)
                            }
                        />
                    </div>
                )}
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
