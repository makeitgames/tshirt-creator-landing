import { Grid } from '@mui/material'
import type { ActionFunctionArgs } from '@remix-run/node'
import type { MetaFunction } from '@remix-run/react'
import { json } from '@remix-run/react'
import { DisableThemingWrapper } from '~/components/DisableThemingWrapper'
import Page from '~/components/Page'
import { routeConfig } from '~/configs'
import { useGenerateMeta } from '~/hooks/useGenerateMeta'

export async function loader({ request }: ActionFunctionArgs) {
    return json({
        ...routeConfig,
        pageName: 'Verification Success',
    })
}

export const meta: MetaFunction = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metaTags = useGenerateMeta()

    return metaTags
}

export default function VerificationSuccess() {
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
                                padding: {
                                    xs: '4vh 16vw',
                                    md: '6vh 20vw',
                                    lg: '0 18vw',
                                },
                            },
                        }}
                    >
                        <h1
                            style={{
                                textAlign: 'center',
                                paddingTop: '50vh',
                                color: '#17a84a',
                            }}
                        >
                            Verification Success
                        </h1>
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
