import { Box, Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import AuthenticationPage from '~/components/AuthenticationPage'
import DashboardContainer from '~/components/DashboardContainer'
import SelectableProductCard from '~/components/SelectableProductCard'
import StrapiContentTypeService from '~/services/StrapiContentTypeService'

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

export default function Product() {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product>()
    const [selectedColor, setSelectedColor] = useState<ProductColor>()

    useEffect(() => {
        console.log('product:', selectedProduct)
        console.log('color:', selectedColor)
    }, [selectedProduct, selectedColor])

    const setSelectedItem = ({
        product,
        color,
    }: {
        product: Product
        color: ProductColor
    }) => {
        setSelectedProduct(product)
        setSelectedColor(color)
    }

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = (await StrapiContentTypeService.getAll('canvas', {
                    populate: ['colors.thumbnails'],
                })) as Product[]
                setProducts(data)
            } catch (error) {
                console.error('Error fetching items:', error)
            }
        }

        fetchItems()
    }, [])

    return (
        <AuthenticationPage>
            <DashboardContainer>
                <div style={{ padding: '8% 0' }}>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                        <Grid container spacing={4}>
                            {products.map((product) => (
                                <Grid key={product.id} item xs={12} md={3}>
                                    <SelectableProductCard
                                        product={product}
                                        isSelected={
                                            product.id === selectedProduct?.id
                                        }
                                        onSelected={setSelectedItem}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            position: 'sticky',
                            bottom: 0,
                            backgroundColor: 'background.paper',
                            pt: 2,
                            pb: 2,
                            textAlign: 'right',
                        }}
                    >
                        <Button variant="outlined">Next</Button>
                    </Box>
                </div>
            </DashboardContainer>
        </AuthenticationPage>
    )
}
