import ReactDOM from "react-dom/client";
import { I18nextProvider } from 'react-i18next';
import { attachConsole } from "tauri-plugin-log-api";
import i18n from './locales';
import App from "./App";

attachConsole();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
);
