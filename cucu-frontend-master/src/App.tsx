import React, {useEffect} from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { store } from "./redux/store/store";
import './i18n';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import RecoverPasswordPage from "./pages/RecoverPassword";
import SignupPage from "./pages/Signup";
import HomePage from "./pages/HomePage";
import TranslatorsPage from "./pages/Translators";
import "rc-slider/assets/index.css";
import ProfileTranslatorPage from "./pages/ProfileTranslator";
import ProfileTraductorPage from "./pages/ProfileTraductor";
import RequestTranslatorPage from "./pages/RequestTranslator";
import AvailabilitiesPage from "./pages/Availabilities";
import PaymentPage from "./pages/Payment";

import "./App.scss"

//import ClientServices from "./pages/ClientServices";
import TranslatorServices from "./pages/TranslatorServices";
import Transactions from "./pages/Transactions";

import ProfilePage from "./pages/ProfilePage";
import { PublicRoute } from "./components/PublicRoute";
import { PrivateRoute } from "./components/PrivateRoute";

import { connectSocket } from "./utils/constants"

export default function App() {

  useEffect(() => {
    if(localStorage.getItem("token")){
      connectSocket()
    }    
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <PublicRoute exact path="/" component={LoginPage} />
        <PublicRoute exact path="/en" component={LoginPage} />
        <PublicRoute exact path="/es" component={LoginPage} />
        <PublicRoute path="/signup" component={SignupPage} />
        <PrivateRoute path="/home" component={HomePage} />
        <PrivateRoute path="/translators" component={TranslatorsPage} />
        <PublicRoute path="/forgot-password" component={ForgotPasswordPage} />
        <PublicRoute
          path="/change-password/:token"
          component={RecoverPasswordPage}
        />
        <PrivateRoute
          path="/profile-translator/:id"
          component={ProfileTranslatorPage}
        />
        <PrivateRoute
          path="/request-translator/:id"
          component={RequestTranslatorPage}
        />
        <PrivateRoute
          path="/profile-client"
          component={
            ProfilePage
          }
        />
        <PrivateRoute
          path="/profile-translator-edit"
          component={
            ProfileTraductorPage
          }
        />
        <PrivateRoute
          path="/services/:id?"
          component={ TranslatorServices }
        />
        <PrivateRoute
          path="/transactions"
          component={
              Transactions
          }
        />
        <PrivateRoute
          path="/availabilities"
          component={AvailabilitiesPage}
        />

        <PrivateRoute
          path="/payment/:id"
          component={PaymentPage}
        />
      </Router>
    </Provider>
  );
}
