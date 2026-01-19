// highlight
import './utils/highlight';

// editor
import 'react-quill/dist/quill.snow.css';

// scroll bar
import 'simplebar/src/simplebar.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import 'easymde/dist/easymde.min.css';

import { QueryClientProvider, QueryClient } from 'react-query';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

// redux
import { store, persistor } from './redux/store';

// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { AuthProvider } from './contexts/JWTContext';
import MainContextProvider from './contexts/MainContext';
import CashierContextProvider from './contexts/CashierContext';
// import DashboardContextProvider from "./contexts/DashboardContext";
//
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ----------------------------------------------------------------------
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

// const query = new QueryClient();
const query = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5, // Data tetap fresh selama 5 menit
      cacheTime: 1000 * 60 * 60, // Cache bertahan 1 jam
      refetchOnWindowFocus: false, // Tidak fetch ulang saat pindah tab
    },
  },
});

root.render(
  <QueryClientProvider client={query}>
    <AuthProvider>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <MainContextProvider>
              {/* <CashierContextProvider> */}
              {/* <DashboardContextProvider> */}
              <SettingsProvider>
                <CollapseDrawerProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </CollapseDrawerProvider>
              </SettingsProvider>
              {/* </DashboardContextProvider> */}
              {/* </CashierContextProvider> */}
            </MainContextProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
serviceWorkerRegistration.unregister();
// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//         navigator.serviceWorker
//             .register("/service-worker.js")
//             .then((reg) => {
//                 console.log("✅ Beams SW registered:", reg.scope);
//             })
//             .catch((err) => {
//                 console.error("❌ Beams SW failed:", err);
//             });
//     });
// }
