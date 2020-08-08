import React from 'react'
import LoginString from '../Login/LoginStrings'
import firebase from '../../services/firebase'
import Welcome from '../Welcome/Welcome'
import ChatBox from '../Chatbox/Chatbox'

export default class Chat extends React.Component {
    constructor(props){
        super(props)
        this.currentUserName = localStorage.getItem(LoginString.NAME)
        this.state = {
            isLoading: true,
            isLogout: false,
            currentPeerUser: null,
            displayedContactSwitchedNotfication: []
        }
        this.currentUserId = localStorage.getItem(LoginString.ID)
        this.currentUserUrl = localStorage.getItem(LoginString.PHOTOURL)
        this.currentUserMessages = []
        this.searchUsers = []

    }

    componentDidMount(){
        firebase.firestore().collection('users').where('id', '==', this.currentUserId).get().then(data=>{
            data.forEach(doc=>{
                console.log(doc.data())
                this.user = doc.data()
                this.user.messages.map(item=>{
                    this.currentUserMessages.push({
                        notificationId: item.notificationId,
                        number: item.number
                    })
                })
                this.setState({
                    displayedContactSwitchedNotfication: this.currentUserMessages
                })
            })
        })

        this.getListUser()
    }

    getListUser= async()=>{
        console.log('hellllo')
    const result = await firebase.firestore().collection('users').get();
    if(result.docs.length > 0){
        let listOfUsers = []
        listOfUsers = result.docs
        console.log(listOfUsers)
        console.log([...listOfUsers])
        listOfUsers.forEach((item,index)=>{
            // console.log("Item is",item)
           this.searchUsers.push({
               key: index,
               documentKey: item.id,
               id: item.data().id,
               name: item.data().name,
               messages: item.data().messages,
               url: item.data().url,
               description: item.data().description
           })
        })
    }
    this.setState({
        isLoading: false
    })
    this.renderListOfUsers(this.searchUsers)
    }

    renderListOfUsers=(users)=>{
        if(this.searchUsers.length>0){
            let viewListUser = []
            let classname = ''
            users.map(item=>{
                // console.log(item)
                if(item.id != this.currentUserId){
                    classname = this.getClassNameForUserAndNotfication(item.id)
                    viewListUser.push(
                        <button 
                        id = {item.key}
                        onClick = {()=>{
                            this.setState({
                                currentPeerUser: item
                            })
                        }}
                        >
                            <img src = {item.key}></img>
                            <span>{item.name}</span>
                        </button>
                    )
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }
    }

    getClassNameForUserAndNotfication=(id)=>{

    }
    logout(){
        firebase.auth().signOut()
        this.props.history.push('/')
        localStorage.clear()
    }
    onProfileClick()
    {
        this.props.history.push('/profile')
    }

    searchHandler(event){
        let searchQuery = event.target.value.toLowerCase()
        // console.log(searchQuery)
        let displayedContacts = this.searchUsers.filter(el=>{
            let searchValue = el.name.toLowerCase()
            console.log(searchValue.indexOf(searchQuery))
            return searchValue.indexOf(searchQuery) !== -1
            
        })

        this.displayedContacts = displayedContacts
        console.log(this.displayedContacts)
        this.renderListOfUsers(this.displayedContacts)
    }

    
    render(){
        return(
            <div className = 'row'>
                <div className = 'chat-left col-md-4'>
                {this.currentUserName}
                <img src = {this.currentUserUrl} onClick = {this.onProfileClick.bind(this)}
                 style = {{height: '200px', width: '200px'}}></img>

                <button onClick = {this.logout.bind(this)}>Logout</button>
                <div>
                    <input type = 'text' onChange = {this.searchHandler.bind(this)}></input>
                </div>
                {this.state.displayedContacts}
                </div>
                <div className = 'chat-right col-md-8'>
                    {this.state.currentPeerUser?(
                        <div>
                            <ChatBox currentPeerUser = {this.state.currentPeerUser}
                            showToast = {this.props.showToast}
                            />
                        </div>
                    ):(
                        <div>
                            <Welcome showToast = {this.props.showToast} props = {this.props}/>
                        </div>
                    )}
                </div>

            </div>
        )
    }
}