import { useCallback, useState } from 'react'

export const useLoading = <A extends any[], U extends unknown>(
  f: (...args: A) => Promise<U>,
): [boolean, (...args: A) => Promise<U>] => {
  const [loading, setLoading] = useState<boolean>(false)

  const wrappedF = useCallback(
    async (...args: A): Promise<U> => {
      setLoading(true)
      try {
        const result = await f(...args)
        setLoading(false)
        return result
      } catch (e) {
        setLoading(false)
        return Promise.reject(e)
      }
    },
    [f],
  )

  return [loading, wrappedF]
}
