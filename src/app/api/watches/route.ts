import { createWatch } from "@/lib/firebase/database/watches";
import { NextRequest, NextResponse } from 'next/server';

// creates a watch for the given formId & eventType
export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }

        const data = await req.json();        
        const formId: string = data.formId as string;
        const eventType: string = data.eventType as string;

        if (!formId || !eventType) {
            return NextResponse.json({ error: 'Invalid formId or eventType in Request Body' }, { status: 400 });
        }
        
        try {
            const response = await createWatch(formId, eventType);
            return NextResponse.json({ message: response }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Creating the Watch' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}