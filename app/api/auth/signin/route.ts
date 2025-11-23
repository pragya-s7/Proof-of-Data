import { NextResponse } from 'next/server';
import { verifyMessage } from 'ethers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json();

    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'your-default-secret';
    const token = jwt.sign({ address }, secret, { expiresIn: '1d' });

    const response = NextResponse.json({ success: true, message: 'Signed in successfully' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json({ success: false, message: 'Sign-in failed' }, { status: 500 });
  }
}
