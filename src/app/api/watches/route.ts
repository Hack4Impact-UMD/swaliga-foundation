import { createWatch } from "@/lib/firebase/database/watches";
import { Watch } from "@/types/watch-types";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }
        
        const data = await req.json();
        const {formId, eventType} = data; // double check !!!
        
        try {
            await createWatch(formId, eventType);
            return NextResponse.json({ message: 'Watch Created Successfully' }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with Creating the Watch' }, { status: 404 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}