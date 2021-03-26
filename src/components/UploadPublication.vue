<template lang="">

        <div class="uploadPostContainer">
            <v-container >
           
                <v-layout row wrap justify-center align-center>
                    
                    <v-flex xs12>
                        <v-card
                            class="mx-auto mt-2 mb-2"
                            color="#eeaa7b"
                            dark
                        >
                            <v-card-title>
                                <v-layout justify-space-between row>
                                    <v-flex>
                                        <v-icon
                                            large
                                            left
                                        >
                                            mdi-account
                                        </v-icon>
                                        <span class="title font-weight-light">Social Network</span>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-list-item-avatar>
                                            <v-img :src="ProfileIMG"></v-img>
                                        </v-list-item-avatar>
                                    </v-flex>
                                </v-layout>
                                
                                
                            </v-card-title>

                            <v-card-text class="headline font-weight-bold">
                                <div class="img-publication">
                                <v-file-input
                                :rules="rules"
                                accept="image/png, image/jpeg"
                                placeholder="Pick an avatar"
                                prepend-icon="mdi-camera"
                                label="Upload an image"
                                class="input-image-publication"
                                v-model="publicationIMG"
                                ></v-file-input>
                                </div>
                                 <v-textarea
                                filled
                                label="What are you thinking?"
                                auto-grow
                                v-model="publicationText"
                                ></v-textarea>
                            </v-card-text>
                            
                            <v-card-actions>
                            <v-list-item class="grow">
                                <v-layout row wrap>
                                <v-flex xs10>
                                    <v-btn
                                    rounded
                                    color="primary"
                                    dark
                                    large
                                    :disabled="btnDisabled"
                                    class="mb-5"
                                    v-on:click="uploadPublication"
                                    >
                                    Post
                                    </v-btn>
                                </v-flex>
                                <v-flex xs10>
                                    <v-alert
                                        :value="infoStatePost"
                                        color="info"
                                        icon="info"
                                        outlined
                                        :dismissible="infoStatePost"
                                        >
                                        Wait while the file is uploading...
                                    </v-alert>
                                    <v-alert
                                        :value="errorStatePost"
                                        color="error"
                                        icon="warning"
                                        outlined
                                        :dismissible="errorStatePost"
                                        >
                                        Error, please try again
                                    </v-alert>
                                    <v-alert
                                        :value="successStatePost"
                                        color="success"
                                        icon="check_circle"
                                        outlined
                                        :dismissible="successStatePost"
                                        >
                                        Post successful loaded
                                    </v-alert>     
                                </v-flex>
                                </v-layout>
                            </v-list-item>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
                
            </v-container>
        </div>
        
    
</template>
<script>
import firebase from "../utilities/firebase";
export default {
    data: () => ({
        rules: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
        ],
        publicationText:"",
        publicationIMG:null,

        infoStatePost:false,
        errorStatePost:false,
        successStatePost:false,

        ProfileIMG:"",
        btnDisabled:false,
    }),
    methods:{
        uploadPublication(){
            this.btnDisabled=true;
            let localName= this.$store.state.name;
            let localUrlPro= this.$store.state.urlProfile;
            let localUid = this.$store.state.uid;
            let localPublicationText = this.publicationText;
            let localDate = new Date();
            let localDateString=localDate.toString();
            let localLike = false;
            let localCountLikes = 0;

            let uploadState=false;

            this.infoStatePost=false;
            this.errorStatePost=false;
            this.successStatePost=false;
       
            this.infoStatePost=true;

            if(this.publicationIMG != null){
                
                let  uploadTask = firebase.storage().ref().child(localUid+'/' + localDateString +'/'+'publicationIMG/').put(this.publicationIMG);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
                        console.log(snapshot);  
                    }, 
                    function(error) {
                        console.log(error);
                    }, function() {
                        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            firebase.firestore().collection(localUid).doc(localDateString).set({
                                url : downloadURL,
                                uid : localUid,
                                publicationText : localPublicationText, 
                                like : localLike,
                                countLikes : localCountLikes,
                                datePost : localDateString,
                                name:localName,
                                urlPro:localUrlPro, 
                            })
                            .then(() => {
                                uploadState=true;
                            })
                            .catch((error) => {
                                console.error("Error adding document: ", error);
                                
                            });
                        });

                    }   
                );
                setTimeout(() => {
                    if(uploadState){
                        this.publicationText="";
                        this.publicationIMG=null;

                        this.successStatePost=true;
                        this.infoStatePost=false;
                        location.reload();
                    }
                    else{
                        this.errorStatePost=true;
                        this.infoStatePost=false;
                    }
                    this.btnDisabled=false;
                }, 5000);
            }
            else{
                
                firebase.firestore().collection(localUid).doc(localDateString).set({
                    url : "",
                    uid : localUid,
                    publicationText : localPublicationText, 
                    like : localLike,
                    countLikes : localCountLikes,
                    datePost : localDateString,
                    name:localName,
                    urlPro:localUrlPro, 
                })
                .then(() => {
                    this.publicationText="";
                    this.publicationIMG=null;
                    this.successStatePost=true;
                    this.infoStatePost=false;

                    this.btnDisabled=false;
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    this.errorStatePost=true;
                    this.infoStatePost=false;

                    this.btnDisabled=false;
                }); 
                
                
            }
            
            firebase.firestore().collection("refPost").doc(localUid+'-'+localDateString).set({
                    uid : localUid,
                    date : localDateString, 
                })
                .then(() => {
                    
                })
                .catch((error) => {
                   console.log(error); 
                }); 

        }
    },
    beforeMount(){
        this.ProfileIMG=this.$store.state.urlProfile;
    }
}
</script>
<style>
    .img-publication{
        height: 86px !important;
        overflow: hidden;
    }
    /* .uploadPostContainer{
        display: flex;
        
        justify-content: center;
    } */
   
</style>