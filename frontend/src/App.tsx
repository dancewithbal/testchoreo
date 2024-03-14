import { useEffect, useId, useState } from "react";
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
import Results from './routes/results/results.component';
import { buildUserState } from "./utils/json.utils";
import { UserState } from "./dao/state/state.dao";

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const loggedInTokens = window.sessionStorage.getItem(cts.TOKENS_LOCAL_KEY);
    const user = buildUserState(loggedInTokens);
    if (user) {
      dispatch(loggedIn(user as UserState)); 
    }
  }, []);

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
