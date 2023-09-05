import { OrderBy } from '../type'

interface ContactOrderBy {
  created_at?: OrderBy
  first_name?: OrderBy
  id?: OrderBy
  last_name?: OrderBy
  updated_at?: OrderBy
}

export interface Contact {
  created_at?: string
  first_name?: string
  id?: number
  last_name?: string
  phones?: {
    number?: string
  }
}

export type GetContactList = { contact: Contact[] }

export type GetContactListVariables = {
  offset?: number
  order_by?: ContactOrderBy
}
