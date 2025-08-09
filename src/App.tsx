import React, { useState } from "react";
import LoginPage from "./LoginPage";
import LicenseAdmin from "./LicenseAdmin";
import { setAuth } from "./api";
import { ConfigProvider, theme as antdTheme } from "antd";

function App() {
  const [token, setToken] = React.useState<string | null>(localStorage.getItem("jwt"));
  const [dark, setDark] = React.useState(false);

  const onLogin = (tk: string) => {
    setToken(tk);
    setAuth(tk); // chỉ lưu vào localStorage (interceptor sẽ tự đọc)
  };

  const handleLogout = () => {
    setToken(null);
    setAuth(null);
  };

  return (
    <ConfigProvider theme={{ algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}>
      {!token ? (
        <LoginPage onLogin={onLogin} />
      ) : (
        <LicenseAdmin onLogout={handleLogout} dark={dark} setDark={setDark} />
      )}
    </ConfigProvider>
  );
}
export default App;
