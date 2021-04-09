import React, { useState, useEffect } from 'react'
import { fire, Hero } from '../component'
import 'bootswatch/dist/superhero/bootstrap.min.css';


function Login() {
    const [user, setUser] = useState('')
    const [email, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('fallo enlos correos')

    const clearImput = () => {
        setUser('')
        setPassword('')
    }

    const clearError = () => {
        setError('')
    }

    const handleLogin = () => {
        clearError()
        fire
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(err => {
                setError(err.message)
            })
    }

    const handleLogout = () => {
        fire.auth().signOut()
    }

    const authListener = () => {
        fire.auth().onAuthStateChanged((user) => {
            clearImput()
            if (user) {
                setUser(user)
            }
        })
    }

    useEffect(() => {
        authListener();
    }
    )
    return (
        <div className="App" style={{paddingTop:50}}>
            {user ? (
                <Hero handleLogout={handleLogout} />
            ) : (
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
            )}
        </div>
    );
}

export default Login;
