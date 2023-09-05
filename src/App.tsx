import { useQuery } from '@apollo/client'
import './App.css'
import { GET_CONTACT_LIST } from './gql/contact/query'
import { GetContactList } from './gql/contact/type'
import logo from './logo.svg'

const App: React.FC = () => {
  const { loading, data } = useQuery<GetContactList>(GET_CONTACT_LIST)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
