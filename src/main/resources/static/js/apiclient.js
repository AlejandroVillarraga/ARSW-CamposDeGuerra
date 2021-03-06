/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var apiclient = (function () {

    return {
        
        postUser: function (user) {
            return $.ajax({
                url: "/CamposDeGuerra/Usuarios/", 
                type: "POST", 
                data: JSON.stringify(user), 
                contentType: "application/json"});
        },   
        deleteUser: function (user) {
            return $.ajax({
                url: "/CamposDeGuerra/Usuarios/"+user, 
                type: "DELETE"});
        },
        putUser: function (user) {
            return $.ajax({
                url: "/CamposDeGuerra/Usuarios/", 
                type: "PUT", 
                data: JSON.stringify(user), 
                contentType: "application/json"});
        },
        getUser: function (user,callback) {
            return $.get("/CamposDeGuerra/Usuarios/"+user, callback);
        },
        postUserRoom: function (room,user) {
            return $.ajax({
                url: "/CamposDeGuerra/Rooms/"+room, 
                type: "POST", 
                data: JSON.stringify(user), 
                contentType: "application/json"});
        },   
        deleteUserRoom: function (room,user) {
            return $.ajax({
                url: "/CamposDeGuerra/Rooms/"+room+"/"+user, 
                type: "DELETE"});
        },
        deleteAllUsersRoom: function (room) {
            return $.ajax({
                url: "/CamposDeGuerra/Rooms/"+room, 
                type: "DELETE"});
        },
        getRoom: function (room,callback) {
            return $.get("/CamposDeGuerra/Rooms/"+room,callback);
        },
        getTeamARoom: function (room,callback) {
            return $.get("/CamposDeGuerra/Rooms/"+room+"/TeamA",callback);
        },
        getTeamBRoom: function (room,callback) {
            return $.get("/CamposDeGuerra/Rooms/"+room+"/TeamB",callback);
        },
        getMyTeam: function (user,room,callback) {
            return $.get("/CamposDeGuerra/Rooms/"+room+"/Teams/"+user,callback);
        },
        getFreeRoom: function (callback) {
            return $.get("/CamposDeGuerra/Rooms/free",callback);
        }
        
        
    };
    
}());

