import React, { Component } from 'react'
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Profile from './pages/Profile/Profile'
import Chat from './pages/Chat/Chat'
import Post from './pages/posts/Post'
import firebase from './services/firebase'
import {toast, ToastContainer} from 'react-toastify'
import './App.css'
import Header from './components/Header'
import FriendRequests from './pages/FriendRequests/FriendRequests'

class App extends Component {
    showToast = (type,message)=>{
        switch (type) {
            case 0:
                toast.warning(message)
                break;
            case 1:
                toast.success(message)
                break
        
            default:
                break;
        }
    }

    constructor(){
        super();
        this.state = {
            authenticated: false,
            loading: true
        };
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user =>{
            if(user){
                this.setState({
                    authenticated: true,
                    loading: false
                })
            }
            else{
                this.setState({
                   authenticated: false,
                   loading: false
                })
            }
        })
    }

    render(){
        return this.state.loading === true?(
            <div className = 'spinner-border text-success' role = 'status'>
                <span className = 'sr-only'>loading.........</span>
            </div>
        ):
        (
            <div>
           
            <Router>
            <Header/>
                <ToastContainer
                autoClose = {2000}
                hideProgressBar = {true}
                position = {toast.POSITION.TOP_CENTER}
                />
                <Switch>
                    <Route 
                    exact path = '/' render = {props=><Home {...props}/>}
                    />

                    <Route 
                    path = '/login' 
                    render = {props =><Login showToast = {this.showToast}{...props}/>}/>

                    <Route 
                    path = '/profile' 
                    render = {props =><Profile showToast = {this.showToast}{...props}/>}/>

                    <Route 
                    path = '/signup' 
                    render = {props =><Signup showToast = {this.showToast}{...props}/>}/>

                    <Route 
                    path = '/chat' 
                    render = {props =><Chat showToast = {this.showToast}{...props}/>}/>

                    <Route 
                    path = '/newPost' 
                    render = {props =><Post showToast = {this.showToast}{...props}/>}/>
                      <Route 
                    path = '/friends' 
                    render = {props =><FriendRequests showToast = {this.showToast}{...props}/>}/>
                </Switch>
            </Router>
            </div>
        )
    }
}

export default App