import { type AppType } from "next/app";
import { Lora, Manrope, Merriweather } from "next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const my_serif = Lora({
  subsets: ["latin"],
  variable: "--font-my-serif",
});

const my_serif2 = Merriweather({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-my-serif-2",
});

const my_sans = Manrope({
  subsets: ["latin"],
  variable: "--font-my-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-my-serif: ${my_serif.style.fontFamily};
            --font-my-serif2: ${my_serif2.style.fontFamily};
            --font-my-sans: ${my_sans.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        position="bottom-right"
        transition={Slide}
      />
    </>
  );
};

export default api.withTRPC(MyApp);
