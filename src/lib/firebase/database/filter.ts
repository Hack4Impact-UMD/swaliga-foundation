import { db } from "../firebaseConfig";
import { collection, query as fsQuery, where, getDocs } from 'firebase/firestore';
import { User } from '@/types/User';
import { NextRequest, NextResponse } from 'next/server';

// GET all users with filters
export async function getAllUsers(filters: Record<string, any> = {}) {
  let query = fsQuery(collection(db, 'users'));
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      query = fsQuery(query, where(key, '==', filters[key]));
    }
  });

  const snapshot = await getDocs(query);
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User);
  
  return users;
}

export async function GET(req: NextRequest) {
    try {
      const url = req.nextUrl;
      const searchParams = new URLSearchParams(url.search);
      const filters: Record<string, any> = {};
      
      searchParams.forEach((value, key) => {
        filters[key] = value;
      });
  
      const allUsers = await getAllUsers(filters);
      return NextResponse.json(allUsers, { status: 200 });
    } catch (error) {
      console.error('Error getting users:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
