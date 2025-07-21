import NavBar from "@/components/navbar/navbar"
import "../styles/globals.css"
import QuickContacts from "@/components/contactBox/quickContact/quickContact"
import ContactBox from "@/components/contactBox/contactBox/contactBox"
import { SessionProvider } from "next-auth/react"
import Map from "../components/map/map.js"
import { useRouter } from "next/router"

const noAuthRoutes = ['/welcome', '/newLogin', '/register'];

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const hideUI = currentPath === '/clipboard';

  return (
    <SessionProvider session={session}>
      {!hideUI && <NavBar />}
      {!hideUI ? <main>
        <Component {...pageProps} />
      </main> : <Component {...pageProps} />}
      {!hideUI && (
        <>
          <Map />
          <br />
          <br />
          <ContactBox />
          <QuickContacts />
        </>
      )}
    </SessionProvider>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { asPath } = ctx;
  const isAuthRequired = !noAuthRoutes.includes(asPath);

  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps, isAuthRequired };
};

export default MyApp;
