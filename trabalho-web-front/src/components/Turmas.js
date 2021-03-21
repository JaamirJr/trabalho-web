import './Turmas.css'
import React, { useState } from 'react';
import { Input, Form, Col, Row, DatePicker, Button, Layout, Breadcrumb, Table, Radio, Divider } from 'antd';
import { ptBR } from 'antd/lib/locale/pt_BR';
import './Alunos.css'
import axios from 'axios';
import moment from 'moment';

const { Content } = Layout;
export default function Turmas() {

    let listaAlunos
    var auxiliar 
    var listring
    axios.get("http://localhost:3001/alunos")
        .then(data => {
            auxiliar = data.data.dados
            listaAlunos = JSON.stringify(data.data.dados)
            console.log("Alunos\n" + listaAlunos)
            console.log("Lista Alunos "+typeof(listaAlunos))
            console.log("auxiliar "+typeof(auxiliar))
            listring = String(listaAlunos)
            console.log("listring " + typeof(listring) + "\nConteudo\n" + listring)
        });

    const columnsAlunos = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ];

    console.log("Coluna Alunos "+typeof(columnsAlunos))
    console.log("Lista Alunos "+typeof(listaAlunos))


    
    

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Disab324led User',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '5',
            name: 'Disa34bled User',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '6',
            name: 'Disabled32 User',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '7',
            name: 'Disabled User',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
        },
    ];

    let listaTurmas
    axios.get("http://localhost:3001/turmas")
        .then(data => {
            listaTurmas = data.data.dados
            console.log("Turmas\n" + listaTurmas)
        });

    const columns = [
        {
            title: 'Turma',
            dataIndex: 'nome_turma',
            key: 'nome_turma'
        },
        {
            title: 'Curso',
            dataIndex: 'curso',
            key: 'curso'
        },
        {
            title: 'Data de inicio',
            dataIndex: 'data_inicio',
            key: 'data_inicio'
        },
        {
            title: 'Alunos',
            dataIndex: 'alunos',
            key: 'alunos'
        }
    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const Demo = () => {
        const [selectionType, setSelectionType] = useState('checkbox');
        return (
            <div>
                <Radio.Group
                    onChange={({ target: { value } }) => {
                        setSelectionType(value);
                    }}
                    value={selectionType}
                >
                    <Radio value="checkbox">Checkbox</Radio>
                    <Radio value="radio">radio</Radio>
                </Radio.Group>

                <Divider />

                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columnsAlunos}
                    dataSource={data}
                />
            </div>
        );
    };


    const handleFinish = (values) => {
        axios.post("http://localhost:3001/turmas", values).then(data => {
            console.log(data)
        })
    }

    return (
        <Layout className="site-layout-turmas">
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Turmas</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200 }}>
                    <Form
                        name='formulario'
                        layout='vertical'
                        onFinish={handleFinish}

                    >
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name={['nome_turma']}
                                    label="Nome da Turma"
                                >
                                    <Input placeholder="Ex. Desenvolvimento Web" />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    name={['data_inicio']}
                                    label="Data de Início"
                                >
                                    <DatePicker picker="date" placeholder="Ex. 01/01/2015" locale={ptBR} format="DD/MM/YYYY" />
                                </Form.Item >
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name={['curso']}
                                    label="Curso"
                                >
                                    <Input placeholder="Engenharia da Computação" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    nome={['alunos']}
                                    label="Alunos"
                                >
                                    <Demo />
                                </Form.Item>
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
                    <Table dataSource={listaTurmas} columns={columns} />
                </div>
            </Content>
        </Layout>
    )
}