import React from 'react'

export default class Welcome extends React.Component{
    constructor(props){
        super(props)
    }
    goToNewPost=()=>{
        console.log(this.props)
        this.props.props.history.push('/newPost')
    }
    render(){
        return(
            <div>
                <span onClick = {()=>this.goToNewPost()}>Write a new post here..</span>
            </div>
        )
    }
}