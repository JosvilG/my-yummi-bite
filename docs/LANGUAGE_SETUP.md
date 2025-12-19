# Uploading Language Files to Firebase Storage

For the language download feature to work, you need to upload the translation JSON files to Firebase Storage.

## Directory Structure in Firebase Storage

```
translations/
├── en.json
├── es.json
├── fr.json
├── de.json
├── pt.json
└── it.json
```

## Steps to Upload

### Option 1: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Create a folder called `translations`
5. Upload each `.json` file from `src/i18n/locales/`

### Option 2: Using Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Upload files (from project root)
firebase storage:upload src/i18n/locales/es.json translations/es.json
firebase storage:upload src/i18n/locales/en.json translations/en.json
```

### Option 3: Using Node.js Script

Create a file `scripts/uploadTranslations.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize with your service account
const serviceAccount = require('./path-to-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com'
});

const bucket = admin.storage().bucket();
const localesDir = path.join(__dirname, '../src/i18n/locales');

async function uploadTranslations() {
  const files = fs.readdirSync(localesDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(localesDir, file);
      const destination = `translations/${file}`;
      
      await bucket.upload(filePath, {
        destination,
        metadata: {
          contentType: 'application/json',
          cacheControl: 'public, max-age=3600',
        },
      });
      
      console.log(`Uploaded: ${file}`);
    }
  }
}

uploadTranslations().catch(console.error);
```

## Storage Rules

Make sure your Firebase Storage rules allow reading the translations **and** keep everything else locked down (deny by default):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /translations/{filename} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Public assets written by authenticated users
    match /public/users/{userId}/{filename} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /public/recipes/{authorId}/{filename} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == authorId;
    }

    // Deny by default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing

After uploading, you can test the download URL:

```
https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT_ID.appspot.com/o/translations%2Fes.json?alt=media
```

## Important Notes

1. **English is bundled**: The `en.json` file is always included in the app build as a fallback.
2. **Caching**: Downloaded translations are cached locally using AsyncStorage.
3. **Error handling**: If a download fails, the app falls back to English.
4. **Storage space**: Languages are only downloaded when selected, saving device storage.
