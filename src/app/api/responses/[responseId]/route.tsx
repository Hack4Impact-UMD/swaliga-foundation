import { NextRequest, NextResponse } from 'next/server';
import { getResponseByID } from '../../../../lib/firebase/database/response';
import { Response } from '../../../../types/survey-types';

export async function GET(req: NextRequest) {
  const urlParts = req.url.split('/'); 
  const responseId: string = urlParts[urlParts.length - 1]; 

  console.log('responseId:', responseId);
  console.log('urlParts:', urlParts);

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
