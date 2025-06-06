# auth.py

import os
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Request
from google.cloud import firestore

# Only initialize the Firebase Admin SDK once
if not firebase_admin._apps:
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "firebase-admin-creds.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

# Initialize Firestore client (will use the same credentials)
db = firestore.Client()

def verify_firebase_token(request: Request, require_consent: bool = False):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid auth token")
    
    id_token = auth_header.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]

        if require_consent:
            user_doc = db.collection("users").document(uid).get()
            if not user_doc.exists or not user_doc.to_dict().get("hasConsented", False):
                raise HTTPException(status_code=403, detail="Consent not provided")

        return uid

    except Exception as e:
        # Log error for debugging; remove or replace with proper logging in production
        print("❌ Token error:", e)
        raise HTTPException(status_code=401, detail="Token verification failed")
