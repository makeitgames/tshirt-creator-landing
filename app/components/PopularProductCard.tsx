import {
    Card,
    CardMedia,
    Button,
    CardContent,
    Typography,
    Box,
    styled,
} from '@mui/material'
import { useState } from 'react'

interface ProductVariant {
    color: string
    name: string
    thumbnails: any
}

interface Product {
    id: string
    name: string
    price: number
    colors: ProductVariant[]
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

export default function PopularProductCard({
    product,
    isShowOverlayBtn = true,
}: any) {
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
            selectedColors[product.id] || product.colors[0].color
        const selectedVariant = product.colors.find(
            (item) => item.color === selectedColor,
        )
        return selectedVariant
            ? selectedVariant.thumbnails[0].formats.medium.url
            : product.colors[0].thumbnails[0].formats.medium.url
    }

    return (
        <Card sx={{ mb: 1 }} onClick={() => console.log('aaa')}>
            <ProductImageWrapper>
                <CardMedia
                    component="img"
                    image={getSelectedImage(product)}
                    alt={product.name}
                    sx={{ transition: 'opacity 0.3s ease' }}
                />
                {isShowOverlayBtn && (
                    <CreateProductOverlay className="create-product-overlay">
                        <Button
                            variant="outlined"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Create Product
                        </Button>
                    </CreateProductOverlay>
                )}
            </ProductImageWrapper>
            <CardContent>
                <Typography
                    variant="body2"
                    fontWeight={700}
                    fontSize={16}
                    component="div"
                    sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        width: '100%',
                    }}
                >
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`From: $${product.price.toFixed(2)}`}
                </Typography>
                <Box sx={{ marginTop: 1 }}>
                    {product.colors.map(
                        (colorItem: ProductVariant, colorIndex: number) => (
                            <ColorOption
                                key={colorIndex}
                                color={colorItem.color}
                                selected={
                                    selectedColors[product.id] ===
                                    colorItem.color
                                }
                                onClick={() =>
                                    handleColorSelect(
                                        product.id,
                                        colorItem.color,
                                    )
                                }
                            />
                        ),
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}
