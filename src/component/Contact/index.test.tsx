import { render, screen } from '@testing-library/react'
import { Contact as IContact } from '../../gql/contact/type'

const goodData: IContact = {
  first_name: 'John',
  last_name: 'Doe',
}

// TODO: add missing + bad data test
// const missingData: IContact = {
//   first_name: 'John',
//   last_name: 'Doe',
// }

// const badData: IContact = {
//   first_name: 'John',
//   last_name: 'Doe',
// }

test('renders contact with good data', () => {
  // render(<Contact contact={goodData} />)
  const loadingText = screen.getByText(/Doe, John/i)
  expect(loadingText).toBeInTheDocument()
})
