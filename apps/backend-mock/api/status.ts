export default eventHandler((event) => {
  const { status } = getQuery(event);
  setResponseStatus(event, Number(status));
  return useResponseError(`${status}`);
});
