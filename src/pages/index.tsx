import { ContactList } from '../component/ContactList/ContactList'
import { SwNotification } from '../component/SwNotification'
import { Link } from 'react-router-dom'

const Index: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ContactList />
      </header>
    </div>
  )
}

export default Index
