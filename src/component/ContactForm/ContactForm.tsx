import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Button,
  Flex,
  Grid,
  Text,
  TextInput,
  Variants,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { EDIT_CONTACT_BY_ID } from '../../gql/contact/mutation'
import { EditContactByPkVariables } from '../../gql/contact/type'
import { EDIT_PHONE_BY_PK, INSERT_PHONE_ONE } from '../../gql/phone/mutation'
import {
  AddPhoneToContactResponse,
  AddPhoneToContactVariables,
  EditPhoneByPkVariables,
} from '../../gql/phone/type'

interface ContactFormProps {
  initialValues: {
    id?: number
    firstName?: string
    lastName?: string
    phones?: {
      id?: number
      phoneNumber?: string
    }[]
  }
}

interface InformationForm {
  firstName: string
  lastName: string
}

interface ContactPhoneFormProps {
  initialValues: {
    id?: number
    phoneNumber?: string
  }
  contactId?: number
  onAddNewPhone?: (values: PhoneForm) => unknown
}
interface PhoneForm {
  id?: number
  phoneNumber: string
}

const ContactPhoneForm: React.FC<ContactPhoneFormProps> = (props) => {
  const form = useForm<PhoneForm>({
    initialValues: {
      phoneNumber: props.initialValues?.phoneNumber ?? '',
      id: props.initialValues.id,
    },
    validate: {
      phoneNumber: (values) =>
        values.length === 0 ? 'Invalid Phone Number' : null,
    },
  })
  const isNew = !form.values.id

  const [mutateEditPhone, {}] = useMutation<any, EditPhoneByPkVariables>(
    EDIT_PHONE_BY_PK
  )

  const [mutateAddPhoneToContact, { error: addPhoneToContactError }] =
    useMutation<AddPhoneToContactResponse, AddPhoneToContactVariables>(
      INSERT_PHONE_ONE
    )

  useEffect(() => {
    if (!addPhoneToContactError) return
    let message

    /**
     * FIXME: should be constant apollo error code
     */
    if (addPhoneToContactError.message.includes('Uniqueness violation')) {
      message = 'This contact already has this phone number'
    }

    notifications.show({
      title: `Couldn't add phone number`,
      message,
      color: 'red',
    })
  }, [addPhoneToContactError])

  const [isEditing, setIsEditing] = useState(false)

  const onSubmit = (values: PhoneForm) => {
    // FIXME: looks kinda ugly
    setIsEditing(false)
    if (values.id) {
      mutateEditPhone({
        variables: {
          set: {
            number: values.phoneNumber,
          },
          where: {
            id: {
              _eq: values.id,
            },
          },
        },
      })
        .then(() => {
          notifications.show({
            message: 'Updated Phone Number',
            color: 'green',
          })
        })
        .catch(() => {
          // TODO: handle naked error
          notifications.show({
            message: `Couldn't update phone number`,
            color: 'red',
          })
        })
    } else if (props.contactId) {
      mutateAddPhoneToContact({
        variables: {
          object: {
            contact_id: props.contactId,
            number: values.phoneNumber,
          },
        },
      })
        .then((res) => {
          form.setFieldValue('id', res.data?.insert_phone_one.id)
          notifications.show({
            message: 'Added Phone Number',
            color: 'green',
          })

          if (props.onAddNewPhone) {
            props.onAddNewPhone({
              id: res.data?.insert_phone_one.id,
              phoneNumber: values.phoneNumber,
            })
          }

          form.reset()
        })
        .catch(() => {})
    }
  }

  const [isVerifyingDelete, setIsVerifyingDelete] = useState(false)
  const variant = () => {
    let variant: Variants<'unstyled' | 'default' | 'filled'> = 'unstyled'

    if (isNew || isEditing) {
      variant = 'default'
    }
    return variant
  }

  const actionIcons = () => {
    if (isNew) {
      return (
        <>
          <ActionIcon mt={'0.2rem'} type="submit">
            <IconPlus />
          </ActionIcon>
        </>
      )
    }

    if (isEditing) {
      return (
        <>
          <ActionIcon mt={'0.2rem'} type="submit">
            <IconCheck />
          </ActionIcon>
          <Button
            mt={'0.2rem'}
            compact
            type="button"
            size="sm"
            variant="subtle"
            color="red"
            onClick={(e) => {
              e.preventDefault()
              form.reset()
              setIsEditing(false)
            }}
          >
            Cancel
          </Button>
        </>
      )
    } else {
      return (
        <>
          {!isVerifyingDelete && (
            <ActionIcon
              variant="subtle"
              type="button"
              mt={'0.2rem'}
              onClick={(e) => {
                e.preventDefault()
                setIsEditing((prev) => !prev)
              }}
            >
              <IconEdit />
            </ActionIcon>
          )}

          {isVerifyingDelete ? (
            <>
              <Button variant="subtle" color="red" mt={'0.2rem'} compact>
                Confirm Delete
              </Button>

              <Button
                variant="subtle"
                mt={'0.2rem'}
                compact
                onClick={() => {
                  setIsVerifyingDelete(false)
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <ActionIcon
              variant="subtle"
              type="button"
              mt={'0.2rem'}
              onClick={() => {
                setIsVerifyingDelete(true)
              }}
            >
              <IconTrash />
            </ActionIcon>
          )}
        </>
      )
    }
  }
  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Grid>
        <Grid.Col>
          <Grid>
            <Grid.Col>
              <Flex
                direction={'row'}
                align={'flex-start'}
                w={'100%'}
                gap={'sm'}
              >
                <TextInput
                  readOnly={isNew ? false : !isEditing}
                  pl={variant() === 'unstyled' ? 'sm' : undefined}
                  variant={variant()}
                  placeholder="+62..."
                  width={'100%'}
                  sx={{
                    flexGrow: 1,
                  }}
                  {...form.getInputProps('phoneNumber')}
                />

                {actionIcons()}
              </Flex>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </form>
  )
}
export const ContactForm: React.FC<ContactFormProps> = (props) => {
  const informationForm = useForm<InformationForm>({
    initialValues: {
      firstName: props.initialValues.firstName ?? '',
      lastName: props.initialValues.lastName ?? '',
    },
    validate: {
      firstName: (v) => {
        /**
         * FIXME: Assigning this to a variable causes it to alternate between error and ok
         * eg:
         *  const PATTERN = /^[a-zA-Z0-9 ]+$/g
         *  PATTERN.test(v)
         * */
        return /^[a-zA-Z0-9 ]+$/g.test(v) ? null : 'Invalid Name'
      },
    },
  })

  const [mutateEditContact, { data, loading, error }] = useMutation<
    any,
    EditContactByPkVariables
  >(EDIT_CONTACT_BY_ID)

  const onInformationFormSubmit = (values: InformationForm) => {
    if (props?.initialValues?.id) {
      mutateEditContact({
        variables: {
          id: props.initialValues.id,
          _set: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      })
        .then(() => {
          notifications.show({
            color: 'green',
            message: 'Updated contact information',
          })
        })
        // TODO: handle naked error
        .catch(() => {
          notifications.show({
            color: 'red',
            message: `Couldn't update contact information`,
          })
        })
    }
  }

  const [contactPhones, setContactPhones] = useState(props.initialValues.phones)
  return (
    <>
      <Text size={'sm'} mb={'0.25rem'} mt={'1rem'} fw={'bold'}>
        Information
      </Text>
      <form
        onSubmit={informationForm.onSubmit((values) =>
          onInformationFormSubmit(values)
        )}
      >
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="First Name"
              placeholder="John"
              {...informationForm.getInputProps('firstName')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Last Name"
              placeholder="Doe"
              {...informationForm.getInputProps('lastName')}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col>
            <Flex gap={'xs'}>
              <Button size="sm" color="green" type="submit">
                Save
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>

      <Text size={'sm'} mb={'0.25rem'} mt={'1rem'} fw={'bold'}>
        Phone Numbers
      </Text>

      {contactPhones?.map((phone, index) => {
        return (
          <ContactPhoneForm
            key={index}
            initialValues={{
              id: phone.id,
              phoneNumber: phone.phoneNumber,
            }}
          />
        )
      })}

      <ContactPhoneForm
        initialValues={{}}
        contactId={props.initialValues.id}
        onAddNewPhone={(values) => {
          setContactPhones((prev) => {
            const newContactPhones = [...(prev ?? [])]
            newContactPhones.push(values)
            return newContactPhones
          })
        }}
      />
    </>
  )
}
