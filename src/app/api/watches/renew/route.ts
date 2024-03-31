import { renewWatch } from "@/lib/firebase/database/watches";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }

        if (!('formId' in req.body) || !('watchId' in req.body)) {
            return NextResponse.json({ error: 'Missing formId or watchId in Request Body' }, { status: 400 });
        }
        
        const formId: string = req.body.formId as string;
        const watchId: string = req.body.watchId as string; // double check !!!
        
        try {
            await renewWatch(formId, watchId);
            return NextResponse.json({ message: 'Watch Renewed Successfully' }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Renewing the Watch' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}