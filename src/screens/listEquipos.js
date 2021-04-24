import React, { useState, useEffect } from 'react'
import { db } from '../component/fire'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button } from 'react-bootstrap';

export default function Listadoequipos(props) {
    const [listado, setListado] = useState([])
    const getAvisos = async () => {
        db.collection("equipos").onSnapshot((querySnapshot) => {
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
        dataField: 'tipo',
        text: 'Tipo',
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
        dataField: 'nombre',
        text: 'Cliente',
        sort: true
    }, {
        text: 'Acciones',
        isDummyField: true,
        formatter: (cell, row, rowIndex) => {
            return <><Button
                variant="outline-primary"
                onClick={() => {
                    props.history.push({
                        pathname:'/EquiposModificar',
                        state:{equipo:row.id}
                });
                }}>
                Abrir
             </Button>
             <Button
                    style={{ marginLeft: 10 }}
                    variant="outline-danger"
                    onClick={() => {if (window.confirm('¿Seguro que desea eliminar el equipo?')) 
                    db.collection("equipos").doc(row.id).delete().then(() => {
                        alert('Equipo eliminado correctamente')
                    }).catch((error) => {
                        alert('Error al intentar eliminar el equipo')
                    }); } 
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
            keyField="id"
            data={listado}
            columns={columns}
            search
        >
            {
                props => (
                    <div>
                        <h1>Listado de equipos</h1>
                        <SearchBar {...props.searchProps} placeholder='Buscar'/>
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