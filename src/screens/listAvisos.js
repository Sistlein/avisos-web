import React, { useState, useEffect } from 'react'
import { db } from '../component/fire'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button } from 'react-bootstrap';

export default function ListadoAvisos(props) {
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
        text: 'Marca',
        sort: true
    }, {
        dataField: 'modelo',
        text: 'Modelo',
        sort: true
    }, {
        dataField: 'sn',
        text: 'Serial',
        sort: true
    }, {
        dataField: 'entrada',
        text: 'Fecha de Entrada',
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
                    props.history.push({
                        pathname: '/AvisosModificar',
                        state: { aviso: row.numero }
                    });
                }}>
                Abrir
         </Button>
                <Button
                    style={{ marginLeft: 10 }}
                    variant="outline-danger"
                    onClick={() => {
                        if (window.confirm('¿Seguro que desea eliminar el aviso?'))
                            db.collection("avisos").doc(row.numero).delete().then(() => {
                                console.log("Document successfully deleted!");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            });
                    }
                    }>
                    Eliminar
          </Button></>
        }
    }];

    const defaultSorted = [{
        dataField: 'numero',
        order: 'desc'
    }];

    return (
        <ToolkitProvider
            keyField="numero"
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