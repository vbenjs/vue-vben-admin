export const regionSplit = (
  obj = {},
  array = "addressArr",
  province = "province",
  city = "city",
  area = "area"
) => {
  if (!obj[array]) return;
  if (Array.isArray(obj[array])) {
    obj[province] = obj[array][0];
    obj[city] = obj[array][1];
    obj[area] = obj[array][2];
    delete obj[array];
  }
};

export const regionJoin = (
  obj = {},
  array = "addressArr",
  province = "province",
  city = "city",
  area = "area"
) => {
  obj[array] = [obj[province], obj[city], obj[area]];
};
