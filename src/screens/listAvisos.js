import React, { useState, useEffect } from 'react'
import { db } from '../component/fire'

export default function ListadoAvisos() {
    const [listado, setListado] = useState([])
    const getAvisos = async () => {
        let equipo = ""
        let cliente = ""
        await db.collection("avisos").onSnapshot((querySnapshot) => {
            const avisos = [];
            querySnapshot.forEach((aviso) => {
                equipo=getEquipo(aviso.data().equipo)
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
            setListado(avisos)
            console.log(avisos)
        })
    }
    const getEquipo = async (equipoId) => {
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
    useEffect(() => {
        getAvisos();
    }, [])

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
                    {listado.map(item => (
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