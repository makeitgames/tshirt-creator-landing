import { Grid } from '@mui/material'
import type { MetaFunction } from '@remix-run/react'
import { json } from '@remix-run/react'
import { DisableThemingWrapper } from '~/components/DisableThemingWrapper'
import Page from '~/components/Page'
import SignUpForm from '~/components/SignUpForm'
import { routeConfig } from '~/configs'
import { useGenerateMeta } from '~/hooks/useGenerateMeta'

export function loader() {
    return json(routeConfig)
}

export const meta: MetaFunction = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metaTags = useGenerateMeta()

    return metaTags
}

export default function SignUp() {
    return (
        <DisableThemingWrapper>
            <Page>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={7}
                        sx={{
                            '& > div': {
                                maxWidth: {
                                    xs: 'none',
                                    md: 'none',
                                    lg: '36vw',
                                },
                                padding: {
                                    xs: '4vh 16vw',
                                    md: '6vh 20vw',
                                    lg: '0 4vw',
                                },
                            },
                        }}
                    >
                        <SignUpForm />
                    </Grid>
                    <Grid item xs={0} md={0} lg={5}>
                        <div
                            style={{
                                height: '100vh',
                                backgroundImage:
                                    'url("/assets/images/signup-cover.jpg")',
                                backgroundSize: 'cover',
                            }}
                        ></div>
                    </Grid>
                </Grid>
            </Page>
        </DisableThemingWrapper>
    )
}
