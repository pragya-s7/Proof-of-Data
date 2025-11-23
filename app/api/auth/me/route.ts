import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const secret = process.env.JWT_SECRET || 'your-default-secret';
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string') {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    return NextResponse.json({ isAuthenticated: true, user: { address: decoded.address } });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
