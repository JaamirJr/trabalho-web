import { Input, Form, Col, Row, DatePicker, Button, Layout, Breadcrumb, Table, Space, Popconfirm, message } from 'antd';
import { ptBR } from 'antd/lib/locale/pt_BR';
import './Alunos.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns'
import moment from 'moment'

export default function Alunos() {

    const [isEdit, setIsEdit] = useState(false)
    const [inEdit, setInEdit] = useState(null)
    const [form] = Form.useForm()
    const { Content } = Layout;
    const [listaAlunos, setListaAlunos] = useState(null)
    const [listaTurmas, setListaTurmas] = useState(null)

    useEffect(() => {
        const getAlunos = () => {
            axios.get("http://ec2-18-230-56-254.sa-east-1.compute.amazonaws.com:3001/alunos")
                .then(info => {
                    for (let index = 0; index < info.data.dados.length; index++) {
                        const data = new Date(info.data.dados[index].data_matricula);
                        info.data.dados[index].data_matricula = format(data, "dd/MM/yyyy")
                    }
                    ordenarAlunos(info.data.dados)
                    setListaAlunos(info.data.dados)
                });
        }
        const getTurmas = () => {
            axios.get("http://ec2-18-230-56-254.sa-east-1.compute.amazonaws.com:3001/turmas")
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

        const ordenarAlunos = (alunos) => {
            if (alunos) {
                let alunosOrdenados = alunos
                alunosOrdenados.sort((a, b) => {
                    return (a.nome_aluno > b.nome_aluno) ? 1 : ((b.nome_aluno > a.nome_aluno) ? -1 : 0)
                })
                return alunosOrdenados;
            }
        }
    })

    const formatDate = (alunos) => alunos.map(aluno => ({ ...aluno, data_matricula: format(new Date(aluno.data_matricula), "dd/MM/yyyy") }))

    const ordenarAlunos = (alunos) => {
        if (alunos) {
            let alunosOrdenados = alunos
            alunosOrdenados.sort((a, b) => {
                return (a.nome_aluno > b.nome_aluno) ? 1 : ((b.nome_aluno > a.nome_aluno) ? -1 : 0)
            })
            return alunosOrdenados;
        }
    }

    const columns = [
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
        {
            title: 'Ações',
            key: 'operation',
            render: (params) => {
                return (<Space>
                    <Button type="primary" onClick={() => handleEdit(params)} >
                        Editar
                    </Button>
                    <Popconfirm
                        title={`Deseja excluir esse aluno?`}
                        onConfirm={() => {
                            handleDelete(params)
                            message.loading(`Desmatriculando ${params.nome_aluno} das turmas`, 2.5).then(() => message.success(`${params.nome_aluno} excluído`))
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

    const handleEdit = (values) => {
        setInEdit(values)
        setIsEdit(true)
        var data = values.data_matricula.split("/").reverse().join("-")
        form.setFieldsValue({ nome_aluno: values.nome_aluno, data_matricula: moment(data) })
    }

    const handleDelete = (values) => {
        axios.delete(`http://ec2-18-230-56-254.sa-east-1.compute.amazonaws.com0-56-254.sa-east-1.compute.amazonaws.com:3001/alunos/${values._id}`)
            .then(data => {
                console.log(data)
                var { alunos } = data.data
                console.log(alunos)
                alunos = formatDate(alunos)
                setListaAlunos(alunos)
                let turmas = listaTurmas
                console.log(turmas.length)
                turmas.map(turma => {
                    turma.alunos.map(aluno => {
                        let index = turma.alunos.indexOf(aluno)
                        console.log(`ID do aluno: ${aluno._id} ID do values: ${values._id}`)
                        aluno._id === values._id ? turma.alunos.splice(index, 1) : console.log("Aluno não esta na turma: ", turma.nome_turma)
                        return 'null'
                    })
                    console.log(`Alunos da turma\n`, turma.alunos)
                    axios.patch(`http://ec2-18-230-56-254.sa-east-1.compute.amazonaws.com:3001/turmas/${turma._id}`, turma)
                    return 'null'
                })
            })
    }

    const handleFinish = (values) => {
        if (isEdit) {
            axios.patch(`http://ec2-18-230-56-254.sa-east-1.compute.amazonaws.com:3001/alunos/${inEdit._id}`, values).then(data => {
                console.log(data)
                var { alunos } = data.data
                console.log(alunos)
                alunos = formatDate(alunos)
                ordenarAlunos(alunos)
                setListaAlunos(alunos)
                setInEdit(null)
            })
        } else {
            axios.post("http://ec2-18-230-56-254.sa-east-1.compute.amazonaws.com:3001/alunos", values).then(data => {
                console.log(data)
                var { alunos } = data.data
                console.log(alunos)
                alunos = formatDate(alunos)
                ordenarAlunos(alunos)
                setListaAlunos(alunos)
            })
        }
        form.resetFields()
        setIsEdit(false)
    }

    return (
        <Layout className="site-layout-alunos">
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Alunos</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200 }}>
                    <Form
                        form={form}
                        name='formulario'
                        layout='vertical'
                        onFinish={handleFinish}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name={['nome_aluno']}
                                    label="Nome Completo"
                                    rules={[{ required: true, message: 'Por favor digite o nome do aluno' }]}
                                >
                                    <Input placeholder="Ex. João da Silva Santos" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name={['data_matricula']}
                                    label="Data de Matrícula"
                                    rules={[{ required: true, message: 'Por favor escolha a data de matrícula' }]}
                                >
                                    <DatePicker picker="date" placeholder="Ex. 01/01/2015" locale={ptBR} format="DD/MM/YYYY" />
                                </Form.Item >
                            </Col>
                        </Row>
                        <Row >
                            <Space style={{ marginBottom: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    {isEdit ? `Editar` : `Salvar`}
                                </Button>
                                <Button htmlType="reset" onClick={() => { setIsEdit(false); setInEdit(null) }} >
                                    Cancelar
                            </Button>
                            </Space>
                        </Row>
                    </Form>
                </div>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 200, marginTop: 12 }}>
                    <Table bordered='true' dataSource={listaAlunos} columns={columns} rowKey="_id" />
                </div>
            </Content>
        </Layout>
    )
}