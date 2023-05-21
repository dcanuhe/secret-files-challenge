import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useState} from 'react'

export default function FileNameFilter({onFilter, className}) {
  const [nameFilter, setNameFilter] = useState('')

  const handleSubmit = ev => {
    ev.preventDefault()
    onFilter && onFilter(nameFilter)
  }

  return <Form onSubmit={handleSubmit} className={className}>
    <Form.Control placeholder="Filter by name" onChange={ev => setNameFilter(ev.target.value)} />
    <Button type="submit" variant="primary">Filter</Button>
  </Form>
}
