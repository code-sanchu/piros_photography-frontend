import { type AppType } from "next/app";
import {
  EB_Garamond,
  Fira_Sans,
  Lora,
  Manrope,
  Merriweather,
  Open_Sans,
} from "next/font/google";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const my_serif = Lora({
  subsets: ["latin"],
  variable: "--font-my-serif",
});

const my_serif_2 = Merriweather({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-my-serif-2",
});

const my_serif_3 = EB_Garamond({
  // weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-my-serif-3",
});

const my_sans = Manrope({
  subsets: ["latin"],
  variable: "--font-my-sans",
});

const my_sans_2 = Fira_Sans({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-my-sans-2",
});

const my_sans_3 = Open_Sans({
  subsets: ["latin"],
  variable: "--font-my-sans-3",
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
            --font-my-serif-2: ${my_serif_2.style.fontFamily};
            --font-my-serif-3: ${my_serif_3.style.fontFamily};
            --font-my-sans: ${my_sans.style.fontFamily};
            --font-my-sans-2: ${my_sans_2.style.fontFamily};
            --font-my-sans-3: ${my_sans_3.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <GoogleAnalytics trackPageViews />
      <ToastContainer
        autoClose={2000}
        closeButton={false}
        hideProgressBar
        position="bottom-right"
        transition={Slide}
      />
    </>
  );
};

export default api.withTRPC(MyApp);
