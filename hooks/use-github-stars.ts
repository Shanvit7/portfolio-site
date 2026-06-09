'use client'

import { useEffect, useState } from 'react'

export function useGithubStars(repo?: string): number | null {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    if (!repo) return
    fetch(`/api/github-stars?repo=${encodeURIComponent(repo)}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.stars === 'number') setStars(d.stars)
      })
      .catch(() => {})
  }, [repo])

  return stars
}
