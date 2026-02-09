export const buildUrl = (
  base: string,
  queryParams: Record<string, string | number | boolean | undefined | null> = {}
): string => {
  const query = new URLSearchParams(Object.entries(queryParams).map(([k, v]) => [k, String(v)]));

  return queryParams ? `${base}?${query.toString()}` : base;
};
