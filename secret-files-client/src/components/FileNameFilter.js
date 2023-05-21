import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useCallback, useState} from 'react'

export default function FileNameFilter({onFilter, className}) {
  const [nameFilter, setNameFilter] = useState('')

  const handleSubmit = useCallback(ev => {
    ev.preventDefault()
    onFilter && onFilter(nameFilter)
  }, [onFilter, nameFilter])

  return <Form onSubmit={handleSubmit} className={className}>
    <Form.Control placeholder="Filter by name" onChange={ev => setNameFilter(ev.target.value)} />
    <Button type="submit" variant="primary">Filter</Button>
  </Form>
}
