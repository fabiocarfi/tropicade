import { SessionProvider } from "next-auth/react";
import ThankYouComponent from "./thank-you-component";

const ThankYouPage = async () => {
  return (
    <SessionProvider>
      <ThankYouComponent />
    </SessionProvider>
  );
};
export default ThankYouPage;
