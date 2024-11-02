import { Toolbar, Grid } from '@mui/material'
import FAQList from './FAQList'
import AchievementSection from './AchievementSection'
import PopularProductSection from './PopularProductSection'
import DashboardContainer from './DashboardContainer'

export default function DashboardPage() {
    return (
        <DashboardContainer>
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
        </DashboardContainer>
    )
}
