import {
  ActionIcon,
  Avatar,
  Box,
  CSSObject,
  Flex,
  Text,
  createStyles,
  rem,
} from '@mantine/core'
import {
  IconEdit,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react'
import { useState } from 'react'

interface PhoneNumber {
  id?: number
  phoneNumber?: string
}

export interface ContactProps {
  avatarUrl?: string
  firstName?: string
  lastName?: string
  isFirstItem?: boolean
  isLastItem?: boolean
  phoneNumbers?: PhoneNumber[]
  isActive?: boolean
  onClick?: () => unknown
  onFavouriteClick?: () => unknown
  onEditClick?: () => unknown
  isFavourite?: boolean
}

const TRANSITION_PROPERTY: CSSObject = {
  transition: '0.3s',
  transitionTimingFunction: 'cubic-bezier(0.1, 0.85, 0.15, 1)',
}

const ACTIONS_HEIGHT = 64
const PHONE_SINGLE_ROW_HEIGHT = 44
const PHONE_NUMBER_ITEM_HEIGHT = rem(PHONE_SINGLE_ROW_HEIGHT)

export const Contact: React.FC<ContactProps> = (props) => {
  const {
    firstName = '',
    lastName = '',
    isFirstItem: first = false,
    isLastItem: last = false,
    phoneNumbers = [],
    isActive: isControlledActive = undefined,
    isFavourite: isFavourited = false,
  } = props
  const firstPhoneNumber = phoneNumbers[0]?.phoneNumber ?? null
  const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`
  const [isActiveLocal, setIsActiveLocal] = useState(false)

  const isActive =
    typeof isControlledActive === 'undefined'
      ? isActiveLocal
      : isControlledActive

  const useStyles = createStyles(() => ({
    phoneNumbersInitial: {
      height: 0,
    },
    phoneNumbersActive: {
      height: PHONE_SINGLE_ROW_HEIGHT * phoneNumbers.length + ACTIONS_HEIGHT,
    },
    translateDown: {
      transform: 'translateY(.75rem)',
    },
    opacity0: {
      opacity: 0,
    },
    opacity1: {
      opacity: 1,
    },
    phoneNumberInactive: {
      opacity: 0,
      transitionDuration: '0s',
      transitionDelay: '0s',
      transitionTimingFunction: 'ease-in',
    },
    phoneNumberActive: {
      opacity: 1,
      transitionDelay: '0.1s',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease-out',
    },
  }))

  const { classes } = useStyles()

  return (
    <>
      <Box
        pos={'relative'}
        onClick={() => {
          if (props.onClick) {
            props.onClick()
          } else {
            setIsActiveLocal((prev) => !prev)
          }
        }}
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[6],
          // TODO: refactor?
          borderTopLeftRadius: first ? '.5rem' : undefined,
          borderTopRightRadius: first ? '.5rem' : undefined,
          borderBottomLeftRadius: last ? '.5rem' : undefined,
          borderBottomRightRadius: last ? '.5rem' : undefined,
        })}
        p={'xs'}
      >
        <Flex justify={'start'} align={'center'} gap={'sm'} h={'2.8rem'}>
          <Avatar src={avatarUrl} alt="it's me" radius={'xl'} />
          <Box>
            <Flex justify={'start'} direction={'column'}>
              <Text
                fw={'bold'}
                sx={{
                  ...TRANSITION_PROPERTY,
                }}
                className={isActive ? classes.translateDown : undefined}
              >
                {firstName} {lastName}
              </Text>

              <Text
                sx={{
                  ...TRANSITION_PROPERTY,
                }}
                className={isActive ? classes.opacity0 : undefined}
                size={'sm'}
              >
                {firstPhoneNumber ?? 'No phone number'}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Flex
        sx={(theme) => ({
          zIndex: 2,
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.sm,
          backgroundColor: theme.colors.dark[5],
          ...TRANSITION_PROPERTY,
        })}
        className={
          isActive ? classes.phoneNumbersActive : classes.phoneNumbersInitial
        }
        direction={'column'}
      >
        {phoneNumbers.map(({ id, phoneNumber }) => (
          <Flex
            key={id}
            h={PHONE_NUMBER_ITEM_HEIGHT}
            sx={{
              overflow: 'hidden',
              alignItems: 'center',
            }}
            ml={'calc(2.8rem + .75rem)'}
          >
            <Text
              className={
                isActive
                  ? classes.phoneNumberActive
                  : classes.phoneNumberInactive
              }
            >
              {phoneNumber}
            </Text>
          </Flex>
        ))}

        <Flex
          h={ACTIONS_HEIGHT}
          sx={{
            overflow: 'hidden',
            alignItems: 'center',
          }}
          justify={'center'}
        >
          <Flex
            className={
              isActive ? classes.phoneNumberActive : classes.phoneNumberInactive
            }
            gap={'md'}
          >
            <ActionIcon
              color="yellow"
              size={'lg'}
              onClick={props.onFavouriteClick}
            >
              {isFavourited ? (
                <IconStarFilled size="1.6rem" />
              ) : (
                <IconStar size="1.6rem" />
              )}
            </ActionIcon>
            <ActionIcon color="blue" size={'lg'} onClick={props.onEditClick}>
              <IconEdit size="1.6rem" />
            </ActionIcon>
            <ActionIcon color="red" size={'lg'}>
              <IconTrash size="1.6rem" />
            </ActionIcon>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
