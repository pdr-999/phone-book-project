import './App.css'
import { ContactList } from './component/ContactList'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ContactList />
      </header>
    </div>
  )
}

export default App
