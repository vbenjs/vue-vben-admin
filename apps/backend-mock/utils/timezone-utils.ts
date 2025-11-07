let mockTimeZone: null | string = null;

export const setTimezone = (timeZone: string) => {
  mockTimeZone = timeZone;
};

export const getTimezone = () => {
  return mockTimeZone;
};
