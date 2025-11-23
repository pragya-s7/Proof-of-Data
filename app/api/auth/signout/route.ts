import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: 'Signed out successfully' });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json({ success: false, message: 'Sign-out failed' }, { status: 500 });
  }
}
