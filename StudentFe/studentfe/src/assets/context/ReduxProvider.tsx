"use client";

import { reduxStore } from "@/assets/redux-toolkit";
import { Provider } from "react-redux";

const ReduxProvider = (props: React.PropsWithChildren) => {
  return <Provider store={reduxStore}>{props.children}</Provider>;
};

export default ReduxProvider;
