import React from 'react'
import { Modal, Box, Typography, Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface TermsAndPoliciesModalProps {
    open: boolean
    onClose: () => void
    content: 'terms' | 'policy'
}

export default function TermsAndPoliciesModal({
    open,
    onClose,
    content,
}: TermsAndPoliciesModalProps) {
    const title =
        content === 'terms' ? 'Terms and Conditions' : 'Content Policy'
    const text = content === 'terms' ? termsAndConditions : contentPolicy

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="terms-modal-title"
            aria-describedby="terms-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '500px',
                    height: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        id="terms-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        mb: 2,
                        '&::-webkit-scrollbar': {
                            width: '0.4em',
                        },
                        '&::-webkit-scrollbar-track': {
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,.1)',
                            outline: '1px solid slategrey',
                        },
                    }}
                >
                    <Typography id="terms-modal-description" variant="body2">
                        {text}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="primary"
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const termsAndConditions = `
1. Acceptance of Terms

By accessing and using Creator TShirt's business-to-business services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.

2. Service Description

Creator TShirt provides a platform for businesses to create, design, and order custom t-shirts and other apparel products.

3. User Accounts

3.1. You must create an account to use our services. You are responsible for maintaining the confidentiality of your account information.
3.2. You must provide accurate and complete information when creating your account.

4. Intellectual Property

4.1. You retain ownership of your designs and content.
4.2. By uploading designs, you grant Creator TShirt a non-exclusive license to use, reproduce, and modify the designs for the purpose of fulfilling orders.

5. Order and Payment

5.1. All orders are subject to acceptance by Creator TShirt.
5.2. Prices are subject to change without notice.
5.3. Payment must be made in full before order processing begins.

6. Shipping and Delivery

6.1. Creator TShirt will make reasonable efforts to meet delivery estimates but is not responsible for delays outside our control.
6.2. Risk of loss and title for products pass to you upon delivery to the carrier.

7. Returns and Refunds

7.1. Refunds or replacements may be issued for defective products within 30 days of delivery.
7.2. Custom-designed products cannot be returned unless defective.

8. Limitation of Liability

Creator TShirt's liability is limited to the amount paid for the products or services in question.

9. Termination

We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason.

10. Changes to Terms

Creator TShirt reserves the right to modify these terms at any time. Your continued use of our services after changes constitutes acceptance of the modified terms.

11. Governing Law

These Terms and Conditions are governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.

12. Contact Information

For any questions about these Terms and Conditions, please contact us at [contact email].

Last updated: [Date]
`

const contentPolicy = `
1. Prohibited Content

The following types of content are strictly prohibited on the Creator TShirt platform:

1.1. Illegal Content: Any content that violates local, state, national, or international laws.
1.2. Hate Speech: Content that promotes hate, discrimination, or violence against individuals or groups based on race, ethnicity, national origin, religion, sexual orientation, gender identity, or disability.
1.3. Explicit Material: Pornographic, excessively violent, or otherwise adult-oriented content.
1.4. Harmful Content: Content that promotes self-harm, suicide, or dangerous activities.
1.5. Infringing Content: Any content that infringes on copyrights, trademarks, or other intellectual property rights.
1.6. Misleading Content: False or deceptive content, including misinformation and disinformation.

2. User Responsibilities

2.1. Users are responsible for ensuring that all content they upload or create on the platform complies with this Content Policy.
2.2. Users must have the necessary rights and permissions for any content they upload or use in their designs.

3. Content Review

3.1. Creator TShirt reserves the right to review all content uploaded to the platform.
3.2. We may remove any content that violates this policy without prior notice.

4. Consequences of Violation

4.1. Violations of this Content Policy may result in content removal, account suspension, or termination.
4.2. Repeated or severe violations may result in permanent banning from the platform.

5. Reporting Violations

Users can report content that violates this policy by [insert reporting method].

6. Appeals

If your content is removed or your account is suspended, you may appeal the decision by contacting [appeal contact information].

7. Policy Updates

Creator TShirt reserves the right to modify this Content Policy at any time. Users will be notified of significant changes.

8. Disclaimer

While we strive to enforce this policy consistently, Creator TShirt is not responsible for any content uploaded by users before it is reviewed and removed.

For any questions about this Content Policy, please contact us at [contact email].

Last updated: [Date]
`
