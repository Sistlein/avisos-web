import React, { useState, useEffect } from 'react'
import { db } from '../component/fire'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Button } from 'react-bootstrap';

export default function ListadoAvisos(props) {
    const [listado, setListado] = useState([])
    const getAvisos = async () => {
        let cliente
        if (props.tipo==='cliente'){cliente=true}else{cliente=false}
        db.collection("clientes").where("cliente","==",cliente).onSnapshot((querySnapshot) => {
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
        dataField: 'cif',
        text: 'Cif',
        sort: true
    }, {
        dataField: 'nombre',
        text: 'Nombre',
        sort: true
    }, {
        dataField: 'direccion',
        text: 'Direccion',
        sort: true
    }, {
        dataField: 'localidad',
        text: 'Localidad',
        sort: true
    }, {
        dataField: 'provincia',
        text: 'Provincia',
        sort: true
    }, {
        dataField: 'telefono',
        text: 'Telefono',
        sort: true
    }, {
        dataField: 'email',
        text: 'E-mail',
        sort: true
    }, {
        text: 'Acciones',
        isDummyField: true,
        formatter: (cell, row, rowIndex) => {
            return <><Button
            variant="outline-primary"
            onClick={() => {
                props.history.push({
                    pathname:'/ClientesModificar',
                    state:{cliente:row.email}
            });
            }}>
            Abrir
         </Button>
                <Button
                    style={{ marginLeft: 10 }}
                    variant="outline-danger"
                    onClick={() => {if (window.confirm('¿Seguro que desea eliminar el usuario?')) 
                    db.collection("clientes").doc(row.email).delete().then(() => {
                        alert('Usuario eliminado correctamente')
                    }).catch((error) => {
                        alert('Error al intentar eliminar el usuario')
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
                        <h1>Listado de Usuarios</h1>
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