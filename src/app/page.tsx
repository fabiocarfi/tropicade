import DesignConfigurator from "@/components/design-configurator";
import { SessionProvider } from "next-auth/react";

const HomePage = async () => {
  return (
    <SessionProvider>
      <DesignConfigurator />;
    </SessionProvider>
  );
};
export default HomePage;
