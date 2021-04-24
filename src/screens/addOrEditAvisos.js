import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select'
import { db } from '../component/fire'
import Modal from 'react-modal'
import AddEquipos from './addOrEditEquipos'
import AddClientes from './addOrEditClientes'


function Avisos() {
    const avisoInicial = {
        numero: '',
        nombre: '',
        direccion: '',
        telefono: '',
        nombreT:'',
        telefonoT:'',
        emailT:'',
        email: '',
        localidad: '',
        tipo: '',
        marca: '',
        modelo: '',
        sn: '',
        averia: '',
        entrada: '',
        salida: '',
        descripcion: '',
    }
    const clientesOptions = []
    const tecnicosOptions = []
    const equiposOptions = []
    const [aviso, setAviso] = useState(avisoInicial)
    const [modalEquipo, setModalEquipo] = useState(false)
    const [modalCliente, setModalCliente] = useState(false)
    const [modalTecnico, setModalTecnico] = useState(false)
    const clearImput = () => {
        setAviso(avisoInicial)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setAviso({ ...aviso, [name]: value })
    }

    const addAviso = async () => {
        console.log(aviso)
        await db.collection("avisos").doc(aviso.numero).set(aviso)
        clearImput()
    }
    const getClientes = (tipo) => {
        db.collection('clientes').where("cliente", "==", tipo).onSnapshot((items) => {
            items.forEach(item => {
                if (tipo) {
                    clientesOptions.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().email })
                } else {
                    tecnicosOptions.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().mail })
                }
            })
        })
    }
    const getEquipos = (cliente) => {
        console.log(cliente)
        if (cliente) {
            console.log('dentro'+cliente)
            db.collection('equipos').where("nombre", "==", cliente).onSnapshot((items) => {
                items.forEach(item => {
                    equiposOptions.push({ value: item.id, label: item.data().tipo + ' - ' + item.data().marca + ' - ' + item.data().modelo + ' - ' + item.data().sn })

                })
            })
        }
    }


    const handleClienteChange = (newValue) => {
        db.collection('clientes').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                setAviso({ ...aviso, nombre: doc.data().nombre , direccion: doc.data().direccion , telefono: doc.data().telefono , localidad: doc.data().localidad, email: doc.data().email })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    };
    const handleTecnicoChange = (newValue) => {
        db.collection('clientes').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                setAviso({ ...aviso, nombreT: doc.data().nombre, telefonoT: doc.data().telefono, emailT: doc.data().email })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    };

    const handleEquipoChange = (newValue) => {
        db.collection('equipos').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                setAviso({ ...aviso, marca: doc.data().marca , modelo: doc.data().modelo, tipo: doc.data().tipo, sn: doc.data().sn })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    };

    useEffect(() => {
        console.log(aviso)
        getEquipos(aviso.nombre);
        getClientes(true);
        getClientes(false);
       
    })

    const CustomMenuEquipo = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={() => setModalEquipo(true)}
                >Add New</button>
            </div>
        ) : null
    const CustomMenuCliente = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={() => setModalCliente(true)}
                >Add New</button>
            </div>
        ) : null
    const CustomMenuTecnico = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={() => setModalTecnico(true)}
                >Add New</button>
            </div>
        ) : null

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: "#2b3e50"
        }
    };

    return (

        <div className="App" >
            <Modal
                isOpen={modalEquipo}
                style={customStyles}
            >
                <button onClick={() => setModalEquipo(false)}>Cerrar</button>
                <AddEquipos modal={setModalEquipo} />
            </Modal>
            <Modal
                isOpen={modalCliente}
                style={customStyles}
            >
                <button onClick={() => setModalCliente(false)}>Cerrar</button>
                <AddClientes modal={setModalCliente} tipo='cliente' />
            </Modal>
            <Modal
                isOpen={modalTecnico}
                style={customStyles}
            >
                <button onClick={() => setModalTecnico(false)}>Cerrar</button>
                <AddClientes modal={setModalTecnico} tipo='tecnico' />
            </Modal>

            <section className='login'>
                <div className='container' style={{ width: 600 }} >
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
                        <label>Tecnico</label>
                        <AsyncSelect
                            options={tecnicosOptions}
                            placeholder='Selecione Cliente'
                            components={{ Menu: CustomMenuTecnico }}
                            onChange={handleTecnicoChange}
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