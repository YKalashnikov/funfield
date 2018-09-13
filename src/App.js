import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { CirclePicker } from 'react-color';
import firebase from '@firebase/app';
import '@firebase/firestore'

var config = {
  apiKey: "AIzaSyBWNybLvd9YEsT81Xg1-ZJfqKf3I64Frsw",
  authDomain: "funfunfield-16663.firebaseapp.com",
  databaseURL: "https://funfunfield-16663.firebaseio.com",
  projectId: "funfunfield-16663",
  storageBucket: "funfunfield-16663.appspot.com",
  messagingSenderId: "355100138379"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();

firestore.settings({
  timestampsInSnapshots: true
})


const PIXEL_SIZE = 10

class App extends Component {
  constructor() {
    super()
    this.state = {
      pixels:[
        {x: 2, y: 8, color:'blue'}
        /* {x: 5, y: 9, color:'red'},
        {x: 7, y: 11, color:'yellow'},
        {x: 9, y: 14, color:'green'} */
      ],
      selectedCoordinate:{
        x:15,
        y:3
      },
      words:'please make a mess '
    }
    
  }
  handlePixelsClicked(event){
    if(this.state.selectedCoordinate)
     return
    const coordinates = {
      x : Math.floor(event.clientX / PIXEL_SIZE),
      y:  Math.floor(event.clientY / PIXEL_SIZE)
    }
    this.setState({
      selectedCoordinate: coordinates
    })
    firebase
         .firestore()
         .collection("pixels")
         .onSnapshot(coll => 
          this.setState({
             pixels: coll.docs.map(doc => doc.data())
          })
        )
        
         console.log(coordinates)
  }
  handleColorPicked(color){
    firebase.firestore().collection("pixels").add({
      ...this.state.selectedCoordinate,
      color: color.hex
    })
    this.setState({
      selectedCoordinate:null
     
    })
  }
  
  render(){
    return(
    <div id="pixels" onClick={this.handlePixelsClicked.bind(this)}
    style={{
      backgroundImage: `url(${'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e8f8a90139ee123a94dcc36bc8f14b69&auto=format&fit=crop&w=1500&q=80'})`,
      position:'absolute',
      width:'10000px',
      height:'10000px'
      }}>
    {this.state.pixels.map(pixel=> 
    
    <div style={{
      left: pixel.x * PIXEL_SIZE ,
      top: pixel.y * PIXEL_SIZE,
      height: PIXEL_SIZE,
      width: PIXEL_SIZE,
      backgroundColor: pixel.color,
      position: 'absolute'
    }}>
    </div>
    )}
    {
      this.state.selectedCoordinate &&
    <div style={{
      position:'absolute',
      left: this.state.selectedCoordinate.x * PIXEL_SIZE,
      top: this.state.selectedCoordinate.y * PIXEL_SIZE
        }}>
       <CirclePicker onChange={this.handleColorPicked.bind(this)} />
     </div>
    }
    </div>    
  )
  }
}

export default App;
