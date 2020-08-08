import React from 'react'
import './Profile.css'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../services/firebase'
import LoginString from '../Login/LoginStrings'

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            aboutMe: localStorage.getItem(LoginString.DESCRIPTION),
            documentkey: localStorage.getItem(LoginString.FIREBASE_ID),
            id: localStorage.getItem(LoginString.ID),
            name: localStorage.getItem(LoginString.NAME),
            photoUrl: localStorage.getItem(LoginString.PHOTOURL)
        }
        this.newPhoto = ''
    }

    componentDidMount(){
        if(!localStorage.getItem(LoginString.ID)){
            this.props.history.push('/')
        }
    }

    onChangePhoto(event){
        if(event.target.files && event.target.files[0]){
            const prefixFileType = event.target.files[0].type.toString();
            console.log(prefixFileType)
            if(prefixFileType.indexOf(LoginString.PREFIX_IMAGE)!=0){
                this.props.showToast(0, "This file is not an image")
                return
            }
            this.newPhoto = event.target.files[0]
            this.setState({
                photoUrl: URL.createObjectURL(event.target.files[0])
            })
        }
        else{
            this.props.showToast(0, "Something wrong with input file")
        }
    }
    uploadInfo(){
        if(this.newPhoto){
            console.log(this.newPhoto)
            const uploadTask = firebase.storage().ref().child(this.state.id).put(this.newPhoto)
            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err=>{
                    this.props.showToast(0, err.message)
                },
                ()=>{
                uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl=>{
                    console.log("Download Url"+downloadUrl)
                    this.updatedUserInfo(true, downloadUrl)
                })
                })
        }
        else{
            this.updatedUserInfo(false, null)
        }
    }
    updatedUserInfo = (isUpdatedPhotoUrl, downloadUrl)=>{
        let newinfo
        if(isUpdatedPhotoUrl){
            newinfo = {
                name: this.state.name,
                description: this.state.aboutMe,
                url: downloadUrl,

            }
        }
        else{
            newinfo = {
                name: this.state.name,
                description: this.state.aboutMe,
            }
        }
        firebase.firestore().collection('users').doc(this.state.documentkey).update(newinfo).then(data=>{
            localStorage.setItem(LoginString.NAME, this.state.name)
            localStorage.setItem(LoginString.DESCRIPTION, this.state.aboutMe)
            if(isUpdatedPhotoUrl){
                localStorage.setItem(LoginString.PHOTOURL, downloadUrl)
            }
            this.props.showToast(1, "Update info success")
        })

    }
    onChangeName(event){
        this.setState({
            name: event.target.value
        })
    }

    onChangeAboutMe(event){
        this.setState({
            aboutMe: event.target.value
        })
    }
    render(){
        return(
            <div>
                <h2>Profile</h2>
                {/* {this.state.photoUrl} */}
                <img src = {this.state.photoUrl}
                  onClick = {()=>{this.refInput.click()}}
                  style = {{height: '200px', width: '200px'}}  />
                <input ref= {el=>{
                    // console.log(el)
                    this.refInput = el
                }}
                accept = 'image/**'
                type = 'file'
                onChange = {this.onChangePhoto.bind(this)}
                />

                <span>Name</span>
                <input 
                value = {this.state.name? this.state.name: ""}
                onChange = {this.onChangeName.bind(this)}
                />
                
                <span>About Me</span>
                <input 
                value = {this.state.aboutMe? this.state.aboutMe: ""}
                onChange = {this.onChangeAboutMe.bind(this)}
                />

                <button onClick = {this.uploadInfo.bind(this)}>Save</button>
                <button onClick = {()=>{this.props.history.push('/chat')}}>Back</button>

                {this.state.isLoading?(
                    <div>
                        <ReactLoading type = {'spin'}
                        color = {'blue'}
                        height = {'3%'}
                        width = {'3%'}
                        ></ReactLoading>
                    </div>
                ): null}
            </div>
        )
    }
}