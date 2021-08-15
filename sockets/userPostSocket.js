
const ON_PUSH_LOCATION = 'push message';
function conService(io, socket) {
    this.io = io;
    this.socket = socket;
    // let dataRecorder;
    this.push_Location = async (data)=> {
      console.log("push_Location", data)
        
    };
    // even for sender client
    this.send_getStatus = (statusData) =>{
      console.log('emmting soccket')
    };
    this.getmid = async (data)=>{
      
    }
    this.fileStatus = (fileData) =>{
      
    };
    this.fileReady = (fileData) =>{
      
    };
    this.loginStatus = (loginStatus) =>{
      
    };
    this.pushNotification = (message) => {
      
    };
    this.refresProfileURL =(data)=>{
      
    }
    this.saveUser = (data,profileUrl)=>{
      
    }
}

const userPostSocket = (io) => {
    io.on('connection', (socket) => {
      const con = new conService(io, socket);
      console.log('creating connection')
      socket.on(ON_PUSH_LOCATION, con.push_Location);
      socket.on('disconnect', ()=> {
      });
    });
  };
  
  module.exports = userPostSocket;