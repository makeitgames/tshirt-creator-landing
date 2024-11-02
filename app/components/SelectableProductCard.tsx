import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    styled,
    Radio,
} from '@mui/material'
import { useState } from 'react'

interface ProductColor {
    id: string
    color: string
    name: string
    thumbnails: any
}

interface Product {
    id: string
    name: string
    price: number
    colors: ProductColor[]
}

interface ColorOptionProps {
    color: string
    selected: boolean
    onClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
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
}))

export default function SelectableProductCard({
    product,
    isSelected,
    onSelected,
}: {
    product: Product
    isSelected: boolean
    onSelected: ({
        product,
        color,
    }: {
        product: Product
        color: ProductColor
    }) => void
}) {
    const [selectedColors, setSelectedColors] = useState<{
        [key: string]: string
    }>({ [product.id]: product.colors[0].color })

    const handleCardClick = () => {
        const color = product.colors.find(
            (item) => item.color === selectedColors[product.id],
        )
        onSelected({
            product,
            color: color ?? product.colors[0],
        })
    }

    const handleColorSelect = (productId: string, color: ProductColor) => {
        if (isSelected) {
            onSelected({
                product,
                color: color,
            })
        }

        setSelectedColors((prev) => ({
            ...prev,
            [productId]: color.color,
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
        <Card
            sx={{
                mb: 1,
                border: isSelected
                    ? '2px solid #1976d2'
                    : '1px solid transparent',
                position: 'relative',
                cursor: 'pointer',
            }}
            onClick={handleCardClick}
        >
            <Radio
                checked={isSelected}
                onChange={() => {}}
                sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    padding: 0,
                    color: isSelected ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                    zIndex: 999,
                }}
            />
            <ProductImageWrapper>
                <CardMedia
                    component="img"
                    image={getSelectedImage(product)}
                    alt={product.name}
                    sx={{ transition: 'opacity 0.3s ease' }}
                />
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
                        (colorItem: ProductColor, colorIndex: number) => (
                            <ColorOption
                                key={colorIndex}
                                color={colorItem.color}
                                selected={
                                    selectedColors[product.id] ===
                                    colorItem.color
                                }
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleColorSelect(product.id, colorItem)
                                }}
                            />
                        ),
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}
