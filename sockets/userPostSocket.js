
const ON_PUSH_LOCATION = 'push message';
const POSTS_DATA = 'posts list';
const UserPosts = require('../models/UserPosts');
const mongoose = require('mongoose');


function conService(io, socket) {
    this.io = io;
    this.socket = socket;
    // let dataRecorder;
    this.push_Location = async (data)=> {
      this.send_posts(data)
    };
    // even for sender client
    this.send_posts = async (leagueId) =>{
      try{
        const userPostDetails = await UserPosts.aggregate([
          {
            $match: {
              leagueId: mongoose.Types.ObjectId(leagueId),
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $unwind: {
              path: '$userDetails',
            },
          },
          {
            $project: {
              'userDetails.userType': 0,
              'userDetails.userStatus': 0,
              'userDetails.password': 0,
              'userDetails.created': 0,
              'userDetails.updated': 0,
              'userDetails.__v': 0,
              'userDetails.resetPasswordToken': 0,
              'userDetails.resetPasswordExpire': 0,
              userId: 0,
              __v: 0,
            },
          },
        ]);
        this.socket.emit(POSTS_DATA,userPostDetails);
      }catch(err){
        console.log(err);
      }
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