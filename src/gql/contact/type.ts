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
