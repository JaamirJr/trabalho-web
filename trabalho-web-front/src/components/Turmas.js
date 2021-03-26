import './Turmas.css'
import React, { useEffect, useState } from 'react';
import { List, Input, Form, Col, Row, DatePicker, Button, Layout, Breadcrumb, Table, message, Space, Popconfirm, Collapse } from 'antd';
import { ptBR } from 'antd/lib/locale/pt_BR';
import './Alunos.css'
import axios from 'axios';
import { format } from 'date-fns'
import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';

export default function Turmas() {

    let selectedAlunos
    let alunosTurma = null
    const { Panel } = Collapse;
    const { Content } = Layout;
    const { Search } = Input;
    const [isEdit, setIsEdit] = useState(false)
    const [inEdit, setInEdit] = useState(null)
    const [form] = Form.useForm()
    const [alunosMatriculados, setAlunosMatriculados] = useState(null)
    const [listaAlunos, setListaAlunos] = useState(null)
    const [listaTurmas, setListaTurmas] = useState(null)
    const [checked, setChecked] = useState(false)

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



    const TabelaAlunos = () => {
        return (
            <div>
                <Table
                    bordered={true}
                    rowKey="_id"
                    columns={columnsAlunos}
                    dataSource={listaAlunos}
                />
            </div>
        );
    };

    const columnsAlunos = [
        {
            title: 'Matriculado',
            dataIndex: '_id',
            key: '_id',
            onCell: (record, rowIndex) => {
                console.log(record, rowIndex)
            },
            render: (text) => {
                if (isEdit) {
                    for (let i = 0; i < alunosMatriculados.length; i++) {
                        if (text === alunosMatriculados[i]._id) {
                            console.log(`indice ${i} dados`, alunosMatriculados[i])
                            setChecked(true)
                        }
                    }
                    console.log("texto\n", text)
                    return (
                        <Checkbox checked={checked}
                            onChange={e => {
                                console.log(e)
                            }}
                        />
                    )
                } else {
                    return (
                        <Checkbox checked={checked} />
                    )
                }
            }
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
            render: (record) => collapseAlunos(record),
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
        setAlunosMatriculados(values.alunos)
        console.log(alunosMatriculados)
        setInEdit(values)
        setIsEdit(true)
        console.log(values)
        var data = values.data_inicio.split("/").reverse().join("-")
        form.setFieldsValue({ nome_turma: values.nome_turma, data_inicio: moment(data), curso: values.curso })
    }

    const formatDate = (turmas) => turmas.map(turma => ({ ...turma, data_inicio: format(new Date(turma.data_inicio), "dd/MM/yyyy") }))

    const handleFinish = (values) => {
        console.log(selectedAlunos)
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
        setChecked(false)
    }

    const collapseAlunos = (record) => {
        const text = record ? record.map(aluno => `${aluno.nome_aluno}; `) : ''
        return (
            <Collapse>
                <Panel header="Alunos">
                    {text}
                </Panel>
            </Collapse>
        )
    }

    const onSearch = value => {
        console.log(value)
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
                                    label="Turma"
                                    rules={[{ required: true, message: 'Por favor digite a turma' }]}
                                >
                                    <Input placeholder="Ex. Desenvolvimento Web" />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    name={['data_inicio']}
                                    label="Data de Início"
                                    rules={[{ required: true, message: 'Por favor digite a data de início' }]}
                                >
                                    <DatePicker picker="date" placeholder="Ex. 01/01/2015" locale={ptBR} format="DD/MM/YYYY" />
                                </Form.Item >
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name={['curso']}
                                    label="Curso"
                                    rules={[{ required: true, message: 'Por favor digite o curso' }]}
                                >
                                    <Input placeholder="Engenharia da Computação" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    nome={['alunos']}
                                    label="Alunos"
                                >
                                    <Search
                                        placeholder="Pesquise o Aluno"
                                        enterButton
                                        allowClear
                                        onSearch={onSearch}
                                    />
                                    {alunosTurma ? <List /> : <List/>}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Space style={{ marginBottom: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    {isEdit ? `Editar` : `Salvar`}
                                </Button>
                                <Button type="default" htmlType="reset" onClick={() => { setChecked(false); setIsEdit(false); setInEdit(null) }}>
                                    Cancelar
                                </Button>
                            </Space>

                        </Row>
                    </Form>
                </div>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200, marginTop: 12 }}>
                    <Table bordered={true} dataSource={listaTurmas} columns={columns} rowKey="_id" />

                </div>
            </Content>
        </Layout>
    )
}