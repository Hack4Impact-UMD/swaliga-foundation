import { NextRequest, NextResponse } from 'next/server';
import { unassignSurveys } from '@/lib/firebase/database/users'; 

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            return NextResponse.json({ error: 'Missing Request Body' }, { status: 400 });
        }

        // IMPORTANT: Assumes userIds, surveyIds are string arrays!
        const { userIds, surveyIds } = await req.json();

        try {
            await unassignSurveys(userIds, surveyIds);
            return NextResponse.json({ message: 'Successfully unassigned Surveys'}, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Error with unassigning Surveys' }, { status: 404 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to Load Data' }, { status: 500 });
    }
}