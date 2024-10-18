import React, { useEffect } from 'react'
import { useThemeContext } from '~/contexts/ThemeContext'

interface DisableThemingWrapperProps {
    children: React.ReactNode
}

export function DisableThemingWrapper({
    children,
}: DisableThemingWrapperProps) {
    const { setDisableTheming } = useThemeContext()

    useEffect(() => {
        setDisableTheming(true)
        return () => setDisableTheming(false)
    }, [setDisableTheming])

    return <>{children}</>
}
