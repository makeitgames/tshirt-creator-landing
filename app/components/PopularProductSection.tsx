import { useEffect, useState } from 'react'
import { Box, Typography, Grid, useTheme } from '@mui/material'
import type { SxProps, Theme } from '@mui/system'
import StrapiContentTypeService from '~/services/StrapiContentTypeService'
import PopularProductCard from './PopularProductCard'

export default function PopularProductSection({
    sx = {},
}: {
    sx?: SxProps<Theme>
}) {
    const theme = useTheme()

    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await StrapiContentTypeService.getAll('canvas', {
                    populate: ['colors.thumbnails'],
                    pagination: { limit: 3 },
                })
                setProducts(data)
            } catch (error) {
                console.error('Error fetching items:', error)
            }
        }

        fetchItems()
    }, [])

    return (
        <Box sx={{ padding: theme.spacing(4), ...sx }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Trending right now
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Start creating with our three most popular products.
            </Typography>
            <Grid container spacing={1}>
                {products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <PopularProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
