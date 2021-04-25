import React, { useState, useEffect } from 'react'
import 'bootswatch/dist/superhero/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { auth } from './component/fire'
import { Navbar, Nav, NavDropdown, Button, Form } from 'react-bootstrap'
import { Avisos, Equipos, Clientes, ListadoAvisos, ListadoEquipos, ListadoClientes } from './screens';


function App() {
  const [user, setUser] = useState('')
  const [email, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const clearImput = () => {
    setMail('')
    setPassword('')
  }

  const clearError = () => {
    setError('')
  }

  const handleLogin = () => {
    clearError()
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        setError(err.message)
      })
  }

  const authListener = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        clearImput()
      }
    })
    console.log(user)
  }

  useEffect(() => {
    authListener();
  }
  )

  if (user) {
    return (
      <div>
        <div className="row" style={{ margin: 0 }}>
          <div className="col-md-12" style={{ padding: 0 }}>
            <Router>
              <Navbar bg="dark" variant="dark" expand="lg" sticky="top">

                <Navbar.Brand href="/Home">Gestion de Avisos</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <NavDropdown title="Clientes" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/Clientes">Crear</NavDropdown.Item>
                      <NavDropdown.Item href="ClientesListado">Listar</NavDropdown.Item>
                    </NavDropdown><NavDropdown title="Tecnicos" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/Tecnicos">Crear</NavDropdown.Item>
                      <NavDropdown.Item href="TecnicosListado">Listar</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Equipos" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/Equipos">Crear</NavDropdown.Item>
                      <NavDropdown.Item href="/EquiposListado">Listar</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Averias" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/Avisos">Crear</NavDropdown.Item>
                      <NavDropdown.Item href="/AvisosListado">Listar</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                  <Form inline>
                    <Button onClick={() => auth.signOut()} variant="outline-success">Salir</Button>
                  </Form>
                </Navbar.Collapse>
              </Navbar>
              <br />
              <Switch>

                <Route exact path="/Clientes" render={routeProps =>
                  <Clientes tipo='cliente' {...routeProps} />
                } />

                <Route path="/ClientesListado" render={routeProps =>
                  <ListadoClientes tipo='cliente' {...routeProps} />
                } />

                <Route path="/ClientesModificar" render={routeProps =>
                  <Clientes tipo='cliente' {...routeProps} />
                } />

                <Route path="/Tecnicos" render={routeProps =>
                  <Clientes tipo='tecnico' {...routeProps} />} />

                <Route path="/TecnicosListado" render={routeProps =>
                  <ListadoClientes tipo='tecnico' {...routeProps} />
                } />

                <Route path="/TecnicosModificar" render={routeProps =>
                  <Clientes tipo='tecnico'  {...routeProps} />} />

                <Route path="/Equipos" render={routeProps =>
                  <Equipos {...routeProps} />
                } />

                <Route path='/EquiposListado' render={routeProps =>
                  <ListadoEquipos {...routeProps} />} />

                <Route path="/EquiposModificar" render={routeProps =>
                  <Equipos {...routeProps} />
                } />

                <Route path="/Avisos" render={routeProps =>
                  <Avisos {...routeProps} />} />

                <Route path="/AvisosListado" render={routeProps =>
                  <ListadoAvisos {...routeProps} />} />
                
                <Route path="/AvisosModificar" render={routeProps =>
                  <Avisos {...routeProps} />} />


              </Switch>
            </Router>
          </div>
        </div>
      </div >
    )
  } else {
    return (
      <div className="App" style={{ paddingTop: 50 }}>
        <section className='login'>
          <div className='container'>
            <div className="formg-roup">
              <label>Username</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                autoFocus
                required
                value={email}
                onChange={(e) => setMail(e.target.value)}
              />
            </div>
            <div className="formg-roup">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-danger">{error}</p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => handleLogin()}
            >
              Login
                                </button>
          </div>

        </section>
      </div>
    );
  }


}


export default App;