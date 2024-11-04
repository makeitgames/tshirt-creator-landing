import { Box, Button, Grid } from '@mui/material'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
    useLoaderData,
    useNavigate,
    useParams,
    useSearchParams,
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import AuthenticationPage from '~/components/AuthenticationPage'
import DashboardContainer from '~/components/DashboardContainer'
import SelectableProductColorCard from '~/components/SelectableProductColorCard'
import { routeConfig } from '~/configs'
import { useGenerateMeta } from '~/hooks/useGenerateMeta'
import StrapiContentTypeService from '~/services/StrapiContentTypeService'

interface ProductColor {
    id: number
    color: string
    name: string
    thumbnails: any
}

interface Product {
    id: number
    name: string
    price: number
    colors: ProductColor[]
}

export async function loader({
    request,
}: LoaderFunctionArgs): Promise<Response> {
    const url = new URL(request.url)
    const defaultColor = url.searchParams.get('default')
    return json({ ...routeConfig, defaultColor })
}

export const meta: MetaFunction = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const metaTags = useGenerateMeta()

    return metaTags
}

export default function Color() {
    const data = useLoaderData<typeof loader>()
    const params = useParams()
    const { product: productId } = params
    const { defaultColor } = data
    const [product, setProduct] = useState<Product>()
    const [productColors, setProductColors] = useState<ProductColor[]>([])
    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([
        Number(defaultColor),
    ])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!defaultColor || !productId) {
            navigate('/dashboard/products')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedColorIds, productId])

    useEffect(() => {
        if (productId) {
            const fetchItems = async () => {
                try {
                    const data = (await StrapiContentTypeService.getById(
                        'canvas',
                        productId,
                        {
                            populate: ['colors.thumbnails'],
                        },
                    )) as Product
                    setProduct(data)
                    setProductColors(data.colors)
                } catch (error) {
                    console.error('Error fetching items:', error)
                }
            }

            fetchItems()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addSelectedColors = (colorId: number) => {
        setSelectedColorIds((prev) => [...prev, colorId])
    }

    const removeSelectedColors = (colorId: number) => {
        setSelectedColorIds(selectedColorIds.filter((id) => id !== colorId))
    }

    return (
        <AuthenticationPage>
            <DashboardContainer>
                <div style={{ padding: '4% 0' }}>
                    <h3>Select Colors</h3>
                    <Box
                        sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, pt: '4%' }}
                    >
                        <Grid container spacing={4}>
                            {productColors.map((productColor, index) => (
                                <Grid item xs={3} key={index}>
                                    <SelectableProductColorCard
                                        productColor={productColor}
                                        isSelected={selectedColorIds.includes(
                                            productColor.id,
                                        )}
                                        onSelected={addSelectedColors}
                                        onDeselected={removeSelectedColors}
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
                        }}
                    >
                        <Grid container>
                            <Grid item xs={11}>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate('/dashboard/products')
                                    }
                                >
                                    Change item
                                </Button>
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    variant="contained"
                                    disabled={
                                        !product || !selectedColorIds.length
                                    }
                                >
                                    Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </DashboardContainer>
        </AuthenticationPage>
    )
}
