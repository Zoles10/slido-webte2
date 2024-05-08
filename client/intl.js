import { createIntl, createIntlCache } from "react-intl";

const cache = createIntlCache();

const messagesInSlovak = {
  login: "Prihlásenie",
  password: "Heslo",
  loginButton: "Prihlásiť sa",
  forgotPassword: "Zabudnuté heslo",
  dontHaveAnAccount: "Nemáte účet?",
  signUp: "Zaregistrovať sa",
  welcome: "Vitajte",
  youAreOnTheHomepage: "Ste na domovskej obrazovke",
};

const messagesInEnglish = {
  login: "Login",
  password: "Password",
  loginButton: "Login",
  forgotPassword: "Forgot password?",
  dontHaveAnAccount: "Don't have an account?",
  signUp: "Sign up",
  welcome: "Welcome",
  youAreOnTheHomepage: "You are on the homepage",
};

function getMessages(locale) {
  return locale === "sk" ? messagesInSlovak : messagesInEnglish;
}

function getIntl(locale) {
  const messages = locale === "sk" ? messagesInSlovak : messagesInEnglish;

  const intl = createIntl(
    {
      locale,
      messages,
    },
    cache
  );

  return intl;
}

export default getIntl;
