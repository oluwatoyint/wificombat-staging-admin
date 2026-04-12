// stores/cacheStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCacheStore = create(
  persist(
    (set, get) => ({
      cache: {},
      setCacheData: (key, data) => set(state => ({
        cache: {
          ...state.cache,
          [key]: {
            data,
            timestamp: Date.now()
          }
        }
      })),
      getCacheData: (key, maxAge = 3600000) => {
        const cached = get().cache[key]
        if (!cached) return null
        
        const isExpired = Date.now() - cached.timestamp > maxAge
        return isExpired ? null : cached.data
      },
      clearCache: () => set({ cache: {} }),
      invalidateCache: (key) => set(state => {
        const newCache = { ...state.cache }
        delete newCache[key]
        return { cache: newCache }
      }),
      clearCacheByPattern: (pattern) => set(state => {
        const newCache = Object.entries(state.cache).reduce((acc, [key, value]) => {
          if (!key.includes(pattern)) {
            acc[key] = value
          }
          return acc
        }, {})
        return { cache: newCache }
      })
    }),
    {
      name: 'api-cache',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)

export default useCacheStore