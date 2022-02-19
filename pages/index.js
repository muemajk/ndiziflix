import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Movies.module.css'
import axios from 'axios'
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from 'next/link'
import users from '../database/user.json'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import Router from 'next/router'
// import {writeJsonFile} from 'write-json-file';

var user=users;


function signout(){

  var userdata = JSON.stringify({})
  localStorage.removeItem('isloggedin')
  Router.push('/login')
}

function isUsermovies(lists, value){
  return lists.includes(value)
}
let Poster = ({ id, release_date, title, overview, poster_path, onClick }) => {
  useEffect(() => {
    try{
      const localStorage = window.localStorage;
      if(typeof window !== 'undefined')
      user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      
      if(localStorage.getItem('isloggedin')==null) Router.push('/login')
    }catch(e){
      Router.push('/login')
    }
  })
  var config = {
    public_key: 'FLWPUBK-16e8636fb8c674d4adefedd568081c3b-X', //process.env.PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: 5,
    currency: "KES",
    country: "KE",
    payment_options: " ",
    meta: {
      consumer_id: user.id,
      consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
      email: user.email,
      phone_number: user.phoneNumber,
      name: "Ndizi Movie",
    }
  }



  const handleFlutterPayment = useFlutterwave(config);
  
  
  
  return (
    <div className={styles.movieCard}>
      <div   className={styles.movieImg}>
      <Image
        src={'http://image.tmdb.org/t/p/w500'+poster_path}
        alt="Picture of the movie"
        width={150}
        height={290}
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
      </div>
        <h1>{title}</h1>
        <span>{release_date}</span>
        <i className= "fas fa-star"></i>
        <p>{overview}</p>
        {isUsermovies(user.movies, id) ? <button className={styles.bought}><Link href={'watch/'+id}>WATCH</Link></button> :
        <button className={styles.watch} onClick={(data) => {
          handleFlutterPayment({
            callback: (response)=>{
              if(response.status === "successful"){
                users['movies'].push(id)
                var userdata = JSON.stringify(users)
                localStorage.setItem('user',userdata)
              }
              closePaymentModal()
            },
            onClose: ()=>{
              users['movies'].push(id)
              var userdata = JSON.stringify(users)
              localStorage.setItem('user',userdata)//writeJsonFile('../database/user.json',users)
            }
          })
        }}>BUY</button>}
    </div>
  );
};

Poster.propTypes = {
  popularity: PropTypes.string,
  release_date: PropTypes.string,
  title: PropTypes.string,
  overview: PropTypes.string,
  poster_path: PropTypes.string.isRequired
};





export default function Home({moviedata}) {
  const [datalist, setDatalist] = useState(moviedata)
  const [userdetail, setUserDetails] = useState(users)

  

  return (
    <div className={styles.container}>
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
              {
                userdetail.firstname+" "+userdetail.lastname
              }
            </li>
            <li><button  className={styles.signout} onClick={signout}>Sign out</button></li>
          </ul>
        </nav>

        <div>{(datalist.map((data,key) => <div key={key}>
          <h3>TOTAL RESULTS:{data.total_results}</h3>
          
          {(data.results.map((movie,moviekey) => <div key={moviekey}>
            <Poster
              id={movie.id}
              release_date="two"
              title={movie.original_title}
              overview="Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget."
              poster_path={movie.poster_path}
            />
          </div>))}
        </div>))}</div>
        
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}


export async function getServerSideProps(){
  try{
    if(typeof window !== 'undefined'){
      user = localStorage.getItem('user')
    }
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
    const bearer = 'Bearer '+ process.env.MOVIE_API_KEY
    const res = await axios(url, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
          'Authorization': bearer,
          'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
          'Content-Type': 'application/json'
      }
    })
    var moviedata = [res.data]
    
    return  { props:{moviedata} }
  }catch(e){
    var moviedata = []
    console.log("errrrrr"+e)
    return  { props:{moviedata} }
  }
}
