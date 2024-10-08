import type { MetaFunction } from '@remix-run/react'
import { json, useNavigate } from '@remix-run/react'
import DashboardPage from '~/components/DashboardPage'
import { routeConfig } from '~/configs'
import { useAuth } from '~/contexts/authContext'
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
    const { user } = useAuth()
    const navigate = useNavigate()

    if (user === null) navigate('/login')

    return <DashboardPage />
}
