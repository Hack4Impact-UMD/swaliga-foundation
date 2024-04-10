// pages/route.tsx

import { NextRequest, NextResponse } from 'next/server';
import { getAllResponses, createResponse } from '@/lib/firebase/database/response';
import { Response } from '@/types/survey-types';

export async function GET(req: NextRequest) {
  try {
    const allResponses = await getAllResponses();
    return NextResponse.json(allResponses, { status: 200 });
  } catch (error) {
    console.error('Error getting responses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newResponse: Response = await req.json();
    await createResponse(newResponse);
    return NextResponse.json({ message: 'Response created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
