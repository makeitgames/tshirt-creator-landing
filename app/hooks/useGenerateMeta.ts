import { useMatches } from '@remix-run/react'
import { useLocation } from 'react-router-dom'

export const useGenerateMeta = () => {
    const location = useLocation()
    const matches = useMatches()
    const locationPath =
        location.pathname.split('/').filter(Boolean).pop() ?? ''
    const defaultPageName = locationPath === '' ? 'Home' : undefined
    const match = matches.find(
        (match: { id: string }) =>
            match.id ===
            `routes/${defaultPageName !== 'Home' ? locationPath : '_index'}`,
    )
    const data: any = match?.data
    // const appName = data?.appName
    const pageName = (
        defaultPageName ||
        data?.pageName ||
        `${locationPath.charAt(0).toUpperCase() + locationPath.slice(1)}`
    ).replace('-', ' ')
    const title = pageName
    const description = data?.description || 'Default description for the page.'

    return [
        { title },
        { property: 'og:title', content: title },
        { name: 'description', content: description },
    ]
}
