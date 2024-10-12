import React from 'react'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    SxProps,
    Theme,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

interface FAQItem {
    question: string
    link: string
}

const faqItems: FAQItem[] = [
    {
        question:
            'What type of fabric is the t-shirt made from? What are its properties?',
        link: '#',
    },
    {
        question: 'How can the t-shirt be ordered?',
        link: '#',
    },
    {
        question:
            'Can the screen print design be modified? How many times can it be changed? ',
        link: '#',
    },
    // { question: 'How do I connect my Shopify store?', link: '#' },
    // { question: 'How do I connect my WooCommerce store?', link: '#' },
]

export default function FAQList({ sx }: { sx: SxProps<Theme> | undefined }) {
    const handleCardClick = (link: string) => {
        // You can implement your own logic here, e.g., navigation or opening a modal
        console.log(`Clicked: ${link}`)
    }

    return (
        <Box sx={{ bgcolor: '#fff', color: '#000', p: 4, ...sx }}>
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
                            border: '1px solid #aaa9a9',
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(209, 209, 209, 0.851)',
                                borderColor: '#6a6a6a',
                            },
                        }}
                    >
                        <ListItemText
                            primary={item.question}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: '#585858',
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
                                sx={{
                                    color: '#616161',
                                    '&:hover': {
                                        bgcolor: 'rgb(192, 190, 190)',
                                    },
                                }}
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
