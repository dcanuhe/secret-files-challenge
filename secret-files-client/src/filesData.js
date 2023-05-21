import {useState, useEffect} from 'react'
import config from './config'

export function useFilesData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`${config.apiUrl}/files/data?fileName=${nameFilter}`)
      .then(response => response.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [nameFilter])

  return {data, loading, error, setNameFilter}
}
