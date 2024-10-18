import * as React from 'react'
import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/react'

import DynamicDrawer from '../components/DynamicDrawer'
import type { Anchor } from '../types/drawer'
import { useGenerateMeta } from '~/hooks/useGenerateMeta'
import Header from '~/components/Header'
import HamburgerButton from '~/components/HamburgerButton'
import MainCarousel from '~/components/MainCarousel'
import Page from '~/components/Page'
import { Grid } from '@mui/material'
import ContactUsForm from '~/components/ContactUsForm'
import Footer from '~/components/Footer'
import { routeConfig } from '~/configs'
import { DisableThemingWrapper } from '~/components/DisableThemingWrapper'

export function loader() {
    return json(routeConfig)
}

export const meta: MetaFunction = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metaTags = useGenerateMeta()

    return metaTags
}

export default function Index() {
    const position: Anchor = 'right'
    const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false)

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    return (
        <DisableThemingWrapper>
            <Page>
                <Header />
                <HamburgerButton />
                <DynamicDrawer
                    position={position}
                    isDrawerOpen={isDrawerOpen}
                    onClose={handleDrawerClose}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MainCarousel autoPlay />
                    </Grid>
                    <Grid item xs={12} className="section-container">
                        <Grid className="contact-us-container" container>
                            <Grid
                                className="contact-us-form-container"
                                item
                                xs={12}
                                md={6}
                            >
                                <ContactUsForm />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: { xs: 'none', md: 'block' } }}
                            >
                                <div className="contact-us-cover-container">
                                    <img
                                        className="contact-us-cover"
                                        src="assets/images/contact-us-cover2.jpg"
                                        alt="contact-us-cover"
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className="section-container">
                        <Footer />
                    </Grid>
                </Grid>
            </Page>
        </DisableThemingWrapper>
    )
}
