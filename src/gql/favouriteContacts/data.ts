import { makeVar } from '@apollo/client'
import { Contact } from '../contact/type'

export const favouriteContactsVar = makeVar<Contact[]>([])

const LOCAL_STORAGE_KEY = 'favourite-contacts'

export const getFavouriteContactsFromLocalStorage = () => {
  return new Map<number, Contact>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]').map(
      (contact: Contact) => [contact.id, contact]
    )
  )
}

favouriteContactsVar([...getFavouriteContactsFromLocalStorage().values()])

const setFavouriteContactsToLocalStorage = (set: Map<number, Contact>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...set.values()]))
}

export const addContactToFavourites = (contact: Contact) => {
  // TODO: assume contact id always exist?
  if (!contact?.id) return

  const favouriteContacts = getFavouriteContactsFromLocalStorage()

  favouriteContacts.set(contact.id, contact)

  setFavouriteContactsToLocalStorage(favouriteContacts)

  favouriteContactsVar([...favouriteContacts.values()])
}

export const updateContactInFavourite = (contact: Contact) => {
  // TODO: assume contact id always exist?
  if (!contact?.id) return

  const favouriteContacts = getFavouriteContactsFromLocalStorage()

  if (favouriteContacts.has(contact.id)) {
    favouriteContacts.set(contact.id, contact)

    setFavouriteContactsToLocalStorage(favouriteContacts)

    favouriteContactsVar([...favouriteContacts.values()])
  }
}

export const removeContactFromFavourites = (contact: Contact) => {
  // TODO: assume contact id always exist?
  if (!contact?.id) return

  const favouriteContacts = getFavouriteContactsFromLocalStorage()

  favouriteContacts.delete(contact.id)

  setFavouriteContactsToLocalStorage(favouriteContacts)

  favouriteContactsVar([...favouriteContacts.values()])
}
