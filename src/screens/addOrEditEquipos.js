import React, { useState,useEffect } from 'react'
import AsyncSelect from 'react-select'
import { db } from '../component/fire'


function Equipos(props) {
    const equipoInicial = {
        tipo: '',
        marca: '',
        modelo: '',
        sn: '',
        cliente:''
    }
    const clientesOptions = []
    const [equipo, setEquipo] = useState(equipoInicial)

    const tiposOptions = []

    const clearImput = () => {
        setEquipo(equipoInicial)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setEquipo({ ...equipo, [name]: value })
    }

    const addEquipo = async () => {
        await db.collection("equipos").doc().set(equipo)
        clearImput()
        props.modal(false)
    }

    const getTipo = ()=>{
        db.collection("tipos").onSnapshot((tipos)=>{
            tipos.forEach(tipo=>{
                tiposOptions.push({value: tipo.data().tipo, label: tipo.data().tipo})
            })    
        })
        
    }

    useEffect(()=>{
        getTipo();
        getClientes();
    })
    
     const handleInputChange = (newValue) => {
        setEquipo({ ...equipo, tipo: newValue.value })
      };
      const handleClienteChange = (newValue) => {
        setEquipo({ ...equipo, cliente: newValue.value })
      };
      const getClientes = () => {
        db.collection('clientes').where("tipo", "==", 'cliente').onSnapshot((items) => {
            items.forEach(item => {
                clientesOptions.push({ value: item.id, label: item.data().nombre + ' - ' + item.data().telefono + ' - ' + item.data().mail })
            })
        })
    }

    const CustomMenu = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    className="btn btn-info btn-sm btn-block"
                    onClick={()=>alert('3')}
                >Add New</button>
            </div>
        ) : null
        
    return (
        <div className="Equipos">
            {console.log('aq'+props.modo)}
            <section className='login'>
                <div className='container' style={{width:450}} >
                <div className="formg-roup"></div>

                <div className="formg-roup">
                        <label>Cliente</label>
                        <AsyncSelect
                            options={clientesOptions}
                            placeholder='Selecione Cliente'
                            components={{ Menu: CustomMenu }}
                            onChange={handleClienteChange}
                        />
                    </div>
                    <div className="formg-roup">
                        <label>Tipo de equipo</label>
                        <AsyncSelect
                            options={tiposOptions}
                            placeholder='Tipo de dispositivos'
                            components={{ Menu: CustomMenu }}
                            onChange={handleInputChange}
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

                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ margin: 16 }}
                            onClick={() => addEquipo()}
                        >
                            Crear Equipo
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

export default Equipos;