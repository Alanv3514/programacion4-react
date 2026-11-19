/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import type { DependencyList } from 'react'

export function useFetch<T>(fetcher: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, deps)

  return { data, error, loading, setData }
}
