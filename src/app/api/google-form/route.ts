import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebaseConfig';

export async function POST(req: Request) {
    try {
        if (req.method === 'POST') {
            // 1. authenticate google service account
            const auth = new google.auth.GoogleAuth({
                keyFile: 'src/app/api/google-form/TestServiceAccountKey.json',
                scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/forms'],
            });

            // 1-1. authenticate admin google account (user account)
            

            const forms = google.forms({
                version: 'v1',
                auth: auth
            });

            // 2. create a google form
            const form = await forms.forms.create({
                requestBody: {
                    info: {
                        title: "Your Form Title",
                        documentTitle: "Your Document Title",
                    }
                }
            });

            console.log("Form Created: ", form.data);

            // 3. store the data into firestore

            return NextResponse.json(form.data , { status: 200 });
        }
    } catch (err) {
        console.log('Error creating form:', err);
        return NextResponse.json({ message: '405 error' }, { status: 405 });
    }
    
    // if (req.method === 'POST') {
    //     try {
    //         const auth = new google.auth.GoogleAuth({
    //             keyFile: '/Users/minji/Desktop/2024 Spring/Hack4Impact/Swaliga/swaliga-foundation/src/lib/firebase/TestServiceAccountKey.json',
    //             scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/forms'],
    //         });
            
    //         const forms = google.forms({version: 'v1', auth: auth});
            
    //         const form = await forms.forms.create({
    //             requestBody: {
    //                 info: {
    //                     title: "Your Form Title",
    //                 }
    //             }
    //         });
            
    //         console.log("Form Created: ", form.data);
    //         res.status(200).json(form.data);
    //     } catch (error) {
    //         console.error('Error creating form:', error);
    //         res.status(500).send('Error creating form');
    //     }
    // } else {
    //     res.setHeader('Allow', ['POST']);
    //     res.status(405).end(`Method ${req.method} Not Allowed`);
    // }
}
