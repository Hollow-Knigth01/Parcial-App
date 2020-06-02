import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from '@material-ui/core/Button';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { Grid, TablePagination } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'





const firebaseConfig = {
  apiKey: "AIzaSyDU_iIHFS5_UOp7wOmpeIYwDW9cRTZS8n0",
  authDomain: "parcial-8e075.firebaseapp.com",
  databaseURL: "https://parcial-8e075.firebaseio.com",
  projectId: "parcial-8e075",
  storageBucket: "parcial-8e075.appspot.com",
  messagingSenderId: "646634858278",
  appId: "1:646634858278:web:a1e28ae65e7511fbfd83e7",
  measurementId: "G-2XZSLHQ3MJ"
  
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();
  var storageRef = storage.ref();
  //firebase.analytics();


class Formulario extends React.Component{
    constructor(props){
        super(props)
        this.state={
            users:[],
            fot:"",
            fotf:"",
            nomAc:"",
            fechAc:"",
            porAc:"",     
            evidAc:"",
            uploadFile: 0,
            id:"",
        }
    }
    saveImage(file){
      var uploadTask = storageRef.child('archivos/' + file.name).put(file);
      uploadTask.on('state_changed', (snapshot) => { 
        let loading = (snapshot.bytesTransferred / snapshot.totalBytes)*100
        this.setState({
          uploadFile: loading
        })
      }, (error) =>{
          this.setState({
            errorMessage:'no se ha podido subir este archivo'
          })
        })
      }
      
    
      loginGoogle=()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result)=> {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          //setUser(user)
          this.setState({nomf: user.displayName, fotf:user.photoURL})
          .then(result => console.log(`${result.user.email} ha iniciado sesion`))
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      }
      setData(){
        if(!this.state.NameActiv ||
          !this.state.fechaAc ||
          !this.state.porcentaje ||
          
          !this.state.evidencia){
          alert("No se han llenado todos los campos") 
            return
        }
        var db = firebase.firestore();
        let docRef = db.collection('users').add({
          nomAc: this.state.NameActiv,
          fechAc: this.state.fechaAc,
          porAc: this.state.porcentaje,
          evidAc: this.state.evidencia,
        });
        alert("Tarea registrada")
        this.getData()
      }
      
      getData(){
        var db = firebase.firestore();
        db.collection('users').get().then((snapshot) => {
          snapshot.forEach((doc) => {
            var u=doc.data();
            var nu=this.state.users
            nu.push(u)
            //setUsers(nu)
            this.setState({user: nu})
          });
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
      }
      eliminar(){
        var  db = firebase.firestore();
        db.collection('users').get().then((snapshot) => {
          snapshot.forEach((doc) => {
              this.state.id = doc.id;
              db.collection('users').doc(doc.id).delete();
             
          })
        })
        .catch((err) => {
          console.log('Error getting documents',err)
        })
      }
      setUpdate() {
        var db = firebase.firestore();
        db.collection('users').get().then((snapshot) => {
          snapshot.forEach((doc) => {
            if (this.state.id == doc.id) {
              this.setData()
              alert("El usuario ha sido actualizado")
            } 
          })
        })
        .catch((err) => {
          console.log('Error getting documents',err)
        })
      }

      handleChange = name => event =>{
        this.setState({...this.state, [name]: event.target.value})
      }
      handleFile = name => (event)=>{
        this.saveImage(event.target.files[0])
        this.setState({...this.state, [name]: event.target.value})
      }  
      renderCard(){
        return(<Paper>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Fecha:</TableCell>
                 <TableCell align="right">Actividad:</TableCell>
                <TableCell align="right">Descripcion:</TableCell>
                <TableCell align="right">Archivo:</TableCell>
                <TableCell align="right">¡Eliminar!</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.users.map(row => (
                <TableRow key={row.nomAc}>
                  <TableCell align="right">{row.fechAc}</TableCell>
                   <TableCell align="right">{row.nomAc}</TableCell>
                  <TableCell align="right">{row.porAc}</TableCell>
                  <TableCell align="right">{row.evidAc}</TableCell>
                  <TableCell align="right"><Button variant="contained" color="secondary" onClick={()=>this.eliminar(row.id)}><DeleteIcon/></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>)
      }  

    renderForm(){
        return(
            <div> 
                    <h1 class="titulo">Tu Libreta Online:</h1>
                        <form action="">
                            <p>
                                
                                <TextField 
                                    label=""
                                    id="Fecha" 
                                    type="date"
                                    variant="outlined" 
                                    //defaultValue=""
                                    value={this.state.fechaAc}
                                    onChange={this.handleChange('fechaAc')}
                                    />
                            </p>
                            <p>
                                
                                <TextField
                                    label="Nombre Actividad:"
                                    id="NameAc" 
                                    type="text"
                                    variant="outlined"
                                    value={this.state.NameActiv}
                                    onChange={this.handleChange('NameActiv')}
                                    />
                            </p>
                            <p>
                                
                                <TextField 
                                    label="Descripcion:"
                                    id="Porcen"
                                    type="text"
                                    variant="outlined"
                                    value={this.state.porcentaje}
                                    onChange={this.handleChange('porcentaje')}
                                    />
                            </p>
                            <p> 
                                
                                <TextField
                                     label=""
                                    id="Evid" 
                                    type="file"
                                    variant="outlined"
                                    value={this.state.evidencia}
                                    onChange={this.handleFile('evidencia')}
                                    /> 
                                
                            </p>

                            <p> <Button variant="contained" color="primary"  onClick={() => this.setData()}> Guardar Actividad</Button> <Button variant="contained" color="secondary" > Cancelar </Button> </p>
                             
                            </form>
                    
            </div>
        
    )
  }
  componentDidMount(){
    this.getData()
  }
  render(){
    const {classes}=this.props
      return(

        
        <div>  
          <Router>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {this.renderForm()}
                <Route path="/" component={()=><Button variant="contained" color="primary" onClick={this.loginGoogle} >Iniciar sesión con google</Button>} />     
              </Grid>
              <Grid item xs={12}>
                {this.renderCard()}
              </Grid>
            </Grid> 
          </Router> 
                     
        </div>
      );
  }
}

export default Formulario;



