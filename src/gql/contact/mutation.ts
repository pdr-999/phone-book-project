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

export const ADD_CONTACT = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`
