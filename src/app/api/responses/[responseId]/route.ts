import { NextRequest, NextResponse } from 'next/server';
import { getResponseByID } from '@/lib/firebase/database/response';
import { Response } from '@/types/survey-types';

export async function GET(req: NextRequest, { params }: { params: { responseId: string } }) {
  const { responseId } = params; 
  // console.log('responseId:', responseId);

  try {
    const response: Response | null = await getResponseByID(responseId);
    if (response) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting response by ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

