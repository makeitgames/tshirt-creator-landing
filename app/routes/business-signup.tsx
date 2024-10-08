import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import axios, { AxiosError } from 'axios'
import type { MailServiceConfig } from '~/services/MailService'
import { MailService } from '~/services/MailService'

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    // Extract the file
    const file = formData.get('proofOfBusiness') as File | null

    // Extract the JSON fields (assuming they are serialized as strings in the form data)
    const businessData = formData.get('formBusinessData') as string | null
    const contactData = formData.get('formContactData') as string | null
    const brandData = formData.get('formBrandData') as string | null
    const userId = formData.get('userId') as string | null

    console.log('businessData:', businessData)
    console.log('contactData:', contactData)
    console.log('brandData:', brandData)
    console.log('file:', file)

    if (!userId) {
        return json({ error: 'User ID is missing' }, { status: 400 })
    }

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
    if (!file || !businessData || !contactData || !brandData) {
        return json(
            { error: 'File, business, brand or contact data is missing' },
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
        from: process.env.SERVICE_MAIL_ADDRESS,
        to: process.env.SERVICE_MAIL_ADDRESS,
        subject: 'New business signup',
        text: `New business signup: ${JSON.stringify({
            business,
            contact,
            brand,
        })}`,
    }

    //  ========== UPLOAD TO STRAPI ============
    const fileFormData = new FormData()
    if (file) {
        const fileBlob = new Blob([file as BlobPart], {
            type: file?.type ?? 'application/pdf',
        })
        fileFormData.append('files', fileBlob)
    }

    try {
        const fileUpload = await axios.post(
            `${process.env.BACKEND_BASE_URL}/api/upload`, // Update the URL based on your Strapi setup
            fileFormData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )

        const newBusiness = {
            name: business.businessName,
            tax_country: business.taxCountry,
            organization_number: business.organizationNumber,
            document: fileUpload.data[0].id,
            firebase_user_ref_id: userId,
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
            firebase_user_ref_id: userId,
        }

        // create new business, contact, and brand
        await axios.post(
            `${process.env.BACKEND_BASE_URL}/api/business-details`,
            { data: newBusiness },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        await axios.post(
            `${process.env.BACKEND_BASE_URL}/api/contacts`,
            { data: newContact },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        await axios.post(
            `${process.env.BACKEND_BASE_URL}/api/brands`,
            {
                data: newBrand,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )

        return json({ success: true })
    } catch (error) {
        console.error((error as AxiosError).message)
        return json(
            { error: 'Failed to register with your business detail' },
            { status: 500 },
        )
    }
}
