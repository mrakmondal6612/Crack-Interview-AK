import { addDemoInterviews } from "@/lib/actions/addDemoInterviews";

export async function POST() {
  try {
    await addDemoInterviews();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error) }), { status: 500 });
  }
}

export async function GET() {
  try {
    await addDemoInterviews();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error) }), { status: 500 });
  }
}
