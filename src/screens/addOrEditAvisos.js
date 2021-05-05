import React, { useState, useEffect } from 'react'
import AsyncSelect from 'react-select'
import { db } from '../component/fire'
import Modal from 'react-modal'
import AddEquipos from './addOrEditEquipos'
import AddClientes from './addOrEditClientes'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router'
import Moment from 'moment'


function Avisos(props) {
    const avisoInicial = {
        numero: '',
        nombre: '',
        direccion: '',
        telefono: '',
        nombreT: '',
        telefonoT: '',
        emailT: '',
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
    const [clientesOptions, setClienteOptions] = useState([])
    const [tecnicosOptions, setTecnicosOptios] = useState([])
    const [equiposOptions, setEquiposOptions] = useState([])
    const [clientesOptionsDefault, setClienteOptionsDefault] = useState()
    const [tecnicosOptionsDefault, setTecnicosOptiosDefault] = useState()
    const [equiposOptionsDefault, setEquiposOptionsDefault] = useState()
    const [aviso, setAviso] = useState(avisoInicial)
    const [modalEquipo, setModalEquipo] = useState(false)
    const [modalCliente, setModalCliente] = useState(false)
    const [modalTecnico, setModalTecnico] = useState(false)
    const [entradaMostrar, setEntradaMostrar] = useState(false)
    const [salidaMostrar, setSalidaMostrar] = useState(false)
    const [cambio, setCambio] = useState(false)
    const clearImput = () => {
        setAviso(avisoInicial)
        setClienteOptionsDefault(null)
        setTecnicosOptiosDefault(null)
        setEquiposOptionsDefault(null)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        if (name === 'entrada' || name === 'salida') {
            setAviso({ ...aviso, [name]: Moment(value).format('DD/MM/yy HH:mm') })
            if (name == 'entrada') {
                setEntradaMostrar(Moment(value).format('yyyy-MM-DDThh:mm'))
            } else {
                setSalidaMostrar(Moment(value).format('yyyy-MM-DDThh:mm'))
            }
        } else {
            setAviso({ ...aviso, [name]: value })
        }
    }

    const location = useLocation()

    const addAviso = async () => {
        if (salidaMostrar < entradaMostrar) {
            alert('La fecha de salida no puede ser inferior a la fecha de entrada')
        } else {
            await db.collection("avisos").doc(aviso.numero).set(aviso)
            clearImput()
            props.history.push('/');
        }
    }
    const getClientes = (tipo) => {
        const local = []
        db.collection('clientes').where("cliente", "==", tipo).onSnapshot((items) => {
            items.forEach(item => {
                if (tipo) {
                    local.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().email })
                } else {
                    local.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().mail })
                }
            })
            if (tipo) {
                setClienteOptions(local)
            } else {
                setTecnicosOptios(local)
            }
        })
    }
    const getEquipos = (cliente) => {
        const local = []
        if (cliente) {
            console.log('dentro' + cliente)
            db.collection('equipos').where("email", "==", cliente).onSnapshot((items) => {
                items.forEach(item => {
                    local.push({ value: item.id, label: item.data().tipo + ' - ' + item.data().marca + ' - ' + item.data().modelo + ' - ' + item.data().sn })

                })
            })
            setEquiposOptions(local)
        }
    }


    const handleClienteChange = (newValue) => {
        db.collection('clientes').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                setAviso({ ...aviso, nombre: doc.data().nombre, direccion: doc.data().direccion, telefono: doc.data().telefono, localidad: doc.data().localidad, email: doc.data().email })
                setClienteOptionsDefault({ value: doc.data().email, label: doc.data().nombre + '-' + doc.data().telefono + '-' + doc.data().email })
                setEquiposOptionsDefault(null)
                getEquipos(doc.data().email);
            } else {
                console.log("No such document!");
            }
        })
    };
    const handleTecnicoChange = (newValue) => {
        db.collection('clientes').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                setAviso({ ...aviso, nombreT: doc.data().nombre, telefonoT: doc.data().telefono, emailT: doc.data().email })
                setTecnicosOptiosDefault({ value: doc.data().email, label: doc.data().nombre + '-' + doc.data().telefono + '-' + doc.data().email })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    };

    const handleEquipoChange = (newValue) => {
        db.collection('equipos').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                setAviso({ ...aviso, marca: doc.data().marca, modelo: doc.data().modelo, tipo: doc.data().tipo, sn: doc.data().sn, equipoId: doc.data().id })
                setEquiposOptionsDefault({ value: doc.data().equipoId, label: doc.data().tipo + '-' + doc.data().marca + '-' + doc.data().modelo + '-' + doc.data().sn })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    };

    const getAviso = async () => {
        if (location.state) {
            setCambio(true)
            db.collection("avisos").doc(location.state.aviso).onSnapshot((aviso) => {
                if (aviso.exists) {
                    setClienteOptionsDefault({ value: aviso.data().email, label: aviso.data().nombre + '-' + aviso.data().telefono + '-' + aviso.data().email })
                    getEquipos(aviso.data().equipoId)
                    setTecnicosOptiosDefault({ value: aviso.data().emailT, label: aviso.data().nombreT + '-' + aviso.data().telefonoT + '-' + aviso.data().emailT })
                    setEquiposOptionsDefault({ value: aviso.data().equipoId, label: aviso.data().tipo + '-' + aviso.data().marca + '-' + aviso.data().modelo + '-' + aviso.data().sn })
                    setAviso(aviso.data())
                    console.log(aviso.data().entrada + '------------------------------------------------------' + Moment(aviso.data().entrada, 'DD-MM-YYYYTkk:mm').toDate())
                    let fechanueva = Moment(aviso.data().entrada, 'DD-MM-YYYYTkk:mm').toDate()
                    setEntradaMostrar(Moment(fechanueva).format('yyyy-MM-DDThh:mm'))
                    fechanueva = Moment(aviso.data().salida, 'DD-MM-YYYYTkk:mm').toDate()
                    setSalidaMostrar(Moment(fechanueva).format('yyyy-MM-DDThh:mm'))
                }
            })
        }
    }

    useEffect(() => {
        getClientes(true);
        getClientes(false);
        getAviso(false);

    }, [])

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
    const colourStyles = {
        option: (styles, { isFocused }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? '#df691a' : 'white',
                color: '#2b3e50',
            };
        },
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
                            placeholder='Selecione Tecnico'
                            //components={{ Menu: CustomMenuTecnico }}
                            onChange={handleTecnicoChange}
                            value={tecnicosOptionsDefault}
                            styles={colourStyles}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Cliente</label>
                        <AsyncSelect
                            options={clientesOptions}
                            placeholder='Selecione Cliente'
                            //components={{ Menu: CustomMenuCliente }}
                            onChange={handleClienteChange}
                            value={clientesOptionsDefault}
                            styles={colourStyles}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Equipo</label>
                        <AsyncSelect
                            options={equiposOptions}
                            placeholder='Selecione Equipo'
                            //components={{ Menu: CustomMenuEquipo }}
                            onChange={handleEquipoChange}
                            value={equiposOptionsDefault}
                            styles={colourStyles}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Averia</label>
                        <textarea
                            rows='3'
                            type="text"
                            name="averia"
                            className="form-control"
                            placeholder="Averia"
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
                                visible='false'
                                type='datetime-local'
                                name="entrada"
                                className="form-control"
                                autoFocus
                                required
                                value={entradaMostrar}
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
                                value={salidaMostrar}
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
                            placeholder="Descripcion"
                            autoFocus
                            required
                            value={aviso.descripcion}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Button
                            variant="outline-success"
                            onClick={() => addAviso()}
                            style={{ marginRight: 50 }}
                        >
                            Guardar
                            </Button>
                        <Button
                            variant="outline-light"
                            onClick={() => clearImput()}
                        >
                            Limpiar formulario
                            </Button>
                    </div>

                </div>

            </section>
        </div>
    );
}

export default Avisos;