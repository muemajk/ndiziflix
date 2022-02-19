
import styles from '../styles/Login.module.css'
import Head from 'next/head'
import Link from 'next/link'
import users from '../database/user.json'
import { useEffect, useState } from 'react'
import Router from 'next/router'

var user=users;


let Loginform = () => {
    const [isError, setIsError]= useState(false)
    const [errorMessage, setErrorMessage]= useState(null)
    const login= async event =>{
        event.preventDefault();
        if (event.target.email.value && event.target.password.value) {
            if(event.target.email.value == user['email'] && event.target.password.value == user['password'] ){

                localStorage.setItem('isloggedin',true)
                Router.push('/')
            }else{
                setIsError(true)
                setErrorMessage("User Not found")
            }
        }else {
            setIsError(true)
            setErrorMessage("Fill in all required fields")
        }
    }

    useEffect(()=>{
        if(isError){
            setTimeout(()=>{
                setIsError(false)
                setErrorMessage(null)
            },5000)
        }
        if(typeof window !== 'undefined')
        user = localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')): users
    
          
    })

    return (
        <form onSubmit={login}>
            {isError ? <div className={styles.Error}>
                <div>{errorMessage}</div>
                </div>: <h1>Login</h1>}
            <input className={styles.email} id="email" name="email"  type="email" placeholder="Email address"/>
            <input className={styles.password} id="password" name="password" type="password" placeholder="Password"/>
            <button  className={styles.loginbtn}>Login</button>
        </form>
    )
}


export default function login(){

    return <div className={styles.container}>
    <Head>
      <title>Ndizi TV</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <div>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">NDIZI TV!</a>
        </h1>
      </div>
      <nav className={styles.navbar}>
        <ul>
          <li>
            <Link href='/login'>Login</Link>
          </li>
          <li>
            <Link href='/signup'>Signup</Link>
          </li>
        </ul>
      </nav>

    <div className={styles.loginCard}>
        <Loginform/>
    </div>
    </main>
</div>
}