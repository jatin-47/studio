
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    // Check if the environment variable is set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set.');
    }

    try {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", error);
        throw new Error("Could not initialize Firebase Admin SDK. Service account JSON is invalid.");
    }
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
