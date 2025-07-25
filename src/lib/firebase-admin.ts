
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        if (!serviceAccountString) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable not set.');
        }
        const serviceAccount = JSON.parse(serviceAccountString);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error: any) {
        console.error("Firebase admin initialization error:", error.message);
        throw new Error("Could not initialize Firebase Admin SDK. Please check your service account credentials.");
    }
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
