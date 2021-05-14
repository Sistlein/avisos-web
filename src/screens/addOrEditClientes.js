import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router'
import { db, auth2 } from '../component/fire'
import InputMask from 'react-input-mask';

function Clientes(props) {
    const clienteInicial = {
        nombre: '',
        direccion: '',
        localidad: '',
        provincia: '',
        telefono: '',
        email: '',
        cif: '',
        cliente: false,
        password: ''
    }
    const [cliente, setCliente] = useState(clienteInicial)
    const [cambio, setCambio] = useState(false)

    const location = useLocation()

    const clearImput = () => {
        setCliente(clienteInicial)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setCliente({ ...cliente, [name]: value })
    }

    const addCliente = async () => {
        if (location.state) {
            await db.collection("clientes").doc(location.state.cliente).update(cliente)
            alert('Usuario modificado correctamente')
        } else {
            if (cliente.nombre != '' && cliente.telefono != '') {
                auth2.createUserWithEmailAndPassword(cliente.email, cliente.password)
                    .then(data => {
                        db.collection("clientes").doc(cliente.email).set(cliente)
                        alert('Usuario creado correctamente')
                        clearImput()
                        props.history.push('/');
                    })
                    .catch(error => {
                        alert(error)
                        console.log(error);
                    });
            }else{
                alert("Como minimo debo de rellenar los campos con *")
            }
        }

    }
    const LabelTipo = () => {
        console.log('tipo' + props.tipo)
        if (props.tipo === 'cliente') {
            return (<label>Cif</label>)
        } else {
            return (<label>Código</label>)
        }
    }

    const getClientes = async () => {
        if (location.state) {
            setCambio(true)
            db.collection("clientes").doc(location.state.cliente).onSnapshot((cliente) => {
                if (cliente.exists) {
                    console.log(cliente.data())
                    setCliente(cliente.data())
                }
            })
        }
    }

    useEffect(() => {
        if (props.tipo === 'cliente') {
            setCliente({ ...cliente, cliente: true })
        }
        getClientes()
    }, [])

    return (
        <div className="App" >

            <section className='login'>
                <div className='container' style={{ width: 450 }} >
                    <div className="formg-roup" >
                        <label>Email *</label>
                        <input
                            disabled={cambio}
                            name="email"
                            type="email"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.email}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <span>
                        {cambio === false ?
                            <div className="formg-roup" >
                                <label>Password *</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    autoFocus
                                    required
                                    value={cliente.password}
                                    onChange={(e) => handleChangeInput(e)}
                                />
                            </div>
                            :
                            <div></div>}
                    </span>
                    <div className="formg-roup">
                        <LabelTipo />
                        <input
                            name="cif"
                            type="text"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.cif}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.nombre}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Dirección </label>
                        <input
                            type="text"
                            name="direccion"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.direccion}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>

                    <div className="justify-content-between" style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className="formg-roup" >
                            <label>Provincia</label>
                            <input
                                type='text'
                                name="provincia"
                                className="form-control"
                                autoFocus
                                required
                                value={cliente.provincia}
                                onChange={(e) => handleChangeInput(e)}
                            />
                        </div>
                        <div className="formg-roup">
                            <label>Localidad</label>
                            <input
                                type="text"
                                name="localidad"
                                className="form-control"
                                autoFocus
                                required
                                value={cliente.localidad}
                                onChange={(e) => handleChangeInput(e)}
                            />
                        </div>

                    </div>
                    <div className="formg-roup">
                        <label>telefono *</label>
                        <InputMask
                            mask="999999999"
                            type='text'
                            name="telefono"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.telefono}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Button
                            variant="outline-success"
                            onClick={() => addCliente()}
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

export default Clientes;