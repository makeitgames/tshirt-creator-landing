import React, { useState } from 'react'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    useTheme,
} from '@mui/material'
import { styled, SxProps, Theme } from '@mui/system'

interface ProductVariant {
    color: string
    image: string
}

interface Product {
    id: string
    name: string
    price: number
    variants: ProductVariant[]
}

interface ColorOptionProps {
    color: string
    selected: boolean
    onClick: () => void
}

const ColorOption = styled('span')<ColorOptionProps>(({ color, selected }) => ({
    display: 'inline-block',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: color,
    margin: '0 4px',
    cursor: 'pointer',
    border: selected ? '2px solid #000' : '2px solid transparent',
    transition: 'border-color 0.3s ease',
}))

const ProductImageWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    '&:hover .create-product-overlay': {
        opacity: 1,
    },
}))

const CreateProductOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
}))

const products: Product[] = [
    {
        id: '1',
        name: 'KODNUM BLACK',
        price: 30.95,
        variants: [
            {
                color: '#000',
                image: '/assets/images/shirt/tshirt-black.png',
            },
            {
                color: '#efefef',
                image: '/assets/images/shirt/tshirt-white.png',
            },
            {
                color: '#D2B48C',
                image: '/assets/images/shirt/tshirt-sand.png',
            },
            {
                color: '#5d2125',
                image: '/assets/images/shirt/tshirt-maroon.png',
            },
        ],
    },
    {
        id: '2',
        name: 'SWEATER',
        price: 30.95,
        variants: [
            {
                color: '#656565',
                image: '/assets/images/shirt/sweater-grey.png',
            },
            {
                color: '#efefef',
                image: '/assets/images/shirt/sweater-white.png',
            },
            {
                color: '#D2B48C',
                image: '/assets/images/shirt/sweater-sand.png',
            },
            {
                color: '#5d2125',
                image: '/assets/images/shirt/sweater-maroon.png',
            },
        ],
    },
    {
        id: '3',
        name: 'KODNUM BLACK',
        price: 30.95,
        variants: [
            {
                color: '#000',
                image: '/assets/images/shirt/tshirt-black.png',
            },
            {
                color: '#efefef',
                image: '/assets/images/shirt/tshirt-white.png',
            },
            {
                color: '#D2B48C',
                image: '/assets/images/shirt/tshirt-sand.png',
            },
            {
                color: '#5d2125',
                image: '/assets/images/shirt/tshirt-maroon.png',
            },
        ],
    },
]

export default function PopularProductSection({
    sx = {},
}: {
    sx?: SxProps<Theme>
}) {
    const theme = useTheme()
    const [selectedColors, setSelectedColors] = useState<{
        [key: string]: string
    }>({})

    const handleColorSelect = (productId: string, color: string) => {
        setSelectedColors((prev) => ({
            ...prev,
            [productId]: color,
        }))
    }

    const getSelectedImage = (product: Product) => {
        const selectedColor =
            selectedColors[product.id] || product.variants[0].color
        const selectedVariant = product.variants.find(
            (variant) => variant.color === selectedColor,
        )
        return selectedVariant
            ? selectedVariant.image
            : product.variants[0].image
    }

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
                    <Grid
                        className="itemssssss"
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={product.id}
                    >
                        <Card sx={{ height: '500px' }}>
                            <ProductImageWrapper>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={getSelectedImage(product)}
                                    alt={product.name}
                                    sx={{ transition: 'opacity 0.3s ease' }}
                                />
                                <CreateProductOverlay className="create-product-overlay">
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        Create Product
                                    </Button>
                                </CreateProductOverlay>
                            </ProductImageWrapper>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    From:
                                </Typography>
                                <Typography variant="h6" component="div">
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Box sx={{ marginTop: 1 }}>
                                    {product.variants.map(
                                        (variant, variantIndex) => (
                                            <ColorOption
                                                key={variantIndex}
                                                color={variant.color}
                                                selected={
                                                    selectedColors[
                                                        product.id
                                                    ] === variant.color
                                                }
                                                onClick={() =>
                                                    handleColorSelect(
                                                        product.id,
                                                        variant.color,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
