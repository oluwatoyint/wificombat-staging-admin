// hooks/useFetch.js
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import useCacheStore from '../stores/cacheStore'

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { getCacheData, setCacheData, invalidateCache } = useCacheStore()
  const token = Cookies.get('token')

  const fetchData = async (skipCache = false) => {
    const cacheKey = url
    
    if (!skipCache) {
      const cachedData = getCacheData(cacheKey, options.cacheTime || 3600000)
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      const response = await fetch(url,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      )

      console.log(response);
      

      // if(response.status === 401) {
      //   window.location.href = '/login'
      // }
      
      const jsonData = await response.json()
      setData(jsonData)

      console.log(jsonData);
      
      
      if (!skipCache) {
        setCacheData(cacheKey, jsonData)
      }
    } catch (error) {
      setError(error)
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(false)
  }, [url])

  const refetch = async () => {
    invalidateCache(url)
    await fetchData(true)
  }

  // if(data?.message === "Authentication credentials were not provided or are invalid.") {
  //   window.location.href = '/login'
  // }
  console.log(data);
  

  return { data, loading, error, refetch }
}

export default useFetch