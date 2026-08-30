import { NextResponse } from 'next/server'

import { buildSearchIndex } from '@/lib/search-index'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await buildSearchIndex()
  return NextResponse.json(data)
}
