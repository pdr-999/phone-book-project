import { ContactList } from '../component/ContactList/ContactList'
import { FavouriteContactList } from '../component/FavouriteContactList/FavouriteContactList'
import { SwNotification } from '../component/SwNotification'
import { Link } from 'react-router-dom'

const Index: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Link to={'/contact/create'}>Create contact</Link>
        <SwNotification />

        <FavouriteContactList />
        <ContactList />
      </header>
    </div>
  )
}

export default Index
