export const routeConfig = {
    appName: process.env.APP_NAME,
}

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

export const awsConfig = {
    region: process.env.AWS_REGION ?? 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
    secretAccessKey: process.env.AWS_ACCESS_KEY_ID ?? 'test',
    endpoint: process.env.AWS_ENDPOINT_URL ?? 'http://localhost:4566',
    bucketName: process.env.AWS_BUCKET_NAME ?? 'tshirt-creator',
}

export const strapiConfig = {
    baseUrl: process.env.STRAPI_BASE_URL ?? 'http://localhost:1337',
}
