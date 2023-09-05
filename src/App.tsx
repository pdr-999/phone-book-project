import './App.css'
import { ContactList } from './component/ContactList'
import { SwNotification } from './component/SwNotification'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <SwNotification />
        <ContactList />
      </header>
    </div>
  )
}

export default App
