export interface PidsProviderProps {
  children?: React.ReactElement;
}

export const PidsProvider: React.FC<PidsProviderProps> = ({ children }) => {
  return <>{children}</>;
};
