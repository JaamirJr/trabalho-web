import { Input, Form, Col, Row, DatePicker, Button, Layout, Breadcrumb, Table } from 'antd';
import { ptBR } from 'antd/lib/locale/pt_BR';
import './Alunos.css'
import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
const { Content } = Layout;

export default function Alunos() {

    const [listaAlunos, setListaAlunos] = useState(null)
    useEffect(() => {
        const getAlunos = () => {
            axios.get("http://localhost:3001/alunos")
                .then(data => {
                    setListaAlunos(data.data.dados)
                    console.log(listaAlunos)
                });
        }
        if(listaAlunos === null) getAlunos()
    })


    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key:'_id'
        },
        {
            title: 'Nome do Aluno',
            dataIndex: 'nome_aluno',
            key: 'nome_aluno'
        },
        {
            title: 'Data de matricula',
            dataIndex: 'data_matricula',
            key: 'data_matricula'
        }
    ]

    const handleFinish = (values) => {
        axios.post("http://localhost:3001/alunos", values).then(data => {
            console.log(data)
        })
    }

    return (
        <Layout className="site-layout-alunos">
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Alunos</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200 }}>
                    <Form
                        name='formulario'
                        layout='vertical'
                        onFinish={handleFinish}

                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name={['nome_aluno']}
                                    label="Nome Completo"
                                >
                                    <Input placeholder="Ex. João da Silva Santos" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['data_matricula']}
                                    label="Data de Matrícula"
                                >
                                    <DatePicker picker="date" placeholder="Ex. 01/01/2015" locale={ptBR} format="DD/MM/YYYY" />
                                </Form.Item >
                            </Col>
                        </Row>
                        <Row justify="space-between">
                            <Button type="primary" htmlType="submit">
                                Salvar
              </Button>
                        </Row>
                    </Form>
                </div>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200, marginTop: 12 }}>
                    <Table dataSource={listaAlunos} columns={columns} />
                </div>
            </Content>
        </Layout>
    )
}