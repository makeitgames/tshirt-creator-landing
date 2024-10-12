import { Grid } from '@mui/material'
import type { ActionFunctionArgs } from '@remix-run/node'
import type { MetaFunction } from '@remix-run/react'
import { json, useLoaderData } from '@remix-run/react'
import { getApp, initializeApp } from 'firebase/app'
import {
    confirmPasswordReset,
    getAuth,
    verifyPasswordResetCode,
} from 'firebase/auth'
import Page from '~/components/Page'
import PasswordResetForm from '~/components/PasswordResetForm'
import { routeConfig } from '~/configs'
import { useGenerateMeta } from '~/hooks/useGenerateMeta'
import type { PasswordResetFormData } from '~/types/form'
import { getRequestFormData } from '~/utils/FormUtils'

const initialCallbackApp = (apiKey: string) => {
    const appName = 'authCallbackApp'
    let app
    try {
        app = getApp(appName)
    } catch (error) {
        // If app is not initialized, initialize it
        app = initializeApp({ apiKey }, appName)
    }

    const auth = getAuth(app)
    if (!auth) throw new Error('Firebase Auth is not initialized.')

    return auth
}

export async function loader({ request }: ActionFunctionArgs) {
    const url = new URL(request.url)
    const oobCode = url.searchParams.get('oobCode')
    const apiKey = url.searchParams.get('apiKey') ?? ''
    const lang = url.searchParams.get('lang') ?? 'en'

    if (!oobCode) {
        return json({ errorMessage: 'Missing oobCode.' }, { status: 400 })
    }

    try {
        const auth = initialCallbackApp(apiKey)
        const email = await verifyPasswordResetCode(auth, oobCode)

        if (email) {
            return json({
                ...routeConfig,
                pageName: 'Reset Your Password',
                oobCode,
                apiKey,
                lang,
                email,
            })
        }
    } catch (err) {
        console.error('Error verifying oobCode:', err) // Log the actual error for debugging
        return json(
            { errorMessage: 'Invalid or expired URL.' },
            { status: 400 },
        )
    }
}

export const meta: MetaFunction = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metaTags = useGenerateMeta()

    return metaTags
}

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const url = new URL(request.url)
        const actionCode = url.searchParams.get('actionCode')
        const apiKey = url.searchParams.get('apiKey') ?? ''

        if (!apiKey || !actionCode) {
            return json(
                {
                    errorMessage: `Missing ${apiKey === null ? 'apiKey' : 'actionCode'} in request header`,
                },
                { status: 400 },
            )
        }

        const auth = initialCallbackApp(apiKey)
        const formData: PasswordResetFormData =
            await getRequestFormData(request)

        // Save the new password.
        await confirmPasswordReset(auth, actionCode, formData.password)
            .then((success) => {
                return json({ success: true })
            })
            .catch((error) => {
                return json(
                    { errorMessage: (error as Error).message },
                    { status: 500 },
                )
            })
    } catch (error) {
        return json({ errorMessage: (error as Error).message }, { status: 500 })
    }

    return json({ success: true })
}

export default function PasswordReset() {
    const data: any = useLoaderData()
    const { email, apiKey, oobCode: actionCode } = data
    return (
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
                    {email ? (
                        <PasswordResetForm
                            email={email}
                            apiKey={apiKey}
                            actionCode={actionCode}
                        />
                    ) : (
                        <h1
                            style={{
                                textAlign: 'center',
                                paddingTop: '50vh',
                                color: '#939191',
                            }}
                        >
                            URL is not valid or expired
                        </h1>
                    )}
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
    )
}
