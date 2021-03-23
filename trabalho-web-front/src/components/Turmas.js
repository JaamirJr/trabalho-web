import './Turmas.css'
import React, { useEffect, useState } from 'react';
import { Input, Form, Col, Row, DatePicker, Button, Layout, Breadcrumb, Table, message, Space, Popconfirm, Collapse } from 'antd';
import { ptBR } from 'antd/lib/locale/pt_BR';
import './Alunos.css'
import axios from 'axios';
import { format } from 'date-fns'
import moment from 'moment';

export default function Turmas() {

    let selectedAlunos
    let alunosTurma
    const { Panel } = Collapse;
    const { Content } = Layout;
    const [isEdit, setIsEdit] = useState(false)
    const [inEdit, setInEdit] = useState(null)
    const [form] = Form.useForm()
    const [alunosMatriculados, setAlunosMatriculados] = useState(null)
    const [listaAlunos, setListaAlunos] = useState(null)
    const [listaTurmas, setListaTurmas] = useState(null)

    useEffect(() => {
        const getAlunos = () => {
            axios.get("http://localhost:3001/alunos")
                .then(info => {
                    for (let index = 0; index < info.data.dados.length; index++) {
                        const data = new Date(info.data.dados[index].data_matricula);
                        info.data.dados[index].data_matricula = format(data, "dd/MM/yyyy")
                    }
                    setListaAlunos(info.data.dados)
                });
        }
        const getTurmas = () => {
            axios.get("http://localhost:3001/turmas")
                .then(info => {
                    for (let index = 0; index < info.data.dados.length; index++) {
                        const data = new Date(info.data.dados[index].data_inicio);
                        info.data.dados[index].data_inicio = format(data, "dd/MM/yyyy")
                    }
                    setListaTurmas(info.data.dados)
                });
        }
        if (listaAlunos === null) getAlunos()
        if (listaTurmas === null) getTurmas()
    })


    const rowSelection = {
        // selections: {alunosTurma},
        onChange: (selectedRowKeys, selectedRows) => {
            selectedAlunos = selectedRows
        }
    }

    const TabelaAlunos = () => {

        return (
            <div>
                <Table
                    rowKey="_id"
                    rowSelection={rowSelection}
                    columns={columnsAlunos}
                    dataSource={listaAlunos}
                />
            </div>
        );
    };

    const columnsAlunos = [
        {
            title: 'Nome do Aluno',
            dataIndex: 'nome_aluno',
            key: 'nome_aluno'
        },
        {
            title: 'Data de matricula',
            dataIndex: 'data_matricula',
            key: 'data_matricula'
        },
    ];

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
            render: () => collapseAlunos(),
            width: 800
        },
        {
            title: 'Ações',
            key: 'operation',
            render: (params) => {
                // console.log(params)
                return (<Space>
                    <Button type="primary" onClick={() => handleEdit(params)} >
                        Editar
                    </Button>
                    <Popconfirm
                        title="Deseja excluir essa turma?"
                        onConfirm={() => {
                            handleDelete(params)
                            message.success("Turma excluída")
                        }}
                        onCancel={() => { }}
                        okText="Sim"
                        cancelText="Não">
                        <Button type="default">
                            Excluir
                        </Button>
                    </Popconfirm>
                </Space>)
            }
        }
    ]

    const handleDelete = (values) => {
        axios.delete(`http://localhost:3001/turmas/${values._id}`)
            .then(data => {
                console.log(data)
                var { turmas } = data.data
                console.log(turmas)
                turmas = formatDate(turmas)
                setListaTurmas(turmas)
            }
            )
    }

    const handleEdit = (values) => {
        setInEdit(values)
        setIsEdit(true)
        console.log(values)
        alunosTurma = values.alunos
        var data = values.data_inicio.split("/").reverse().join("-")
        form.setFieldsValue({ nome_turma: values.nome_turma, data_inicio: moment(data), curso: values.curso })
    }

    const formatDate = (turmas) => turmas.map(turma => ({ ...turma, data_inicio: format(new Date(turma.data_inicio), "dd/MM/yyyy") }))

    const handleFinish = (values) => {
        const newValues = {
            ...values, alunos: selectedAlunos.map(aluno => {
                var data = aluno.data_matricula.split("/").reverse().join("-")
                return ({ ...aluno, data_matricula: data })
            })
        }
        if (isEdit) {
            axios.patch(`http://localhost:3001/turmas/${inEdit._id}`, newValues)
                .then(data => {
                    console.log(data)
                    var { turmas } = data.data
                    turmas = formatDate(turmas)
                    setListaTurmas(turmas)
                    setInEdit(null)
                })
        } else {
            console.log(newValues)
            axios.post("http://localhost:3001/turmas", newValues).then(data => {
                console.log(data)
                var { turmas } = data.data
                turmas = formatDate(turmas)
                setListaTurmas(turmas)
            })
        }
        form.resetFields()
        setIsEdit(false)
    }

    const collapseAlunos = () => {
        const text = listaAlunos.map(aluno => `${aluno.nome_aluno}; `)
        return (
            <Collapse>
                <Panel header="Alunos">
                    {text}
                </Panel>
            </Collapse>
        )
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
                        form={form}
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
                                    <TabelaAlunos />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Space style={{ marginBottom: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    {isEdit ? `Editar` : `Salvar`}
                                </Button>
                                <Button type="default" htmlType="reset">
                                    Cancelar
                                </Button>
                            </Space>

                        </Row>
                    </Form>
                </div>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200, marginTop: 12 }}>
                    <Table dataSource={listaTurmas} columns={columns} rowKey="_id" />

                </div>
            </Content>
        </Layout>
    )
}