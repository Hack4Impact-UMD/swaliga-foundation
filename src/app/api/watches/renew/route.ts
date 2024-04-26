import { renewWatch } from "@/lib/firebase/database/watches";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }

        const data = await req.json();  
        const formId: string = data.formId as string;
        const watchId: string = data.watchId as string;

        if (!formId || !watchId) {
            return NextResponse.json({ error: 'Invalid formId or watchId in Request Body' }, { status: 400 });
        }
        
        try {
            const response = await renewWatch(formId, watchId);
            return NextResponse.json({ message: response }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Renewing the Watch' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}