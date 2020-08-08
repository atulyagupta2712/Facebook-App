import React from 'react'
import Images from '../../ProjectImages/ProjectImages'
import moment from 'moment'
import Firebase from '../../services/firebase'
import LoginString from '../Login/LoginStrings'

export default class Post extends React.Component{
    constructor(props){
        super(props)
        this.currentUserPhoto = localStorage.getItem('photoUrl')
        this.currentUserName = localStorage.getItem('name')
        this.firebaseKey = localStorage.getItem('firebase_id')
        this.photoUploadUrl = ''
        this.state = {
            postContent: '',
            isShowSticker :false,
            feeling: false,
            feelingEmotion: '',
            sticker: '',
            uploadPhoto: ''
        }
    }
    showFeelings=()=>{
        return(
            <div>
                <button onClick = {()=>{this.describeFeeling('Happy', 3)}}>Happy</button>
                <button onClick = {()=>{this.describeFeeling('Sad', 3)}}>Sad</button>
                <button onClick = {()=>{this.describeFeeling('Loved', 3)}}>Loved</button>
            </div>
        )
    }
    describeFeeling = (input, value)=>{
        this.setState({
            feeling: false,
            feelingEmotion: input
        })
    }
    handleInput(event){
        this.setState({
            postContent: event.target.value
        })
    }

    openStickers = ()=>{
        this.setState({
            isShowSticker: !this.state.isShowSticker
        })
    }
    renderStickers = ()=>{
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
          const time=moment()
          .valueOf()
          .toString()
          const uploadTask=Firebase.storage()
          .ref()
          .child(time)
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
        //   this.props.showToast(0,'file is null')
        }
    }
   
    onSendMessage = (input,value)=>{
        if(value == 2){
            this.setState({
                isShowSticker: false,
                sticker: input,
                stickerUrl: this.getImage(input)
                // uploadPhoto: this.currentPhotoFile
                // postContent: this.state.postContent [<img style = {{height: '100px', width: '100px'}} src = {this.getImage(input)}></img>]
            },()=>{
                console.log(this.state.postContent)
            })
           
        }
        if(value == 1){
            console.log("hii")
            this.setState({
                uploadPhoto: input
            },()=>{
                console.log('upload', this.state.uploadPhoto)
            })

        }
        
       
    }

    getImage=(value)=>{
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

    feelingOrActivity = ()=>{
        this.setState({feeling: true})
    }
    postData = ()=>{
        if(this.state.postContent.trim() == '' && !this.state.feelingEmotion && !this.state.sticker && !this.state.uploadPhoto){
            alert("Write something so that it can be posted")
            return
        } 
        const timestamp = moment().valueOf().toString()
       
        const itemMessage = {
            feelingEmotion: this.state.feelingEmotion,
            postContent: this.state.postContent.trim(),
            timestamp: timestamp,
            sticker: this.state.sticker,
            photo: this.photoUploadUrl
        }
        Firebase.firestore().collection('posts').doc(this.firebaseKey)
        .collection(this.firebaseKey).doc(timestamp).set(itemMessage).then(()=>{
            // this.setState({inputValue :''})
            this.props.showToast(1, "Post uploaded successfully")
            this.setState({
                postContent: '',
                stickerUrl: '',
                uploadPhoto: ''
            })
        })
    }

    render(){
        return(
            <div>
                NEW POST
                <br></br>
                <img style = {{height: '100px', width: '100px'}} src = {this.currentUserPhoto}></img>
        <span>{this.currentUserName} {this.state.feelingEmotion? "is feeling "+this.state.feelingEmotion: ""}</span>
        {this.state.feeling? this.showFeelings():
       <div>
           <textarea placeholder = "What's on your mind??" value = {this.state.postContent} onChange = {this.handleInput.bind(this)}>
                   
                    </textarea>
                    {/* {this.state.uploadPhoto} */}
                    <div>
                        {/* <h1>hey</h1> */}
                        {this.state.postContent} 
                        <img src = {this.state.stickerUrl}/>
                        {this.state.uploadPhoto?  <img style = {{height: '100px', width: '100px'}} src =  {this.state.uploadPhoto}/>: ''}
                      
                    </div>
                   
                    {this.state.isShowSticker? this.renderStickers(): null}
                    <button onClick = {()=>{this.openStickers()}}>Choose Sticker</button>
                    <button onClick = {this.feelingOrActivity.bind(this)}>Feeling/Activity</button>
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
        </div>
        
        }
        <button onClick = {()=>{this.postData()}}>Submit</button>
                
            </div>
        )
    }
}