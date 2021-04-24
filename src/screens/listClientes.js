import React, { useState, useEffect } from 'react'
import { db } from '../component/fire'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button } from 'react-bootstrap';

export default function ListadoAvisos() {
    const [listado, setListado] = useState([])
    const getAvisos = async () => {
        db.collection("avisos").onSnapshot((querySnapshot) => {
            const avisos = []
            querySnapshot.forEach((aviso) => {
                avisos.push(aviso.data())
            })
            setListado(avisos)
        })
    }
    useEffect(() => {
        getAvisos();
    }, [])
    const { SearchBar } = Search;

    const columns = [{
        dataField: 'numero',
        text: 'Averia',
        sort: true
    }, {
        dataField: 'nombre',
        text: 'Cliente',
        sort: true
    }, {
        dataField: 'marca',
        text: 'Equipo',
        sort: true
    }, {
        dataField: 'salida',
        text: 'Fecha de Solución',
        sort: true
    }, {
        text: 'Acciones',
        isDummyField: true,
        formatter: (cell, row, rowIndex) => {
            return <><Button
                variant="outline-primary"
                onClick={() => {
                    console.log('Product of Category ' + row.numero + ' deleted');
                }}>
                Modificar
             </Button>
                <Button
                    style={{ marginLeft: 10 }}
                    variant="outline-danger"
                    onClick={() => {
                        console.log('Product of Category ' + row.numero + ' deleted');
                    }}>
                    Eliminar
          </Button>
                <Button
                    style={{ marginLeft: 10 }}
                    variant="outline-success"
                    onClick={() => {
                        console.log('Product of Category ' + row.numero + ' deleted');
                    }}>
                    Visualizar
          </Button></>
        }
    }];

    const defaultSorted = [{
        dataField: 'numero',
        order: 'desc'
    }];

    return (
        <ToolkitProvider
            keyField="id"
            data={listado}
            columns={columns}
            search
        >
            {
                props => (
                    <div>
                        <h1>Listado de incidencias</h1>
                        <SearchBar {...props.searchProps} />
                        <BootstrapTable
                            bootstrap4
                            keyField="id"
                            data={listado}
                            columns={columns}
                            defaultSorted={defaultSorted}
                            pagination={paginationFactory()}
                            {...props.baseProps}
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    )
}