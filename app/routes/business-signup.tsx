import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import axios from 'axios'
import HttpClientService from '~/services/HttpClientService'
import type { MailServiceConfig } from '~/services/MailService'
import { MailService } from '~/services/MailService'

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    const httpClientService = HttpClientService.initInstance(
        axios.create({
            baseURL: process.env.STRAPI_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }),
    )
    // Extract the file
    const file = formData.get('proofOfBusiness') as File | null

    // Extract the JSON fields (assuming they are serialized as strings in the form data)
    const businessData = formData.get('formBusinessData') as string | null
    const contactData = formData.get('formContactData') as string | null
    const brandData = formData.get('formBrandData') as string | null
    const userId = formData.get('userId') as string | null
    const email = formData.get('userEmail') as string | null
    const displayName = formData.get('userDisplayName') as string | null

    // Parse the JSON strings back into objects
    let business: any = {}
    let contact: any = {}
    let brand: any = {}

    try {
        if (businessData) {
            business = JSON.parse(businessData)
        }
        if (contactData) {
            contact = JSON.parse(contactData)
        }
        if (brandData) {
            brand = JSON.parse(brandData)
        }
    } catch (error) {
        return json({ error: 'Invalid JSON data' }, { status: 400 })
    }

    // Ensure file, business, and contact fields exist
    if (!businessData || !contactData || !brandData) {
        return json(
            { error: 'Business, Brand or Contact data is missing' },
            { status: 400 },
        )
    }

    //  ========== SEND EMAIL ============
    const config: MailServiceConfig = {
        serviceMailProvider: process.env.SERVICE_MAIL_PROVIDER ?? '',
        serviceMailAddress: process.env.SERVICE_MAIL_ADDRESS ?? '',
        serviceMailPassword: process.env.SERVICE_MAIL_PASSWORD ?? '',
    }

    const mailService = new MailService(config)
    const mailOptions = {
        from: process.env.SERVICE_MAIL_ADDRESS!,
        to: email ?? '',
        subject: 'Your business details are being reviewed',
        text: `Hi ${displayName ?? ''},

We’re now manually processing your company details, which usually takes up to 48 hours (during business days). If there are any details missing, we’ll reach out to you for further info.

Thanks again for choosing Creator T-Shirt.

Best regards,
Creator T-Shirt Team`,
        html: `
  <p>Hi ${displayName ?? ''},</p>
  
  <p>We’re now manually processing your company details, which usually takes up to 48 hours (during business days). If there are any details missing, we’ll reach out to you for further info.</p>
  
  <p>Thanks again for choosing Creator T-Shirt.</p>
  
  <p>Best regards,<br>
  Creator T-Shirt Team</p>
`,
    }

    if (email) await mailService.sendEmail(mailOptions)

    try {
        //  ========== UPLOAD TO STRAPI ============
        const fileFormData = new FormData()
        let fileId: string | null = null
        if (file) {
            // Append the actual file directly
            fileFormData.append('files', file, file.name) // Use file name and append file directly
            const fileUpload = await httpClientService.post<any>(
                '/api/upload',
                fileFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set multipart headers manually
                    },
                },
            )

            if (fileUpload.length) {
                fileId = fileUpload[0].id
            }
        }

        const newBusiness = {
            name: business.businessName,
            tax_country: business.taxCountry,
            organization_number: business.organizationNumber,
            document: fileId,
            firebase_user_ref_id: userId ?? '',
        }
        const newContact = {
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: contact.email,
            phone_number: contact.phoneNumber,
            phone_prefix: contact.phonePrefix,
            phone_country_code: contact.phoneCountryCode,
            country: contact.country,
            street: contact.street,
            street_number: contact.streetNumber,
            postal_code: contact.postalCode,
            city: contact.city,
            use_invoice_email: contact.useInvoicingEmail,
            invoice_email: contact.useInvoicingEmail
                ? contact.invoicingEmail
                : contact.email,
            firebase_user_ref_id: userId,
        }
        const newBrand = {
            name: brand.brandName,
            agree_terms_and_policies: brand.agreeToTermsAndPolicies,
            firebase_user_ref_id: userId!,
        }

        await Promise.all([
            httpClientService.post('/api/business-details', {
                data: newBusiness,
            }),
            httpClientService.post('/api/contacts', { data: newContact }),
            httpClientService.post('/api/brands', { data: newBrand }),
        ])

        return json({ success: true })
    } catch (error) {
        return json(
            {
                error: `Failed to register with your business detail: ${(error as any).response.data.error.message}`,
            },
            { status: 500 },
        )
    }
}
