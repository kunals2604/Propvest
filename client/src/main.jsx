import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>


    <Auth0Provider
      domain="dev-xqfcxon866kd1vod.us.auth0.com"
      clientId="vgMvyH0ab7HcF8V8TsHWXCwVFJpfZsSt"
      authorizationParams={{
        redirect_uri: "https://propvest.vercel.app",
      }}
      audience="http://localhost:8000"
      scope="openid profile email "

    >
    
      

        <App />
     
    </Auth0Provider>

  </React.StrictMode >
);
