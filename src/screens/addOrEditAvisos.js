import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select'
import { db } from '../component/fire'
import 'bootswatch/dist/superhero/bootstrap.min.css';
import Modal from 'react-modal'
import AddEquipos from './addOrEditEquipos'
import AddClientes from './addOrEditClientes'


function Avisos() {
    const avisoInicial = {
        numero: '',
        cliente: '',
        equipo: '',
        averia: '',
        entrada: '',
        salida: '',
        descripcion: '',
    }
    const clientesOptions = []
    const equiposOptions = []
    const [aviso, setAviso] = useState(avisoInicial)
    const [modalEquipo, setModalEquipo] = useState(false)
    const [modalCliente, setModalCliente] = useState(false)

    const clearImput = () => {
        setAviso(avisoInicial)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setAviso({ ...aviso, [name]: value })
    }

    const addAviso = async () => {
        await db.collection("avisos").doc().set(aviso)
        clearImput()
    }
    const getClientes = () => {
        db.collection('clientes').onSnapshot((items) => {
            items.forEach(item => {
                clientesOptions.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().mail })
            })
        })
    }
    const getEquipos = (cliente) => {
        db.collection('equipos').where("cliente","==",cliente).onSnapshot((items) => {
            items.forEach(item => {
                equiposOptions.push({ value: item.id, label: item.data().tipo + ' - ' + item.data().marca + ' - ' + item.data().modelo + ' - ' + item.data().sn })

            })
        })
    }


    const handleClienteChange = (newValue) => {
        setAviso({ ...aviso, cliente: newValue.value })
      };

      const handleEquipoChange = (newValue) => {
        setAviso({ ...aviso, equipo: newValue.value })
      };

    useEffect(() => {
        getEquipos(aviso.cliente);
        getClientes();
    })

    const CustomMenuEquipo = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={()=>setModalEquipo(true)}
                >Add New</button>
            </div>
        ) : null
        const CustomMenuCliente = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={()=>setModalCliente(true)}
                >Add New</button>
            </div>
        ) : null

        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          };

    return (
        
        <div className="App" >
                   <Modal
          isOpen={modalEquipo}
          style={ customStyles}
        >
          <button onClick={()=>setModalEquipo(false)}>Cerrar</button>
          <AddEquipos modal={setModalEquipo}/>
        </Modal>
        <Modal
          isOpen={modalCliente}
          style={ customStyles}
        >
          <button onClick={()=>setModalCliente(false)}>Cerrar</button>
          <AddClientes modal={setModalCliente}/>
        </Modal>

            <section className='login'>
                <div className='container' style={{ paddingTop: 50 }}>
                    <div className="formg-roup">
                        <label>Numero</label>
                        <input
                            name="numero"
                            type="text"
                            className="form-control"
                            placeholder="Numero de incidencia"
                            autoFocus
                            required
                            value={aviso.numero}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Cliente</label>
                        <AsyncSelect
                            options={clientesOptions}
                            placeholder='Selecione Cliente'
                            components={{ Menu: CustomMenuCliente }}
                            onChange={handleClienteChange}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Equipo</label>
                        <AsyncSelect
                            options={equiposOptions}
                            placeholder='Selecione Equipo'
                            components={{ Menu: CustomMenuEquipo }}
                            onChange={handleEquipoChange}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Averia</label>
                        <textarea
                            rows='3'
                            type="text"
                            name="averia"
                            className="form-control"
                            placeholder="Enter email"
                            autoFocus
                            required
                            value={aviso.averia}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="justify-content-between" style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className="formg-roup" >
                            <label>Entrada</label>
                            <input
                                type='datetime-local'
                                name="entrada"
                                className="form-control"
                                autoFocus
                                required
                                value={aviso.entrada}
                                onChange={(e) => handleChangeInput(e)}
                            />
                        </div>
                        <div className="formg-roup">
                            <label>Salida</label>
                            <input
                                type='datetime-local'
                                name="salida"
                                className="form-control"
                                placeholder="Enter email"
                                autoFocus
                                required
                                value={aviso.salida}
                                onChange={(e) => handleChangeInput(e)}
                            />
                        </div>
                    </div>
                    <div className="formg-roup">
                        <label>Descripcion</label>
                        <textarea
                            name="descripcion"
                            id=""
                            rows="3"
                            type="text"
                            className="form-control"
                            placeholder="Enter email"
                            autoFocus
                            required
                            value={aviso.descripcion}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ margin: 16 }}
                            onClick={() => addAviso()}
                        >
                            Crear Incidencias
                            </button>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ margin: 16 }}
                            onClick={() => clearImput()}
                        >
                            Limpiar formulario
                            </button>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Avisos;