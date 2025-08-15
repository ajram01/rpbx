import { NextResponse } from 'next/server'
import { createClient } from '../../../../utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id")
    .limit(10);

  return NextResponse.json({ data, error });
}
