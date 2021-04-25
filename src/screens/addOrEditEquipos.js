import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import AsyncSelect from 'react-select'
import { db } from '../component/fire'
import { Button } from 'react-bootstrap'


function Equipos(props) {
    const equipoInicial = {
        tipo: '',
        marca: '',
        modelo: '',
        sn: '',
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        localidad: '',
        id: ''
    }

    const [equipo, setEquipo] = useState(equipoInicial)
    const [valueCliente, setValueCliente] = useState(null)
    const [valueTipo, setValueTipo] = useState(null)
    const [clientesOptions, setClientesOptions] = useState()
    const [tiposOptions, setTiposOptions] = useState()
    const [cambio, setCambio] = useState(false)

    const clearImput = () => {
        setEquipo(equipoInicial)
        setValueCliente(null)
        setValueTipo(null)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setEquipo({ ...equipo, [name]: value })
    }

    const addEquipo = async () => {
        console.log(equipo)
        if (location.state) {
            await db.collection("equipos").doc(location.state.equipo).update(equipo)
        } else {
            await db.collection("equipos").doc(equipo.id).set(equipo)
        }
        clearImput()
        props.history.push('/');
    }

    const getTipo = async () => {
        db.collection("tipos").onSnapshot((tipos) => {
            const local = []
            tipos.forEach(tipo => {
                local.push({ value: tipo.data().tipo, label: tipo.data().tipo })
            })
            setTiposOptions(local)
        })

    }

    const location = useLocation()

    const getEquipo = async () => {
        if (location.state) {
            setCambio(true)
            db.collection("equipos").doc(location.state.equipo).onSnapshot((equipo) => {
                if (equipo.exists) {
                    console.log(equipo.data())
                    setValueCliente({ value: equipo.data().nombre, label: equipo.data().nombre + '-' + equipo.data().telefono + '-' + equipo.data().email })
                    setValueTipo({ value: equipo.data().tipo, label: equipo.data().tipo })
                    setEquipo(equipo.data())
                }
            })
        }
    }
    useEffect(() => {
        getTipo()
        getEquipo()
        getClientes();
    }, [])

    const handleInputChange = (newValue) => {
        setEquipo({ ...equipo, tipo: newValue.value })
        setValueTipo({ value: newValue.value, label: newValue.value })
    };
    const handleClienteChange = (newValue) => {
        console.log(newValue.value)
        db.collection('clientes').doc(newValue.value).onSnapshot((doc) => {
            if (doc.exists) {
                console.log(doc.data())
                setValueCliente({ value: doc.data().nombre, label: doc.data().nombre + '-' + doc.data().telefono + '-' + doc.data().email })
                setEquipo({ ...equipo, nombre: doc.data().nombre, direccion: doc.data().direccion, telefono: doc.data().telefono, email: doc.data().email, localidad: doc.data().localidad })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    };
    const getClientes = () => {
        db.collection('clientes').where("cliente", "==", true).onSnapshot((items) => {
            const local = []
            items.forEach(item => {
                local.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().email })
            })
            setClientesOptions(local)
        })
    }

    const CustomMenu = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={() => alert('3')}
                >Add New</button>
            </div>
        ) : null
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
        <div className="Equipos">
            <section className='login'>
                <div className='container' style={{ width: 450 }} >
                    <div className="formg-roup"></div>

                    <div className="formg-roup">
                        <label>Codigo</label>
                        <input
                            disabled={cambio}
                            type="text"
                            name="id"
                            className="form-control"
                            autoFocus
                            required
                            value={equipo.id}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Cliente</label>
                        <AsyncSelect
                            options={clientesOptions}
                            placeholder='Selecione Cliente'
                            //components={{ Menu: CustomMenu }}
                            onChange={handleClienteChange}
                            value={valueCliente}
                            styles={colourStyles}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Tipo de equipo</label>
                        <AsyncSelect
                            options={tiposOptions}
                            placeholder='Tipo de dispositivos'
                            //components={{ Menu: CustomMenu }}
                            onChange={handleInputChange}
                            value={valueTipo}
                            styles={colourStyles}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Marca</label>
                        <input
                            type="text"
                            name="marca"
                            className="form-control"
                            autoFocus
                            required
                            value={equipo.marca}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Modelo</label>
                        <input
                            type="text"
                            name="modelo"
                            className="form-control"
                            autoFocus
                            required
                            value={equipo.modelo}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Serial Number</label>
                        <input
                            type="text"
                            name="sn"
                            className="form-control"
                            autoFocus
                            required
                            value={equipo.sn}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Button
                            variant="outline-success"
                            onClick={() => addEquipo()}
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

export default Equipos;