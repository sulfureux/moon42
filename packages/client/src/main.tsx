import "@emotion/react";
import "@emotion/styled";
import "buffer/";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./components/App/App";
import { web3AuthInstance } from "./features/authentication/types";
import { setWeb3StorageClient } from "./services/web3storage";

setWeb3StorageClient().then(() => {
  web3AuthInstance.initModal().then(() => {
    const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
    );
  });
});
