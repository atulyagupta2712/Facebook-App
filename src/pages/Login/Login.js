import React from 'react'
import LoginString from './LoginStrings'
import './Login.css'
import firebase from '../../services/firebase'
export default class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            isLoading: true,
            error: null
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

    componentDidMount(){
        if(localStorage.getItem(LoginString.ID)){
            this.setState({isLoading: false})
            console.log(this.props)
            this.props.showToast(1, 'Login Successful')
            this.props.history.push('/chat')
        }
        else {
            this.setState({isLoading: false})
        }
    }

    handleSubmit(event){
        event.preventDefault();
        const user = {
            // name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }
        // console.log(email,name,password)
        try {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password).then( result =>{
                    console.log(result)
                    if(result.user)
                    {
                        firebase.firestore().collection('users').where('id', '==', result.user.uid).get()
                        .then(data=>{
                            // console.log(data)
                           data.forEach(doc=>{
                              let currentdata = doc.data()
                              localStorage.setItem(LoginString.ID,currentdata.id)
                              localStorage.setItem(LoginString.NAME, currentdata.name)
                              localStorage.setItem(LoginString.PHOTOURL, currentdata.url)
                              localStorage.setItem(LoginString.FIREBASE_ID, doc.id)
                           })
                           this.props.history.push('/chat')
                        })
                        
                       
                    }
                   
                  
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
                     <label>Password</label>
                  
                    <input id = "password" type = "password" onChange = {this.handleChange.bind(this)} name = "password" defaultValue= {this.state.password}></input>
                    <button type = 'submit'>Submit</button>
                </form>
            </div>
        )
    }
}