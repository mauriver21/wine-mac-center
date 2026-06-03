import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export const withPaypalProvider = <T extends JSX.IntrinsicAttributes>(Component: React.FC<T>) => {
  return (props: T) => {
    return (
      <PayPalScriptProvider
        options={{
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
          vault: true,
          intent: 'subscription'
        }}
      >
        <Component {...props} />
      </PayPalScriptProvider>
    );
  };
};
