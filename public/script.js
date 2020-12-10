const socket = io('/')
const videoGrid = document.getElementById('video-grid')
// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '3001'
// })

const myPeer=new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(stream => {
  userVideoStream=stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  
  
  socket.on('user-connected', userId => {
    console.log("User Connected " + userId)
    connectToNewUser(userId, stream)
  })

})



socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})





function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}




function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

const playa =()=>
{
  
    playStop();
 
}
  const playStop = ()=> {
    let enabled=userVideoStream.getVideoTracks()[0].enabled;
    if(enabled)
    {
      setPlayVideo()
      userVideoStream.getVideoTracks()[0].enabled=false; 
    }
    else{
      setStopVideo()
      userVideoStream.getVideoTracks()[0].enabled=true; 
    }
    
    }

    // const playStop1 = ()=> {
    //   let enabled=userVideoStream.getVideoTracks()[0].enabled;
    //   if(enabled)
    //   {
    //     setPlayVideo()
    //     userVideoStream.getVideoTracks()[0].enabled=false; 
    //   }
      
    //   }

 

const setStopVideo =() =>{
  const html = `
    <i class="fas fa-video" ></i>
    <span> Stop Video </span>
  `
  document.querySelector('.main__video_button').innerHTML=html;
}

const setPlayVideo =() =>{
  const html = `
    <i class="stop fas fa-video-slash" ></i>
    <span> Play Video </span>
  `
  document.querySelector('.main__video_button').innerHTML=html;
}