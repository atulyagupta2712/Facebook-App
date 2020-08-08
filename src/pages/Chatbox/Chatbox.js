import React from 'react'
import ReactLoading from 'react-loading'
import Firebase from '../../services/firebase'
import moment from 'moment'
import './Chatbox.css'
import LoginString from '../Login/LoginStrings'
import Images from '../../ProjectImages/ProjectImages'


export default class ChatBox extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            isShowSticker: false,
            inputValue: ""
        }
        this.currentUserId = localStorage.getItem(LoginString.ID)
        this.currentUserUrl = localStorage.getItem(LoginString.PHOTOURL)
        this.currentPeerUser = this.props.currentPeerUser
        this.groupChatId = null
        this.currentPeerUserMessages = []
        this.listMessages = []
    

        Firebase.firestore().collection('users').doc(this.currentPeerUser.documentKey).get().then((docRef)=>{
                this.currentPeerUserMessages = docRef.data().messages
        })
    }

    componentWillReceiveProps(newProps){
        if(newProps.currentPeerUser){
        this.currentPeerUser = newProps.currentPeerUser
        this.getListHistory()
        }
    }
    componentDidMount(){
        this.getListHistory()
    }

    componentWillUnmount(){
        if(this.removeListener){
            this.removeListener()
        }
    }

    getListHistory=()=>{
        if(this.removeListener){
            this.removeListener()
        }
        this.listMessages.length = 0
        this.setState({isLoading:true})
        if(this.currentUserId<= this.currentPeerUser.id){
            console.log('true')
            this.groupChatId = this.currentUserId + this.currentPeerUser.id
        }
        else{
            console.log(`${this.currentPeerUser.id}`-`${this.currentUserId}`)
            this.groupChatId = this.currentPeerUser.id + this.currentUserId
            console.log(this.groupChatId)
        }
       

        this.removeListener = Firebase.firestore().collection('messages').doc(this.groupChatId)
        .collection(this.groupChatId)
        .onSnapshot((snapshot)=>{
            snapshot.docChanges().forEach(change=>{
                if(change.type == 'added'){
                    this.listMessages.push(change.doc.data())
                }
            })

            this.setState({isLoading: false})
        },
        err=>{
            this.props.showToast(0,err.toString())
        }
        )
    }

    componentDidUpdate(){
        this.scrollToBottom()
    }

    scrollToBottom=()=>{
        if(this.messagesEnd){
            this.messagesEnd.scrollIntoView({})
        }
    }

    onSendMessage =(content, type)=>{
        let notifcationMessages = []
        if(this.state.isShowSticker && type === 2){
            this.setState({isShowSticker: false})
        }
        console.log("hey")

        if(content.trim() === ''){
            return
        }
        console.log("hey")

        const timestamp = moment().valueOf().toString()
        console.log("timestamp", timestamp)
        const itemMessage = {
            idFrom: this.currentUserId,
            idTo: this.currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }
        console.log("Item Message",itemMessage)

        Firebase.firestore().collection('messages').doc(this.groupChatId)
        .collection(this.groupChatId).doc(timestamp).set(itemMessage).then(()=>{
            this.setState({inputValue :''})
        })

        this.currentPeerUserMessages.map(item=>{
            if(item.notificationId != this.currentUserId){
                notifcationMessages.push(
                    {
                        notificationId: item.notificationId,
                        number: item.number
                    }
                )
            }
        })

        Firebase.firestore().collection('users').doc(this.currentPeerUser.documentKey)
        .update({
            messages: notifcationMessages
        })
        .then(data=>{

        })
        .catch(error=>{
            this.props.showToast(0,error.toString())
        })
    }

    openListSticker =()=>{
        this.setState({isShowSticker: !this.state.isShowSticker})
    }

    hashString=(str)=>{
        let hash = 0
        for(let i =0; i<str.length; i++){
            hash += Math.pow(str.charCodeAt(i)*31, str.length-i)
            hash = hash & hash
        }

        return hash
    }

    renderStickers=()=>{
        return(
            <div>
                <img
                src = {Images.animated1}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated1',2)}}/>
                 <img
                src = {Images.animated2}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated2',2)}}/>
                 <img
                src = {Images.animated3}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated3',2)}}/>
                 <img
                src = {Images.animated4}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated4',2)}}/>
                 <img
                src = {Images.animated5}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated5',2)}}/>
                 <img
                src = {Images.animated6}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated6',2)}}/>
                 <img
                src = {Images.animated7}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated7',2)}}/>
                 <img
                src = {Images.animated8}
                className = 'imgSticker'
                onClick = {()=>{this.onSendMessage('animated8',2)}}/>

            </div>
        )
    }
    onKeyPress = (event)=>{
        if(event.key === 'Enter'){
            this.onSendMessage(this.state.inputValue, 0)
        }
    }
    renderListMessages = ()=>{
        if(this.listMessages.length > 0){
            let viewListMessage = []
            console.log(this.listMessages)
            this.listMessages.forEach((item,index)=>{
                if(item.idFrom === this.currentUserId){
                    if(item.type === 0){
                        viewListMessage.push(
                            <div key = {item.timestamp}>
                                <span>{item.content}</span>
                            </div>
                        )
                    }
                    else if(item.type === 1){
                        viewListMessage.push(
                            <div key = {item.timestamp}>
                                <img src = {item.content }></img>
                            </div>
                        )
                    }
                    else{
                        viewListMessage.push(
                            <div key = {item.timestamp}>
                                <img
                                src = {this.getImage(item.content)}
                                />
                            </div>
                        )
                    }
                }
                else{
                    if(item.type === 0){
                        viewListMessage.push(
                            <div key = {item.timestamp}>
                                <div>
                                    {this.isLastMessageLeft(index)?(
                                        <img
                                        src = {this.currentPeerUser.url}
                                        />
                                    ):(
                                        <div></div>
                                    )}
                                    <div>
                                    <span>{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span>
                                        <div>
                                            {moment(Number(item.timestamp)).format('HH:mm')}
                                        </div>
                                    </span>
                                ):null}
                            </div>
                        )
                    }
                    else if(item.type === 1){
                        viewListMessage.push(
                            <div key = {item.timestamp}>
                                <div>
                                    {this.isLastMessageLeft(index)?(
                                        <img
                                        src = {this.currentPeerUser.url}
                                        />
                                    ):(
                                        <div></div>
                                    )}
                                    <div>
                                        <img
                                        src = {item.content}
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span>
                                        <div>
                                            {moment(Number(item.timestamp)).format('HH:mm')}
                                        </div>
                                    </span>
                                ):null}
                                </div>
                        )
                    }
                    else{
                        viewListMessage.push(
                            <div key = {item.timestamp}>
                                <div>
                                    {this.isLastMessageLeft(index)?(
                                        <img
                                        src = {this.currentPeerUser.url}
                                        />
                                    ):(
                                        <div></div>
                                    )}
                                    <div key = {item.timestamp}> 
                                    <img
                                src = {this.getImage(item.content)}
                                />
                                    </div>
                                    </div>
                                    {this.isLastMessageLeft(index)?(
                                    <span>
                                        <div>
                                            {moment(Number(item.timestamp)).format('HH:mm')}
                                        </div>
                                    </span>
                                ):null}
                                    </div>
                        )
                    }
                
                  
                }
               
            })
            return viewListMessage
        }
        else{
            return (
                <div>
                    <span>Say hi to new friends</span>
                </div>
            )
        }
    }
    getImage = (value)=>{
        switch(value){
            case 'animated1': return Images.animated1
            case 'animated2': return Images.animated2
            case 'animated3': return Images.animated3
            case 'animated4': return Images.animated4
            case 'animated5': return Images.animated5
            case 'animated6': return Images.animated6
            case 'animated7': return Images.animated7
        }
    }
    isLastMessageLeft(index){
        if(
            (index+1<this.listMessages.length && this.listMessages[index+1].idFrom === this.currentUserId)||
            index === this.listMessages.length - 1
                ){
                    return true
                }
                else{
                    return false
                }
    }
    isLastMessageRight(index){
        if(
            (index+1<this.listMessages.length && this.listMessages[index+1].idFrom !== this.currentUserId)||
            index === this.listMessages.length - 1
                ){
                    return true
                }
                else{
                    return false
                }
    }
        onChoosePhoto=event=>{
      if(event.target.files&&event.target.files[0]){
        this.setState({isLoading:true})
        this.currentPhotoFile=event.target.files[0]
        const prefixFiletype=event.target.files[0].type.toString()
        if(prefixFiletype.indexOf('image/')===0){
             this.uploadPhoto()
        }
        else{
          this.setState({isLoading:false})
          this.props.showToast(0,'this file is not an image')
        }
      }else{
        this.setState({isLoading:false})
      }
    }
    uploadPhoto=()=>{
      if(this.currentPhotoFile){
        const timestamp=moment()
        .valueOf()
        .toString()
        const uploadTask=Firebase.storage()
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile)
        uploadTask.on(
          LoginString.UPLOAD_CHANGED,
          null,
          err=>{
            this.setState({isLoading:false})
            this.props.showToast(0,err.message)
          },
          ()=>{
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
              this.setState({isLoading:false})
              this.onSendMessage(downloadURL,1)
            })
          }
        )
      }else{
        this.setState({isLoading:false})
        this.props.showToast(0,'file is null')
      }
    }
    render(){
        return(
            <div>
                <div>
                    <img src = {this.currentPeerUser.url}
                    style = {{height: '100px', width: '100px'}}
                    ></img>
                    <span>{this.currentPeerUser.name}</span>
                </div>
                <div>
                    {this.renderListMessages()}
                <div style = {{float: 'left', clear: 'both'}}
                ref = {el=>{
                    this.messagesEnd= el
                }}
                >
                    </div>
                    
                </div>
                <div>
                    {this.state.isShowSticker?this.renderStickers():null}
                </div>
                <div>
                    <img src = {Images.animated1} onClick = {()=>{this.refInput.click()}}></img>
                    <img 
              className="viewInputGallery"
               accept="images/*"
               type="file"
               onChange={this.onChoosePhoto}
             />
              <input
               ref={el=>{
                 this.refInput=el
               }}
               accept="image/"
              className="viewInputGallery"
              type="file"
              onChange={this.onChoosePhoto}
             />
                    <span onClick = {()=>{this.openListSticker()}}>Choose Sticker</span>
                    <input value= {this.state.inputValue}
                    onChange= {event=>{
                        this.setState({inputValue: event.target.value})
                    }}
                    onKeyPress = {this.onKeyPress}
                    />
                    <span onClick = {()=>{this.onSendMessage(this.state.inputValue, 0)}}>send</span>

                </div>
                {this.state.isLoading? (
                    <div
                    ReactLoading type = {'spin'}
                    height = {'3%'}
                    width = {'3%'}></div>
                ): ""}
            </div>
        )
    }
} 