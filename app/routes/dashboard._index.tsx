import type { MetaFunction } from '@remix-run/react'
import { json } from '@remix-run/react'
import AuthenticationPage from '~/components/AuthenticationPage'
import DashboardPage from '~/components/DashboardPage'
import { routeConfig } from '~/configs'
import { useGenerateMeta } from '~/hooks/useGenerateMeta'

export function loader() {
    return json({
        ...routeConfig,
        pageName: 'Dashboard',
    })
}

export const meta: MetaFunction = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metaTags = useGenerateMeta()

    return metaTags
}

export default function DashboardLayout() {
    return (
        <AuthenticationPage>
            <DashboardPage />
        </AuthenticationPage>
    )
}
