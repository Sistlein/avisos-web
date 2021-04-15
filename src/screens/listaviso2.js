import React, {  Component } from 'react'
import { db } from '../component/fire'

export default class ListadoAvisos extends Component{
    constructor(props) {
        super(props);
        this.state = { listado:{}};
    }
    getAvisos() {
        let equipo = ""
        let cliente = ""
        db.collection("avisos").onSnapshot((querySnapshot) => {
            const avisos = [];
            querySnapshot.forEach((aviso) => {
                db.collection("clientes").doc(aviso.data().cliente).get().then((doc) => {
                    if (doc.exists) {
                        cliente = doc.data().cif + " - " + doc.data().nombre
                        console.log('ñññe' + equipo)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
                console.log('qwe' + equipo)
                avisos.push({ ...aviso.data(), datosEquipo: equipo, datoscliente: cliente })
            })
            this.setState({listado:avisos})
            console.log(avisos)
        })
    }
    getEquipo() {
        const equipoId = 'dsf'
        let equipo
        db.collection("equipos").doc(equipoId).get().then((doc) => {
            if (doc.exists) {
                equipo = doc.data().marca + " - " + doc.data().modelo + " - " + doc.data().sn
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        return equipo
    }


    render() {
        return (
            <div>
                <h1>prueba</h1>
                <table className="table table-hover">
                    <thead>
                        <tr className="table-primary">
                            <th scope="col">Cliente</th>
                            <th scope="col">Equipo</th>
                            <th scope="col">Fecha de entrada</th>
                            <th scope="col">Fecha de salida</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.listado.map(item => (
                            <tr>
                                <th scope="row">{item.cliente}</th>
                                <td>{item.equipo}</td>
                                <td>{item.entrada}</td>
                                <td>{item.salida}</td>
                                <td></td>
                            </tr>



                        ))}
                    </tbody>
                </table>
            </div>

        )
    }
}