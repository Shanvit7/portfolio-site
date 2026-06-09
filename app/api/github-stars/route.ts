import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get('repo')

  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return NextResponse.json({ stars: null }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) return NextResponse.json({ stars: null })

    const data = await res.json()
    return NextResponse.json(
      { stars: data.stargazers_count ?? null },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch {
    return NextResponse.json({ stars: null })
  }
}
