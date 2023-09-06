import { Link } from 'react-router-dom'

export const CreateContact: React.FC = () => {
  // TODO: make navigation not go back and forth in PWA
  return (
    <>
      <h4> Welcome to create contact page </h4>
      <Link to={'/'}>Back to Home</Link>
    </>
  )
}
