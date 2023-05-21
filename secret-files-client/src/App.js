import './App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import FileNameFilter from './components/FileNameFilter'
import {useFilesData} from './filesData'

function App() {
  const {data: filesData, loading, error, setNameFilter} = useFilesData()

  return <Container fluid>
    {error &&
      <Alert variant="danger">An error has ocurred</Alert>
    }
    <Row>
      <Col className="wide">
        <div  className="top-bar">React Test App</div>
      </Col>
    </Row>
    <Row>
      <Col>
        <FileNameFilter onFilter={setNameFilter} className="file-name-filter" />
      </Col>
    </Row>
    <Col>
      <Table bordered striped hover className="files-data-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Text</th>
            <th>Number</th>
            <th>Hex</th>
          </tr>
        </thead>
        <tbody>
          {filesData.length === 0 &&
            <tr>
              <td colSpan="4" className="weak">There are no elements to show.</td>
            </tr>
          }
          {filesData.map(fileData => fileData.lines.map((line, i) =>
            <tr key={fileData.file + i}>
              <td>{fileData.file}</td>
              <td>{line.text}</td>
              <td>{line.number}</td>
              <td>{line.hex}</td>
            </tr>
          ))}
          {loading &&
            <tr>
              <td colSpan="4" className="weak">Loading...</td>
            </tr>
          }
        </tbody>
      </Table>
    </Col>
  </Container>
}

export default App
