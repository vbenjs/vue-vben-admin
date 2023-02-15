export default interface SearchParameters {
  page?: number;
  size?: number;
  sort?: string[];
  [key: string]: any;
}
