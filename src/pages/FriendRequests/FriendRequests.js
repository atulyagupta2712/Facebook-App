import React from 'react'
import firebase from '../../services/firebase'
import LoginString from '../Login/LoginStrings'

export default class FriendRequests extends React.Component {
    constructor(props){
        super(props)
        this.friends = []
        this.displayUsers = []
        this.firebaseKey = localStorage.getItem(LoginString.FIREBASE_ID)
        this.currentUserId = localStorage.getItem(LoginString.ID)
        this.state = {
            displayUsers : [],
            button : 'Add Friend',
            buttonValue: 0
        }
        firebase.firestore().collection('users').doc(this.firebaseKey).get().then(data=>{
            // data.forEach(doc=>{
            //     console.log(doc.data())
            // })
           this.friends = data.data().friends
        })
    }
    componentDidMount(){
        this.getListOfUsers()
    }
    switchButtons =(value)=>{
        switch(value){
            // 
            case 1:  console.log("case 1")
            this.setState({button: 'Request Sent'})
           
                    return
            case 2: this.setState({button: 'Request Recieved'})
                    return

            case 3: this.setState({button: 'Friends'})
                    return
            default: this.setState({button: 'Add Friend'})
        }
    }

    getListOfUsers = async()=>{
        const result = await firebase.firestore().collection('users').get()
        if(result.docs.length > 0){
            let listOfUsers = []
            listOfUsers = result.docs
            listOfUsers.forEach((item,index)=>{
                // console.log("list off users ",item.data())
                if(item.data().id !== this.currentUserId){
                   
                    if(this.friends.length>0){
                      
                        this.friends.forEach(friend=>{
                           
                            console.log("item ", item.data().id)
                            console.log("friend ",friend.id)
                            if(item.data().id == friend.id){
                              this.switchButtons(friend.value)
                                // console.log("hii")
                            }
                            else{
                                this.setState({button: 'Add Friend'})
                            }
                        })
                    }
                  
                    this.displayUsers.push(
                        <div id = {index}>
                        <img src = {item.data().url}/>
                    
                    <span>{item.data().name}</span>
                    <button onClick = {()=>{this.changeButtons(item.data().id,this.state.button)}}>{this.state.button}</button>
                    </div>
                    )
                    console.log(this.state.button)
                }
              
            })
          
        }
        this.setState({
            displayUsers: this.displayUsers
        })
    }
    changeButtons=(id,buttonValue)=>{
        if(buttonValue == 'Add Friend'){
            this.state.buttonValue = 1
            
        }
        else if(buttonValue == 'Request Sent'){
            this.state.buttonValue = 0
        }
        else if(buttonValue == 'Request Recieved'){
            this.state.buttonValue = 3
        }
        this.switchButtons(this.state.buttonValue)
    }
    render(){
        return(
            <div>
              {this.state.button}
              {this.state.displayUsers}
            </div>
        )
    }
}