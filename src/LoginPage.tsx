import React, { useState } from "react";
import { Button, Form, Input, message, Card, Typography } from "antd";
import { api, setAuth } from "./api";
const { Title } = Typography;

type Props = { onLogin: (token: string) => void };
export default function LoginPage({ onLogin }: Props) {
    const [loading, setLoading] = useState(false);
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await api.post("/Auth/login", values);
            const token = res.data.token;
            setAuth(token);
            onLogin(token);
            message.success("Đăng nhập thành công!");
        } catch (e: any) {
            message.error(e?.response?.data || "Đăng nhập thất bại!");
        }
        setLoading(false);
    };
    return (
        <div style={{
            display: 'flex', height: '100vh',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(120deg,#333,#444 80%)'
        }}>
            <Card
                style={{ width: 370, boxShadow: "0 8px 28px #2225" }}
                bodyStyle={{ padding: 24 }}
            >
                <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="username" label="Tài khoản" rules={[{ required: true }]}>
                        <Input autoFocus />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>Đăng nhập</Button>
                </Form>
            </Card>
        </div>
    );
}
