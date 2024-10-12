import * as React from 'react'
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
    isRouteErrorResponse,
    json,
    useLoaderData,
} from '@remix-run/react'
import { withEmotionCache } from '@emotion/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import theme from './theme'
import ClientStyleContext from './ClientStyleContext'
import type { LoaderFunction } from '@remix-run/node'
import { firebaseConfig, strapiConfig } from './configs'
import { AuthProvider } from './contexts/authContext'
import styles from './main.css'

export const links = () => [{ rel: 'stylesheet', href: styles }]

interface DocumentProps {
    children: React.ReactNode
    title?: string
}

// Define the loader function
export const loader: LoaderFunction = async () => {
    return json({ firebaseConfig, strapiConfig })
}

const Document = withEmotionCache(
    ({ children, title }: DocumentProps, emotionCache) => {
        const clientStyleData = React.useContext(ClientStyleContext)

        // Only executed on client
        useEnhancedEffect(() => {
            // re-link sheet container
            emotionCache.sheet.container = document.head
            // re-inject tags
            const tags = emotionCache.sheet.tags
            emotionCache.sheet.flush()
            tags.forEach((tag) => {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;(emotionCache.sheet as any)._insertTag(tag)
            })
            // reset cache to reapply global styles
            clientStyleData.reset()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width,initial-scale=1"
                    />
                    <meta
                        name="theme-color"
                        content={theme.palette.primary.main}
                    />
                    {title ? <title>{title}</title> : null}
                    <Meta />
                    <Links />
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin=""
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
                    />
                    <meta
                        name="emotion-insertion-point"
                        content="emotion-insertion-point"
                    />
                </head>
                <body>
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                    <LiveReload />
                </body>
            </html>
        )
    },
)

// https://remix.run/docs/en/main/route/component
// https://remix.run/docs/en/main/file-conventions/routes
export default function App() {
    const { firebaseConfig, strapiConfig } = useLoaderData<typeof loader>()

    return (
        <AuthProvider
            firebaseConfig={firebaseConfig}
            strapiConfig={strapiConfig}
        >
            <Document>
                <Outlet />
            </Document>
        </AuthProvider>
    )
}

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
    const error = useRouteError()

    if (isRouteErrorResponse(error)) {
        let message
        switch (error.status) {
            case 401:
                message = (
                    <p>
                        Oops! Looks like you tried to visit a page that you do
                        not have access to.
                    </p>
                )
                break
            case 404:
                message = (
                    <p>
                        Oops! Looks like you tried to visit a page that does not
                        exist.
                    </p>
                )
                break

            default:
                throw new Error(error.data || error.statusText)
        }

        return (
            <Document title={`${error.status} ${error.statusText}`}>
                <h1>
                    {error.status}: {error.statusText}
                </h1>
                {message}
            </Document>
        )
    }

    if (error instanceof Error) {
        console.error(error)
        return (
            <Document title="Error!">
                <div>
                    <h1>There was an error</h1>
                    <p>{error.message}</p>
                    <hr />
                    <p>
                        Hey, developer, you should replace this with what you
                        want your users to see.
                    </p>
                </div>
            </Document>
        )
    }

    return <h1>Unknown Error</h1>
}
