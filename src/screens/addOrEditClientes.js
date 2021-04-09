import React, { useState } from 'react'
import { db } from '../component/fire'
import 'bootswatch/dist/superhero/bootstrap.min.css';


function Clientes() {
    const clienteInicial = {
        nombre: '',
        direccion: '',
        localidad: '',
        provincia: '',
        telefono: '',
        mail: '',
        cif: '',
    }
    const [cliente, setCliente] = useState(clienteInicial)

    const clearImput = () => {
        setCliente(clienteInicial)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setCliente({ ...cliente, [name]: value })
    }

    const addCliente = async () => {
        await db.collection("clientes").doc().set(cliente)
        clearImput()
    }

    return (
        <div className="App" >

            <section className='login'>
                <div className='container' style={{ paddingTop: 50 }}>
                    <div className="formg-roup">
                        <label>Cif</label>
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
                        <label>Nombre</label>
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
                        <label>Dirección</label>
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
                        <label>telefono</label>
                        <input
                            type='text'
                            name="telefono"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.telefono}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Email</label>
                        <input
                            name="mail"
                            type="mail"
                            className="form-control"
                            autoFocus
                            required
                            value={cliente.mail}
                            onChange={(e) => handleChangeInput(e)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ margin: 16 }}
                            onClick={() => addCliente()}
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

export default Clientes;