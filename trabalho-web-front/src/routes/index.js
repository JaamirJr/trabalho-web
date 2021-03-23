import React from 'react';
import Alunos from '../components/Alunos'
import Turmas from '../components/Turmas'
import { Route, Switch } from 'react-router-dom'

export default function Routes() {

    return (
            <Switch >
                <Route exact path="/" component={Alunos} />
                <Route path="/turmas" component={Turmas} />
            </Switch>     
    )
}