import { OrderBy } from '../type'

interface ContactOrderBy {
  created_at?: OrderBy
  first_name?: OrderBy
  id?: OrderBy
  last_name?: OrderBy
  updated_at?: OrderBy
}

interface Phone {
  id?: number
  number?: string
}
export interface Contact {
  created_at?: string
  first_name?: string
  id?: number
  last_name?: string
  phones?: Phone[]
  is_favourite?: boolean
}

export type GetContactList = { contact: Contact[] }

export type GetContactListVariables = {
  offset?: number
  limit?: number
  order_by?: ContactOrderBy
  is_favourite?: boolean
  where?: {
    _or: [
      {
        first_name: {
          _ilike: string
        }
      },
      {
        last_name: {
          _ilike: string
        }
      },
      {
        phones: {
          number: {
            _ilike: string
          }
        }
      }
    ]
  }
}

export type GetContactByPk = { contact_by_pk: Contact }
export type EditContactByPk = { update_contact_by_pk: Contact }

export type GetContactByPkVariables = { id: number }

export type EditContactByPkVariables = {
  id: number
  _set: {
    first_name: string
    last_name: string
  }
}

export type AddContactVariables = {
  first_name: string
  last_name: string
  phones: {
    number: string
  }[]
}
