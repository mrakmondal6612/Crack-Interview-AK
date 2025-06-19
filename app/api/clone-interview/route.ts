export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { cloneInterview } from '@/lib/actions/cloneInterview.action';

export async function POST(req: NextRequest) {
  try {
    const { interviewId, userId } = await req.json();
    if (!interviewId || !userId) {
      return NextResponse.json({ error: 'Missing interviewId or userId' }, { status: 400 });
    }
    const newInterviewId = await cloneInterview(interviewId, userId);
    return NextResponse.json({ newInterviewId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
