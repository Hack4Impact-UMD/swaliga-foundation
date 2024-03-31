import { renewWatch } from "@/lib/firebase/database/watches";
import { Watch } from "@/types/watch-types";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }
        
        const data = await req.json();
        const {formId, watchId} = data; // double check !!!
        
        try {
            await renewWatch(formId, watchId);
            return NextResponse.json({ message: 'Watch Renewed Successfully' }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Renewing the Watch' }, { status: 404 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}