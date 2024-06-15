import ReactDOM from "react-dom/client";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/index'
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
);
