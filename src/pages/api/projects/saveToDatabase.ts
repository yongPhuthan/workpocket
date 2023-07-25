import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
const serviceAccount = require('../../../system/serviceAccount.json') as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://workpocket-c9c9d.firebaseio.com`,
  });
}

const db = admin.firestore();

export default async function handler(req:NextApiRequest  , res:NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;
    const email = data.email;

    admin.auth()
    .getUserByEmail(email)
      .then(async (userRecord) => {
        console.log('Successfully fetched user data:', userRecord.toJSON());

        const userId = userRecord.uid;
        const userRef = db.collection('Users').doc(userId);

        // Prepare the categories and tags ids
        let categoriesIds = [];
        let tagsIds = [];

        // Check and create new category/tag if it does not exist
        if(data.selectedCategories) {
          for (const category of data.selectedCategories) {
            let categoryRef = userRef.collection('Categories').doc(category);
            let categoryDoc = await categoryRef.get();
            if (!categoryDoc.exists) {
              await categoryRef.set({ name: category });
            }
            categoriesIds.push(category);
          }
        }

        if(data.selectedTags) {
          for (const tag of data.selectedTags) {
            let tagRef = userRef.collection('Tags').doc(tag);
            let tagDoc = await tagRef.get();
            if (!tagDoc.exists) {
              await tagRef.set({ name: tag });
            }
            tagsIds.push(tag);
          }
        }

        const projectData = {
          productImages: data.projectImagesUrls,
          additionalProductImages: data.additionalProjectImagesUrls,
          cardFormData: data.cardFormData,
          productDetails: data.productDetails,
          categories: categoriesIds,
          tags: tagsIds
        };

        try {
          // Add the project with category and tag ids
          const projectRef = await userRef.collection('Projects').add(projectData);
          console.log(`Successfully inserted item with ID: ${projectRef.id}`);

          res
            .status(200)
            .json({ message: 'Data successfully stored in Firestore' });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ message: 'Failed to store data in Firestore' });
        }
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
        res.status(403).json({ message: 'Not authorized' });
      });
  }
}
