import { createWatch } from "@/lib/firebase/database/watches";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }
        
        if (!('formId' in req.body) || !('eventType' in req.body)) {
            return NextResponse.json({ error: 'Missing formId or eventType in Request Body' }, { status: 400 });
        }
        
        const formId: string = req.body.formId as string;
        const eventType: string = req.body.eventType as string; // double check !!!
        
        try {
            await createWatch(formId, eventType);
            return NextResponse.json({ message: 'Watch Created Successfully' }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Creating the Watch' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}