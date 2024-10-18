import { Box, Grid, Button } from '@mui/material'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

interface CarouselItem {
    image: string
    title: string
    description: string
    position: 'left' | 'right'
    buttonTitle: string
}

interface CarouselProps {
    autoPlay?: boolean
    interval?: number // optional prop for autoplay interval in milliseconds
}

const MainCarousel: FC<CarouselProps> = ({
    interval = 7000,
    autoPlay = false,
}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [fade, setFade] = useState<'fade-in' | 'fade-out'>('fade-in')

    const items: CarouselItem[] = [
        {
            image: '/assets/images/carousel-2.jpg',
            title: 'Get inspired',
            description:
                'True Blanks is our premium in-house blanks label. Designed in our atelier and made responsibly, these innovative merch-specific garments set new standards in quality and attention to detail.',
            position: 'right',
            buttonTitle: 'Get started',
        },
        {
            image: '/assets/images/carousel-3.jpg',
            title: 'Create next level merch',
            description:
                'True Blanks is our premium in-house blanks label. Designed in our atelier and made responsibly, these innovative merch-specific garments set new standards in quality and attention to detail.',
            position: 'left',
            buttonTitle: 'Get started',
        },
        {
            image: '/assets/images/carousel-1.jpg',
            title: 'Fashion made for merch',
            description:
                'True Blanks is our premium in-house blanks label. Designed in our atelier and made responsibly, these innovative merch-specific garments set new standards in quality and attention to detail.',
            position: 'right',
            buttonTitle: 'Get started',
        },
    ]

    //   Auto play logic
    useEffect(() => {
        if (autoPlay) {
            const autoPlayStart = setInterval(() => {
                handleNext()
            }, interval)

            return () => clearInterval(autoPlayStart)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, interval, autoPlay])

    const handleNext = () => {
        setFade('fade-out')
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
            setFade('fade-in')
        }, 200) // Delay to match the fade animation
    }

    const handlePrevious = () => {
        setFade('fade-out')
        setTimeout(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? items.length - 1 : prevIndex - 1,
            )
            setFade('fade-in')
        }, 200) // Delay to match the fade animation
    }

    const goToSlide = (index: number) => {
        setFade('fade-out')
        setTimeout(() => {
            setCurrentIndex(index)
            setFade('fade-in')
        }, 200) // Delay to match the fade animation
    }

    // Swipeable configuration
    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious,
        trackMouse: true, // allows swiping with a mouse
    })

    return (
        <Box
            className="main-carousel"
            {...handlers}
            sx={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                userSelect: 'none', // Disable text selection while swiping
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <img
                        className={`carousel-image ${fade}`}
                        src={items[currentIndex].image}
                        alt={items[currentIndex].title}
                        draggable={false}
                        style={{
                            width: '100vw',
                            height: '100vh',
                            objectFit: 'cover',
                            transition:
                                'opacity 0.2s cubic-bezier(0.65, 0, 0.35, 1)', // Use cubic-bezier for smoother fade
                            opacity: fade === 'fade-in' ? 1 : 0, // Handle fade-in and fade-out
                        }}
                    />
                </Grid>
                <Grid item xs={12} className="carousel-content">
                    <Box
                        className={`${items[currentIndex].position}-content`}
                        sx={{ flexDirection: 'column' }}
                    >
                        <div key={currentIndex} className="carousel-title">
                            {items[currentIndex].title}
                        </div>
                        <Button className="carousel-btn" variant="contained">
                            {items[currentIndex].buttonTitle}
                        </Button>
                    </Box>
                </Grid>

                {/* Control Dots */}
                <Box
                    className="control-dots"
                    sx={{
                        position: 'absolute',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '10px',
                        bottom: {
                            xs: '8vh',
                            sm: '10vh',
                            md: '20vh',
                            lg: '20vh',
                        },
                        left: { xs: '15%', sm: '15%', md: '50%', lg: '50%' },
                    }}
                >
                    {items.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => goToSlide(index)}
                            sx={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor:
                                    currentIndex === index ? '#fff' : '#888',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                    ))}
                </Box>
            </Grid>
        </Box>
    )
}

export default MainCarousel
