import React from 'react'
import {Link} from 'react-router-dom'
import firebase from '../../services/firebase'
import LoginString from '../Login/LoginStrings'

export default class SignUp extends React.Component{
    constructor(){
        super();
        this.state = {
            email: "",
            name:"",
            password: ""
        }
    }

    handleChange(event){
        // console.log(
        //     event.target.value
        // )
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event){
        event.preventDefault();
        const user = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }

        console.log(this.state.name)
        console.log(user)
        try {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(async result =>{
                    console.log(result)
                    firebase.firestore().collection('users').add({
                        
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password,
                        url: "",
                        messages: [{notificationId: "", number: 0}],
                        id: result.user.uid,
                        description: "",
                        friends: [{id : '', value: ''}]
                    }).then(res=>{
                        
                        localStorage.setItem(LoginString.ID,result.user.uid)
                        localStorage.setItem(LoginString.NAME, user.name)
                        localStorage.setItem(LoginString.PHOTOURL, user.url)
                        localStorage.setItem(LoginString.FIREBASE_ID, res.id)
                        localStorage.setItem(LoginString.DESCRIPTION, user.description)
                        this.setState({
                            name: "",
                            email: "",
                            url: ""
                        })
                        this.props.history.push('/chat')
                    })
                    .catch(error=>{
                        console.log("error adding document ",error)
                    })
            })
        }
        catch{}
        
    }

    render(){
        return(
            <div>
                <form onSubmit = {this.handleSubmit.bind(this)}>
                    <label>Email</label>
                    <input id = "email" type = "text" onChange = {this.handleChange.bind(this)} name = "email" defaultValue= {this.state.email}/>
                     <label>Name</label>
                    <input id = "name" type = "text" onChange = {this.handleChange.bind(this)} name = "name" defaultValue= {this.state.name}></input>
                     <label>Password</label>
                    <input id = "password" type = "password" onChange = {this.handleChange.bind(this)} name = "password" defaultValue= {this.state.password}></input>
                    <button type = 'submit'>Submit</button>
                </form>
            </div>
        )
    }
}