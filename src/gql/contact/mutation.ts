import { gql } from '@apollo/client'

export const EDIT_CONTACT_BY_ID = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      first_name
      last_name
    }
  }
`

export const DELETE_CONTACT_BY_ID = gql`
  mutation Mutation_root($deleteContactByPkId: Int!) {
    delete_contact_by_pk(id: $deleteContactByPkId) {
      id
    }
  }
`
