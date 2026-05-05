import { getWarRoomPlans } from '@/lib/db'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const ventureName = searchParams.get('venture') ?? 'Novizio'
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

  try {
    const plans = await getWarRoomPlans(ventureName, limit)
    return Response.json(plans)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
