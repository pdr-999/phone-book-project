export interface EditPhoneByPkVariables {
  where: {
    id: {
      _eq: number
    }
  }
  set: {
    number: string
  }
}
export interface AddPhoneToContactResponse {
  insert_phone_one: {
    id: number
    contact_id: number
  }
}
export interface AddPhoneToContactVariables {
  object: {
    number: string
    contact_id: number
  }
}
