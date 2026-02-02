"use client";
import { store } from "@/store/store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const ReduxWrapper = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </>
  );
};

export default ReduxWrapper;
