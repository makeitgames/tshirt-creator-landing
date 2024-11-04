import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    styled,
    Radio,
} from '@mui/material'

interface ProductColor {
    id: number
    color: string
    name: string
    thumbnails: any
}

const ProductImageWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
}))

interface ColorBadgeProps {
    color: string
}

const ColorBadge = styled('span')<ColorBadgeProps>(({ color }) => ({
    display: 'inline-block',
    width: '22px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: '8px', // Add spacing between color option and name
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.3s ease',
}))

export default function SelectableProductColorCard({
    productColor,
    isSelected,
    onSelected,
    onDeselected,
}: {
    productColor: ProductColor
    isSelected: boolean
    onSelected: (colorIds: number) => void
    onDeselected: (colorIds: number) => void
}) {
    const handleCardClick = () => {
        if (isSelected) {
            onDeselected(productColor.id)
        } else {
            onSelected(productColor.id)
        }
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
                    image={productColor.thumbnails[0].formats.medium.url}
                    alt={productColor.name}
                    sx={{ transition: 'opacity 0.3s ease' }}
                />
            </ProductImageWrapper>

            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <ColorBadge color={productColor.color} />
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
                    {productColor.name}
                </Typography>
            </CardContent>
        </Card>
    )
}
