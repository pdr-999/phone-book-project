export const ContactList: React.FC = () => {
  // const { loading, data, variables, refetch, networkStatus } = useQuery<
  //   GetContactList,
  //   GetContactListVariables
  // >(GET_CONTACT_LIST, {
  //   variables: {
  //     order_by: {
  //       last_name: 'asc',
  //     },
  //   },
  //   fetchPolicy: 'cache-only',
  //   notifyOnNetworkStatusChange: true,
  // })

  // TODO: offsetMore with cache, it's currently not fetching from cache
  // const [offsetMore, setOffsetMore] = useState(0)
  // useEffect(() => {
  //   fetchMore({
  //     variables: {
  //       offset: offsetMore,
  //     },
  //   })
  // }, [fetchMore, offsetMore])

  // useEffect(() => {
  //   refetch({
  //     offset: offset,
  //   })
  // }, [offset, refetch])

  return (
    <>
      <ContactList />
    </>
  )
}
