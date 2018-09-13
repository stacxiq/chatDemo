import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { DataSnapshot } from '@firebase/database-types';

/*
  Generated class for the AdduserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdduserProvider {
  fireimage = firebase.database().ref('/profileimages');
  firedata = firebase.database().ref('/users');
    constructor(public afireauth: AngularFireAuth) {

    }
    adduser(newuser,job) {
      var promise = new Promise((resolve, reject) => {
        this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
          this.afireauth.auth.currentUser.updateProfile({
            displayName: newuser.displayName,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
          }).then(() => {
            this.firedata.child(this.afireauth.auth.currentUser.uid).set({
              uid: this.afireauth.auth.currentUser.uid,
              displayName: newuser.displayName,
              dob:newuser.DOB,
              job:newuser.job,
              phone:newuser.phone,
              email: this.afireauth.auth.currentUser.email,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'
            }).then(() => {
              resolve({ success: true });
              }).catch((err) => {
                reject(err);
            })
            }).catch((err) => {
              reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      })
      return promise;
    }

    /*
    For resetting the password of the user.
    Called from - passwordreset.ts
    Inputs - email of the user.
    Output - Promise.

     */

    passwordreset(email) {
      var promise = new Promise((resolve, reject) => {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      })
      return promise;
    }

    /*

    For updating the users collection and the firebase users list with
    the imageurl of the profile picture stored in firebase storage.
    Called from - profilepic.ts
    Inputs - Url of the image stored in firebase.
    OUtputs - Promise.

    */

    updateimage(imageurl) {
        var promise = new Promise((resolve, reject) => {
            this.afireauth.auth.currentUser.updateProfile({
                displayName: this.afireauth.auth.currentUser.displayName,
                photoURL: imageurl
            }).then(() => {
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
                displayName: this.afireauth.auth.currentUser.displayName,
                photoURL: imageurl,

                uid: firebase.auth().currentUser.uid
                }).then(() => {
                    resolve({ success: true });
                    }).catch((err) => {
                        reject(err);
                    })
            }).catch((err) => {
                  reject(err);
               })
        })
        return promise;
    }

    getuserdetails() {
      var promise = new Promise((resolve, reject) => {
      this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
        })
      })
      return promise;
    }
    getuserImage(){
      var promise = new Promise((resolve, reject) => {
        this.fireimage.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
          resolve(snapshot.val());
        }).catch((err) => {
          reject(err);
          })
        })
        return promise;
    }


    updatedisplayname(newname) {
      var promise = new Promise((resolve, reject) => {
        this.afireauth.auth.currentUser.updateProfile({
        displayName: newname,
        photoURL: this.afireauth.auth.currentUser.photoURL
      }).then(() => {
        this.firedata.child(firebase.auth().currentUser.uid).update({
          displayName: newname,
          photoURL: this.afireauth.auth.currentUser.photoURL,
          uid: this.afireauth.auth.currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
        }).catch((err) => {
          reject(err);
      })
      })
      return promise;
    }

    getallusers() {
      var promise = new Promise((resolve, reject) => {
        this.firedata.orderByChild('uid').once('value', (snapshot) => {
          let userdata = snapshot.val();
          let arr = [];
          for (var key in userdata) {
            arr.push(userdata[key]);
          }
          resolve(arr);
        }).catch((err) => {
          reject(err);
        })
      })
      return promise;
    }


  }


