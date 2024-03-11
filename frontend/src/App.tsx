import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Profile from "./routes/profile/profile.component";
import Callback from "./routes/callback/callback.component";
import About from "./routes/about/about.component";
import { useAppDispatch } from './store/hooks';
import { loggedIn } from './store/features/user/user.slice';
import * as cts from "./const";
import NotFound from "./routes/NotFound/NotFound";
import { Tokens } from "./dao/login/login.dao";
import Results from './routes/results/results.component';
import { getEmail } from "./utils/json.utils";

const App = () => {
  const loggedInTokens = window.sessionStorage.getItem(cts.TOKENS_LOCAL_KEY);

  const dispatch = useAppDispatch();
  if (loggedInTokens) {
    const tokens: Tokens = JSON.parse(loggedInTokens);
    dispatch(loggedIn(getEmail(tokens.idToken))); //TODO handle empty return from getEmail
  }

  // setLoggedIn(window.sessionStorage.getItem(TOKENS_LOCAL_KEY) !== null);
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/results" element={<Results />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
