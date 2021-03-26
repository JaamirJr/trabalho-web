import React, { Component } from 'react'
import {} from 'antd'

export default class TabelaAlunos extends Component{
    dataSource = this.props.dataSource
    rowSelection = this.props.rowSelection
    data

    render() {
        return (
            <div>
                <Table
                    bordered={true}
                    rowKey="_id"
                    rowSelection={{
                        type: "checkbox",
                        hideSelectAll: false,
                        ...rowSelection
                    }}
                    columns={columnsAlunos}
                    dataSource={alunos}
                />
            </div>
        )
    }
}