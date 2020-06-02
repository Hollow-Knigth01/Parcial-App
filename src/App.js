import React from 'react';
import Grid from '@material-ui/core/Grid';
import './App.css';

//Mis componentes

// import Micomponent from './componentes';
import MFormulario from './Componentes/Formulario';
// import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route} from "react-router-dom";

class App extends React.Component{

  render(){
    const {classes} = this.props
    return (
      <div className="App">
       <Router> 
        <Grid container spacing={3}>
          
          <Grid item xs={12}>
          
              
              
              <Route path="/" component={()=><MFormulario xxx={this.handleValues} /> }/>
              
               
            </Grid>
          </Grid>
        </Router>
      </div>
      );}
  }
  
  



export default App;
