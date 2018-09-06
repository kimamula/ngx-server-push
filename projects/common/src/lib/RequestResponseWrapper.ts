export interface RequestResponseWrapper {
  userAgent?: string;
  addResponseLinkHeader(values: string[]): void;
}
