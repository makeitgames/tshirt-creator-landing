import React from 'react'
import type { SxProps, Theme } from '@mui/material'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface FAQItem {
    question: string
    link: string
}

const faqItems: FAQItem[] = [
    {
        question: 'How do I create a product?',
        link: '#',
    },
    {
        question: 'How do I order a sample or buy a product?',
        link: '#',
    },
    {
        question:
            'Fabric: What type of fabric is the t-shirt made from? What are its properties?',
        link: '#',
    },
]

export default function FAQList({ sx }: { sx: SxProps<Theme> | undefined }) {
    const handleCardClick = (link: string) => {
        // You can implement your own logic here, e.g., navigation or opening a modal
    }

    return (
        <Box sx={{ p: 4, ...sx }}>
            <Typography variant="h5" component="h6" align="center" gutterBottom>
                QUESTIONS?
            </Typography>
            <Typography
                variant="h4"
                component="h4"
                align="center"
                gutterBottom
                sx={{ mb: 4 }}
            >
                frequently asked questions
            </Typography>
            <List sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
                {faqItems.map((item, index) => (
                    <ListItem
                        key={index}
                        onClick={() => handleCardClick(item.link)}
                        sx={{
                            mb: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid',
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#acacac',
                            },
                        }}
                    >
                        <ListItemText
                            primary={item.question}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontWeight: 'medium',
                                },
                            }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="open"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(item.link, '_blank')
                                }}
                                // sx={{
                                //     '&:hover': {
                                //         bgcolor: 'rgb(192, 190, 190)',
                                //     },
                                // }}
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}
