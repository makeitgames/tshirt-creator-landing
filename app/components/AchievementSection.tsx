import {
    Grid,
    Card,
    CardMedia,
    Box,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    SxProps,
    Theme,
} from '@mui/material'
import {
    CheckCircleRounded as CheckCircleRoundedIcon,
    BusinessOutlined as BusinessOutlinedIcon,
    SellOutlined as SellOutlinedIcon,
    StorefrontOutlined as StorefrontOutlinedIcon,
    FileUploadOutlined as FileUploadOutlinedIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { useThemeContext } from '~/contexts/ThemeContext'

export default function AchievementSection() {
    const { mode } = useThemeContext()
    const [expandedPanel, setExpandedPanel] = useState<string | false>(false)
    const AccordionStyle: SxProps<Theme> = {
        border: `${mode === 'dark' ? '0px' : ''}`,
    }
    const AccordionSummaryStyle: SxProps<Theme> = {
        backgroundColor: `${mode === 'dark' ? '#212121' : '#f5f5f5'}`,
        color: `${mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)'}`,
    }
    const AccordionDetailsStyle: SxProps<Theme> = {
        backgroundColor: `${mode === 'dark' ? '#212121' : '#f5f5f5'}`,
        color: `${mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)'}`,
    }

    const handleAccordionChange =
        (panel: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedPanel(isExpanded ? panel : false)
        }

    return (
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
                        <Typography variant="h4" component="div" gutterBottom>
                            Get your hands on the good stuff
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            The time has come... Order your design and feel that
                            crisp, fresh print in your hands. Bring your design
                            to life and love it to threads!
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
                    sx={AccordionStyle}
                >
                    <AccordionSummary
                        aria-controls="create-product-content"
                        id="create-product-header"
                        sx={AccordionSummaryStyle}
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
                                <Grid container sx={{ pl: { xs: 2, md: 3 } }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Create product
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ color: 'green' }}>
                                            complete
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={AccordionDetailsStyle}>
                        <Typography variant="body2" color="text.secondary">
                            Unleash your creativity and go create your first
                            product!
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    className="expandable-card-item"
                    expanded={expandedPanel === 'panel2'}
                    onChange={handleAccordionChange('panel2')}
                    variant="outlined"
                    sx={AccordionStyle}
                >
                    <AccordionSummary
                        aria-controls="verify-business-content"
                        id="verify-business-header"
                        sx={AccordionSummaryStyle}
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
                                <Grid container sx={{ pl: { xs: 2, md: 3 } }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Verify your business
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ color: 'orange' }}>
                                            In review
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={AccordionDetailsStyle}>
                        <Typography variant="body2" color="text.secondary">
                            In To start selling your merch online and pay via
                            invoice, we need proof that you have a legally
                            registered business. Once we receive and verify,
                            you’re all set to go. It’s a quick job you only need
                            to do once.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    className="expandable-card-item"
                    expanded={expandedPanel === 'panel3'}
                    onChange={handleAccordionChange('panel3')}
                    variant="outlined"
                    sx={AccordionStyle}
                >
                    <AccordionSummary
                        aria-controls="order-design-content"
                        id="order-design-header"
                        sx={AccordionSummaryStyle}
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
                                <Grid container sx={{ pl: { xs: 2, md: 3 } }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Order your design
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={AccordionDetailsStyle}>
                        <Typography variant="body2" color="text.secondary">
                            Nothing beats that fresh merch feeling. So hit the
                            happy 'confirm' button and order your new design.
                            It'll be in your hands in days.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    className="expandable-card-item"
                    expanded={expandedPanel === 'panel4'}
                    onChange={handleAccordionChange('panel4')}
                    variant="outlined"
                    sx={AccordionStyle}
                >
                    <AccordionSummary
                        aria-controls="connect-to-store"
                        id="connect-to-store"
                        sx={AccordionSummaryStyle}
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
                                <Grid container sx={{ pl: { xs: 2, md: 3 } }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Connect to store
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={AccordionDetailsStyle}>
                        <Typography variant="body2" color="text.secondary">
                            Use our integrations to connect with your Shopify.
                            It takes just a few clicks to reach more customers
                            than ever before and become a merch powerhouse.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    className="expandable-card-item"
                    expanded={expandedPanel === 'panel5'}
                    onChange={handleAccordionChange('panel5')}
                    variant="outlined"
                    sx={AccordionStyle}
                >
                    <AccordionSummary
                        aria-controls="connect-to-store"
                        id="connect-to-store"
                        sx={AccordionSummaryStyle}
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
                                <Grid container sx={{ pl: { xs: 2, md: 3 } }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            Export products
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={AccordionDetailsStyle}>
                        <Typography variant="body2" color="text.secondary">
                            With your business verified and your store
                            connected, you’re free to export your merch
                            instantly to your e-store and sell to your fans.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    )
}
