import React, { useEffect, useState } from "react";
import { api } from "./api";
import {
    Button, Table, Modal, Form, Input, DatePicker, Space,
    message, Popconfirm, Typography, Layout, theme as antdTheme, Switch, ConfigProvider, Tooltip
} from "antd";
import moment from "moment";
const { Header, Content } = Layout;

type License = {
    id: number;
    deviceId: string;
    licensedTo: string;
    expiryUtc: string;
    token: string;
};

type Props = {
    onLogout: () => void;
    dark: boolean;
    setDark: (b: boolean) => void;
};

export default function LicenseAdmin({ onLogout, dark, setDark }: Props) {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [form] = Form.useForm();

    async function fetchLicenses() {
        setLoading(true);
        try {
            const res = await api.get("/license");
            setLicenses(res.data);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => { fetchLicenses(); }, []);

    async function handleCreate(values: any) {
        try {
            values.expiryUtc = values.expiryUtc.toISOString();
            await api.post("/license", values);
            message.success("Tạo license thành công!");
            setModal(false);
            fetchLicenses();
        } catch (e: any) {
            message.error(e?.response?.data || "Tạo license thất bại!");
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/license/${id}`);
            message.success("Xóa license thành công!");
            fetchLicenses();
        } catch {
            message.error("Xóa license thất bại!");
        }
    }

    const columns = [
        { title: "ID", dataIndex: "id", width: 60 },
        { title: "DeviceId", dataIndex: "deviceId", width: 260, ellipsis: true },
        { title: "Khách hàng", dataIndex: "licensedTo" },
        { title: "Hết hạn", dataIndex: "expiryUtc", render: (d: string) => moment(d).format("YYYY-MM-DD HH:mm") },
        {
            title: "Token", dataIndex: "token", render: (token: string) =>
                <Input.TextArea readOnly value={token} style={{ width: 220 }} autoSize={{ minRows: 1, maxRows: 2 }} />
        },
        {
            title: "Copy", dataIndex: "copy", render: (_: any, rec: License) =>
                <Tooltip title="Copy token">
                    <Button size="small" onClick={() => { navigator.clipboard.writeText(rec.token); message.success("Đã copy!"); }}>Copy</Button>
                </Tooltip>
        },
        {
            title: "Xóa", dataIndex: "xoa", render: (_: any, rec: License) =>
                <Popconfirm title="Xóa license?" onConfirm={() => handleDelete(rec.id)}>
                    <Button size="small" danger>Xóa</Button>
                </Popconfirm>
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                background: dark ? "#111" : "#f8f8f8",
                display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
                <Typography.Title level={4} style={{ color: dark ? "#fff" : "#444", margin: 0 }}>
                    QUẢN LÝ LICENSE
                </Typography.Title>
                <Space>
                    <Switch checked={dark} onChange={setDark} checkedChildren="🌙" unCheckedChildren="☀️" />
                    <Button onClick={onLogout}>Đăng xuất</Button>
                </Space>
            </Header>
            <Content style={{ padding: 32, background: dark ? "#181818" : "#fff" }}>
                <Space style={{ marginBottom: 18 }}>
                    <Button type="primary" onClick={() => setModal(true)}>Tạo mới License</Button>
                    <Button onClick={fetchLicenses}>Refresh</Button>
                </Space>
                <Table
                    dataSource={licenses}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    bordered
                    scroll={{ x: 950 }}
                    pagination={{ pageSize: 8 }}
                    size="middle"
                    style={{ background: dark ? "#20232a" : "#fff", borderRadius: 6 }}
                />
                <Modal open={modal} onCancel={() => setModal(false)} onOk={() => form.submit()}
                    title="Tạo License mới" okText="Tạo" cancelText="Đóng">
                    <Form layout="vertical" form={form} onFinish={handleCreate}>
                        <Form.Item label="DeviceId" name="deviceId" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Tên khách hàng" name="licensedTo" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Ngày hết hạn" name="expiryUtc" rules={[{ required: true }]}>
                            <DatePicker showTime style={{ width: "100%" }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
}
