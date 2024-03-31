// import { google } from 'googleapis';
// import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, collectionGroup, getDocs, setDoc } from "firebase/firestore";
// import { db } from "./firebase/firebaseConfig";
// import { PubSub, Message} from '@google-cloud/pubsub';

// export const formsClient = google.forms({
//   version: 'v1',
//   auth: oauth2Client,
// });

// // TODO: Figure out Pub/Sub Topic
// export async function createFormWatch(formId: string, topicName: string) {
//   try {
//     const response = await formsClient.forms.watches.create({
//         formId: formId,
//         requestBody: {
//             watch: {  
//                 target: {
//                     topic: {
//                         topicName: topicName
//                     }
//                 },
//                 eventType: 'RESPONSES',
//             },
//             watchId: "some-watch"
//         } 
//     });
//     return response.data;

//   } catch (error) {
//     console.error('Error creating form watch: ', error);
//     throw error;
//   }
// }

// // Google Cloud PubSub
// const pubsub = new PubSub();

// // Saving google form to firebase
// export async function listenAndSaveForm(): Promise<void> {
//   // TODO: Figure out how to use PubSub
//   const subscription = pubsub.subscription('sub-name');

//   const messageHandler = async (message: Message) => {
//     console.log(`Received message ${message.id}:`);
//     console.log(`\nData: ${message.data}`);
//     console.log(`\nAttributes: ${message.attributes}`);

//     // TODO: Figure out if this works I doubt it does
//     // Get form data from pubsub message
//     const formData = JSON.parse(message.data.toString());
//     console.log('Form Data: ', formData)

//     // Send form data to firebase
//     try {
//       const docRef = doc(collection(db, 'forms'));
//       await setDoc(docRef, formData);
//       console.log('Form saved successfully');
//     } catch (error) {
//       console.error('Error saving form: ', error);
//     } finally {
//       // Acknowledge the message
//       message.ack();
//     }

//   };

//   subscription.on('message', messageHandler);
// }

// listenAndSaveForm();