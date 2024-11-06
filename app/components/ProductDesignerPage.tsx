import { useState, useRef, useEffect } from 'react'
import {
    AppBar,
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Typography,
    styled,
    Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import ImageIcon from '@mui/icons-material/Image'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from '@remix-run/react'
import { Stage, Layer, Image, Transformer } from 'react-konva'
import useImage from 'use-image'

const UploadBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    transition: 'border-color 0.3s ease-in-out',
    '&:hover': {
        borderColor: theme.palette.secondary.main,
    },
}))

const ShirtPreview = styled(Box)({
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage:
        'url("https://res.cloudinary.com/devfo8ywb/image/upload/v1730355262/402914984d460bdb13099a718cdbb6119de22ebe_xxl_1_a0849372c9.jpg?height=600&width=400")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
})

const ImagePreview = styled(Box)({
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    overflow: 'hidden',
    '&:hover .delete-icon': {
        opacity: 1,
    },
})

const StyledImage = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'move',
})

const DeleteIconWrapper = styled(Box)({
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '4px',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
})

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

interface DesignImage {
    id: string
    src: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
}

const DesignImage = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
    const shapeRef = useRef<any>()
    const trRef = useRef<any>()
    const [image] = useImage(shapeProps.src)

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current])
            trRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    return (
        <>
            <Image
                image={image}
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    })
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()

                    node.scaleX(1)
                    node.scaleY(1)
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                        rotation: node.rotation(),
                    })
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox
                        }
                        return newBox
                    }}
                />
            )}
        </>
    )
}

export default function ShirtDesigner() {
    const navigate = useNavigate()
    const [tabValue, setTabValue] = useState(1)
    const [selectedView, setSelectedView] = useState<'front' | 'back'>('front')
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<DesignImage[]>([])
    const [selectedId, selectShape] = useState<string | null>(null)
    const stageRef = useRef<any>(null)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    const handleFileUpload = (files: FileList) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)])
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (event.dataTransfer.files) {
            handleFileUpload(event.dataTransfer.files)
        }
    }

    const handleDeleteFile = (index: number) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    const handleImageDragStart = (
        event: React.DragEvent<HTMLImageElement>,
        file: File,
    ) => {
        event.dataTransfer.setData(
            'application/json',
            JSON.stringify({ type: 'image', file: file.name }),
        )
    }

    const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const data = event.dataTransfer.getData('application/json')
        if (data) {
            const { type, file } = JSON.parse(data)
            if (type === 'image') {
                const droppedFile = uploadedFiles.find((f) => f.name === file)
                if (droppedFile) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        if (e.target?.result) {
                            const stageBox = stageRef.current
                                .container()
                                .getBoundingClientRect()
                            const newImage: DesignImage = {
                                id: Math.random().toString(36).substr(2, 9),
                                src: e.target.result as string,
                                x: event.clientX - stageBox.left,
                                y: event.clientY - stageBox.top,
                                width: 100,
                                height: 100,
                                rotation: 0,
                            }
                            setImages((prevImages) => [...prevImages, newImage])
                        }
                    }
                    reader.readAsDataURL(droppedFile)
                }
            }
        }
    }

    const checkDeselect = (e: any) => {
        const clickedOnEmpty = e.target === e.target.getStage()
        if (clickedOnEmpty) {
            selectShape(null)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static" color="default" elevation={0}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => navigate('/dashboard/products')}
                            aria-label="Back to products"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5">Exit create tool</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 4, textAlign: 'right' }}>
                            <Typography variant="subtitle2">
                                Total price
                            </Typography>
                            <Typography variant="h6">€14.99</Typography>
                        </Box>
                        <Button variant="contained" color="primary">
                            Finalize product
                        </Button>
                    </Box>
                </Box>
            </AppBar>
            <Divider />
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    <Grid item xs={12} md={3}>
                        <Paper
                            elevation={2}
                            sx={{ height: '100%', overflow: 'auto' }}
                        >
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                aria-label="Design options"
                            >
                                <Tab
                                    icon={<ImageIcon />}
                                    label="Item"
                                    id="tab-0"
                                    aria-controls="tabpanel-0"
                                />
                                <Tab
                                    icon={<CloudUploadIcon />}
                                    label="Artwork"
                                    id="tab-1"
                                    aria-controls="tabpanel-1"
                                />
                                <Tab
                                    icon={<TextFieldsIcon />}
                                    label="Text"
                                    id="tab-2"
                                    aria-controls="tabpanel-2"
                                />
                            </Tabs>
                            <TabPanel value={tabValue} index={1}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Upload artwork
                                </Typography>
                                <UploadBox
                                    onClick={handleClick}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={(e) =>
                                            e.target.files &&
                                            handleFileUpload(e.target.files)
                                        }
                                    />
                                    <CloudUploadIcon
                                        sx={{
                                            fontSize: 48,
                                            color: 'text.secondary',
                                            mb: 2,
                                        }}
                                    />
                                    <Typography sx={{ mb: 1 }}>
                                        Drag and drop your artwork files here
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mb: 2, display: 'block' }}
                                    >
                                        or
                                    </Typography>
                                    <Button variant="outlined" component="span">
                                        Choose files
                                    </Button>
                                </UploadBox>
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2">
                                        Full canvas size:
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        4134 x 4724 px
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Maximum print area:
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        350 x 400 mm
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Supported file types:
                                    </Typography>
                                    <Typography variant="body2">
                                        .png .jpg .jpeg .gif .svg
                                    </Typography>
                                </Box>
                                {uploadedFiles.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            Uploaded Files
                                        </Typography>
                                        <Grid container spacing={1}>
                                            {uploadedFiles.map(
                                                (file, index) => (
                                                    <Grid
                                                        item
                                                        xs={4}
                                                        key={index}
                                                    >
                                                        <ImagePreview>
                                                            <StyledImage
                                                                src={URL.createObjectURL(
                                                                    file,
                                                                )}
                                                                alt={`Uploaded file ${index + 1}`}
                                                                draggable
                                                                onDragStart={(
                                                                    e,
                                                                ) =>
                                                                    handleImageDragStart(
                                                                        e,
                                                                        file,
                                                                    )
                                                                }
                                                            />
                                                            <DeleteIconWrapper className="delete-icon">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleDeleteFile(
                                                                            index,
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        color: 'white',
                                                                    }}
                                                                    aria-label={`Delete image ${index + 1}`}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </DeleteIconWrapper>
                                                        </ImagePreview>
                                                    </Grid>
                                                ),
                                            )}
                                        </Grid>
                                    </Box>
                                )}
                            </TabPanel>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <ShirtPreview>
                            <Stage
                                width={300}
                                height={300}
                                onMouseDown={checkDeselect}
                                onTouchStart={checkDeselect}
                                ref={stageRef}
                                onDragOver={handleDragOver}
                                onDrop={handleCanvasDrop}
                                style={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    border: '3px dashed #979696',
                                }}
                            >
                                <Layer>
                                    {images.map((img, i) => (
                                        <DesignImage
                                            key={img.id}
                                            shapeProps={img}
                                            isSelected={img.id === selectedId}
                                            onSelect={() => {
                                                selectShape(img.id)
                                            }}
                                            onChange={(
                                                newAttrs: DesignImage,
                                            ) => {
                                                const imgs = images.slice()
                                                imgs[i] = newAttrs
                                                setImages(imgs)
                                            }}
                                        />
                                    ))}
                                </Layer>
                            </Stage>
                        </ShirtPreview>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                View
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                <Button
                                    variant={
                                        selectedView === 'front'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={() => setSelectedView('front')}
                                    fullWidth
                                >
                                    Front
                                </Button>
                                <Button
                                    variant={
                                        selectedView === 'back'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={() => setSelectedView('back')}
                                    fullWidth
                                >
                                    Back
                                </Button>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Colors
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <IconButton aria-label="Add color">
                                        <ColorLensIcon />
                                    </IconButton>
                                    <Typography variant="body2">
                                        Add colour
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
