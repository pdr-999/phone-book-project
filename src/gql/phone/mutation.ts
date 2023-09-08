import { gql } from '@apollo/client'

export const EDIT_PHONE_BY_PK = gql`
  mutation UpdatePhoneByPk($where: phone_bool_exp!, $set: phone_set_input) {
    update_phone(where: $where, _set: $set) {
      affected_rows
    }
  }
`

export const INSERT_PHONE_ONE = gql`
  mutation InsertPhoneOne($object: phone_insert_input!) {
    insert_phone_one(object: $object) {
      id
      contact_id
    }
  }
`

export const DELETE_PHONE = gql`
  mutation DeletePhone($where: phone_bool_exp!) {
    delete_phone(where: $where) {
      affected_rows
    }
  }
`
