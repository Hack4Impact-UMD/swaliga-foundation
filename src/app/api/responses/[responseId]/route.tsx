import { NextRequest, NextResponse } from 'next/server';
import { getResponseByID } from '@/lib/firebase/database/response';
import { Response } from '@/types/survey-types';
import { getAllResponses } from '@/lib/firebase/database/response';

export async function generateStaticParams() {
    const responses = await getAllResponses();
    return responses.map((response: Response) => ({ responseId: response.responseId }));
}

export async function GET(req: NextRequest, { params }: { params: { responseId: string } }) {
  const { responseId } = params; 
  // console.log('responseId:', responseId);

  try {
    const response: Response | null = await getResponseByID(responseId);
    if (response) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Response not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting response by ID:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

