import { favouriteContactsVar } from './query'

const LOCAL_STORAGE_KEY = 'favourite-contacts'

export const getFavouriteContactsFromLocalStorage = () => {
  return new Set<number>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]')
  )
}

const setFavouriteContactsToLocalStorage = (set: Set<number>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...set.values()]))
}

export const addContactToFavourites = (id: number) => {
  const favouriteContacts = getFavouriteContactsFromLocalStorage()

  favouriteContacts.add(id)

  setFavouriteContactsToLocalStorage(favouriteContacts)

  favouriteContactsVar([...favouriteContacts])
}

export const removeContactFromFavourites = (id: number) => {
  const favouriteContacts = getFavouriteContactsFromLocalStorage()

  favouriteContacts.delete(id)

  setFavouriteContactsToLocalStorage(favouriteContacts)
}
