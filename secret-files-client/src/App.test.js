import {render, screen} from '@testing-library/react'
import App from './App'
import {useFilesData} from './filesData'

jest.mock('./filesData')

test('renders top bar', () => {
  useFilesData.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    setNameFilter: jest.fn()
  })

  render(<App />)

  expect(screen.getByText(/react test app/i)).toBeInTheDocument()
})

test("renders empty table initially when there's no data", () => {
  useFilesData.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    setNameFilter: jest.fn()
  })

  render(<App />)
  
  expect(screen.getByText(/there are no elements to show/i)).toBeInTheDocument()
})

test("doesn't render error message when there's no error", () => {
  useFilesData.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    setNameFilter: jest.fn()
  })

  render(<App />)

  expect(screen.queryByText(/error/i)).toBeNull()
})

test("renders loading message while loading", () => {
  useFilesData.mockReturnValue({
    data: [],
    loading: true,
    error: null,
    setNameFilter: jest.fn()
  })

  render(<App />)

  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

test('renders data after loading it', () => {
  const filesData = [
    {
      file: '1.csv',
      lines: [{ text: 'qwe', number: 123, hex: '1234567890abcdef1234567890abcdef' }]
    },
    {
      file: '2.csv',
      lines: [{ text: 'asd', number: 234, hex: 'abcdef1234567890abcdef1234567890' }]
    },
  ]

  useFilesData.mockReturnValue({
    data: filesData,
    loading: false,
    error: null,
    setNameFilter: jest.fn()
  })

  render(<App />)

  expect(screen.getByText('1.csv')).toBeInTheDocument()
  expect(screen.getByText('qwe')).toBeInTheDocument()
  expect(screen.getByText('123')).toBeInTheDocument()
  expect(screen.getByText('1234567890abcdef1234567890abcdef')).toBeInTheDocument()
  expect(screen.getByText('2.csv')).toBeInTheDocument()
  expect(screen.getByText('asd')).toBeInTheDocument()
  expect(screen.getByText('234')).toBeInTheDocument()
  expect(screen.getByText('abcdef1234567890abcdef1234567890')).toBeInTheDocument()

  expect(screen.queryByText(/loading/i)).toBeNull()
  expect(screen.queryByText(/error/i)).toBeNull()
  expect(screen.queryByText(/there are no elements to show/i)).toBeNull()
})

test("renders an error message when there's an error", () => {
  useFilesData.mockReturnValue({
    data: [],
    loading: false,
    error: new Error('Internal Server Error'),
    setNameFilter: jest.fn(),
  })

  render(<App />)

  expect(screen.getByText(/error/i)).toBeInTheDocument()
  expect(screen.getByText(/there are no elements to show/i)).toBeInTheDocument()

  expect(screen.queryByText(/loading/i)).toBeNull();
})

test("renders an error message and the old data when there's an error and old data", () => {
  const filesData = [
    {
      file: '1.csv',
      lines: [{ text: 'qwe', number: 123, hex: '1234567890abcdef1234567890abcdef' }]
    },
  ]
  
  useFilesData.mockReturnValue({
    data: filesData,
    loading: false,
    error: new Error('Internal Server Error'),
    setNameFilter: jest.fn(),
  })

  render(<App />)

  expect(screen.getByText(/error/i)).toBeInTheDocument()
  expect(screen.getByText('1.csv')).toBeInTheDocument()
  expect(screen.getByText('qwe')).toBeInTheDocument()
  expect(screen.getByText('123')).toBeInTheDocument()
  expect(screen.getByText('1234567890abcdef1234567890abcdef')).toBeInTheDocument()

  expect(screen.queryByText(/loading/i)).toBeNull();
  expect(screen.queryByText(/there are no elements to show/i)).toBeNull()
})
