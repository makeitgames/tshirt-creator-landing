// app/components/Page.tsx
import { CircularProgress } from '@mui/material'
import { useNavigate } from '@remix-run/react'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { useAuth } from '~/contexts/AuthContext'
import { getLocalStorageItem } from '~/utils/localStorage'

interface AuthenticationPageProps {
    children: ReactNode
}

const AuthenticationPage: FC<AuthenticationPageProps> = ({ children }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    useEffect(() => {
        if (!user) {
            // to prevent time gaps during user loading
            const cacheUser = getLocalStorageItem('user')
            if (user === cacheUser) {
                navigate('/login')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            {user ? (
                children
            ) : (
                <CircularProgress
                    size="8rem"
                    sx={{
                        mt: '40vh',
                        ml: '50vw',
                        color: '#ffa62a',
                    }}
                />
            )}
        </div>
    )
}

export default AuthenticationPage
