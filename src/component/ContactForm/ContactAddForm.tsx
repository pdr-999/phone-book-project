import { ActionIcon, Button, Flex, Grid, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { ReactNode, useState } from 'react'
import { validateAlphanumericString } from '../../utils'
import { AddContactVariables } from '../../gql/contact/type'
import { useMutation } from '@apollo/client'
import { ADD_CONTACT } from '../../gql/contact/mutation'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'

interface InformationForm {
  firstName: string
  lastName: string
  phones: {
    _uniqueId: string
    number: string
  }[]
}

interface ContactPhoneFormProps {
  onAddNewPhone?: (values: PhoneForm) => unknown
  onRemovePhone?: () => unknown
  isRemoveButtonHidden?: boolean
  children: ReactNode
}
interface PhoneForm {
  id?: number
  phoneNumber: string
}

const ContactPhoneForm: React.FC<ContactPhoneFormProps> = (props) => {
  const [isVerifyingDelete, setIsVerifyingDelete] = useState(false)

  const actionIcons = () => {
    return (
      <>
        {isVerifyingDelete ? (
          <>
            <Button
              variant="subtle"
              color="red"
              mt={'0.2rem'}
              compact
              onClick={() => {
                if (props.onRemovePhone) {
                  props.onRemovePhone()
                }
              }}
            >
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
          <>
            {!props.isRemoveButtonHidden && (
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
        )}
      </>
    )
  }
  return (
    <>
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
                {props.children}

                {actionIcons()}
              </Flex>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </>
  )
}

const getRandString = () => {
  const r = (Math.random() + 1).toString(36).substring(7)
  return r
}
export const ContactAddForm: React.FC = () => {
  const navigation = useNavigate()
  const informationForm = useForm<InformationForm>({
    initialValues: {
      firstName: '',
      lastName: '',
      phones: [
        {
          _uniqueId: getRandString(),
          number: '',
        },
      ],
    },
    validate: {
      firstName: (v) => {
        return validateAlphanumericString(v)
          ? null
          : 'Invalid name, dont use special characters'
      },
      lastName: (v) => {
        return validateAlphanumericString(v)
          ? null
          : 'Invalid name, dont use special characters'
      },
      phones: {
        number(v, currentValues, path) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, pathIndex] = path.split('.')
          if (
            currentValues.phones.find(
              (phone, index) =>
                phone.number === v && index < parseInt(pathIndex)
            )
          ) {
            return 'Phone already added'
          }

          return null
        },
      },
    },
  })

  const [mutateAddContact] = useMutation<any, AddContactVariables>(ADD_CONTACT)

  const onSubmit = (values: InformationForm) => {
    mutateAddContact({
      variables: {
        first_name: values.firstName,
        last_name: values.lastName,
        phones: values.phones
          .map((phone) => ({ number: phone.number }))
          .filter((phone) => phone.number.length > 0),
      },
    })
      .then(() => {
        notifications.show({
          message: 'Added contact',
          color: 'green',
        })

        navigation(-1)
      })
      .catch(() => {
        // TODO: handle error
        notifications.show({
          message: "Couldn't add contact",
          color: 'red',
        })
      })
  }
  return (
    <>
      <Text size={'sm'} mb={'0.25rem'} mt={'1rem'} fw={'bold'}>
        Information
      </Text>
      <form onSubmit={informationForm.onSubmit((values) => onSubmit(values))}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="First Name"
              placeholder="John"
              required
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

        <Text size={'sm'} mb={'0.25rem'} mt={'1rem'} fw={'bold'}>
          Phone Numbers
        </Text>

        {informationForm.values.phones.map((phone, index) => {
          return (
            <ContactPhoneForm
              isRemoveButtonHidden={informationForm.values.phones.length === 1}
              key={phone._uniqueId}
              onAddNewPhone={(values) => {}}
              onRemovePhone={() => {
                const res = informationForm.values.phones.filter(
                  (_, filterIndex) => filterIndex !== index
                )

                informationForm.setFieldValue('phones', res)
              }}
            >
              <TextInput
                placeholder="+62..."
                width={'100%'}
                sx={{
                  flexGrow: 1,
                }}
                {...informationForm.getInputProps(`phones.${index}.number`)}
              />
            </ContactPhoneForm>
          )
        })}

        <Flex justify={'center'} mt={'md'}>
          <ActionIcon
            onClick={() => {
              informationForm.setFieldValue('phones', [
                ...informationForm.values.phones,
                { number: '', _uniqueId: getRandString() },
              ])
            }}
          >
            <IconPlus />
          </ActionIcon>
        </Flex>

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
    </>
  )
}
