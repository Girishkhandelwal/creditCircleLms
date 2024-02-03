import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "../globalStates/store";
import Layout from "@/components/Common/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider>
          <Layout>
            <Component {...pageProps} className="!font-primary-font" />
          </Layout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
