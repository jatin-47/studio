
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (!serviceAccountString) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set.');
        }
        const serviceAccount = JSON.parse(serviceAccountString);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error: any) {
        console.error("Firebase admin initialization error:", error.message);
        // We throw an error to make it clear that the app cannot function without Firebase admin.
        // In a real production environment, you might handle this more gracefully.
        throw new Error("Could not initialize Firebase Admin SDK. Please check your service account credentials.");
    }
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
