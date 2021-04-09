import React from 'react'

const Hero =(props)=>{
    const {handleLogout} = props
    console.log('prueba')
    return(
    <section>
        <nav>
            <h2>
                Bienvenido
            </h2>
            <button onClick={()=>handleLogout}>Logout</button>
        </nav>
    </section>
    )
}
export default Hero