import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions) as import("next-auth").Session;
  if (!session || !(session.user && (session.user as { id?: number }).id)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: Number((session.user as { id?: number }).id) },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      phone: true,
      createdAt: true,
      role: true,
      // أضف أي حقل آخر تريده هنا
    },
  });
  if (!user) {
    return NextResponse.json({ user: null, error: 'المستخدم غير موجود في قاعدة البيانات' }, { status: 404 });
  }
  return NextResponse.json({ user });
}
