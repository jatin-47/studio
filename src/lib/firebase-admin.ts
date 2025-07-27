
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = require("./serviceAccountKey.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
    } catch (error: any) {
        console.error("Firebase admin initialization error:", error.message);
        throw new Error("Could not initialize Firebase Admin SDK. Please check your serviceAccountKey.json file.");
    }
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
