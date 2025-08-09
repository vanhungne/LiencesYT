import React, { useState } from "react";
import LoginPage from "./LoginPage";
import LicenseAdmin from "./LicenseAdmin";
import { setAuth } from "./api";
import { ConfigProvider, theme as antdTheme } from "antd";

function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem("jwt") || null);
    const [dark, setDark] = useState(false);

    const onLogin = (tk: string) => {
        setToken(tk);
        setAuth(tk);
        localStorage.setItem("jwt", tk);
    };

    const handleLogout = () => {
        setToken(null);
        setAuth(null);
        localStorage.removeItem("jwt");
    };

    return (
        <ConfigProvider theme={{
            algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        }}>
            {!token ?
                <LoginPage onLogin={onLogin} />
                :
                <LicenseAdmin onLogout={handleLogout} dark={dark} setDark={setDark} />
            }
        </ConfigProvider>
    );
}

export default App;
