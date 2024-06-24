import { NextRequest, NextResponse } from "next/server";
import { survey2csv } from "@/lib/firebase/export/exportSurvey";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const csv = await survey2csv(body.surveyIds);
        return NextResponse.json(csv, {status: 200}); 
    } catch (err) {
        return NextResponse.json({error: 'error creating csv file'}, {status: 500});
    }
}