<template lang="">
    <v-app>
       <v-container >
           
            <v-layout row wrap justify-center align-center>
                <v-flex mb-5 xs12>
                    <UploadPublication></UploadPublication>
                </v-flex>
                <v-flex xs12>
                    <v-card
                        class="mx-auto mt-2 mb-2"
                        color="#eeaa7b"
                        dark
                        v-for="(publication, index) in publicationData" :key="index"
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
                                    <v-btn @click="removePost(index)" color="error" fab small dark>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                            
                            
                        </v-card-title>

                        <v-card-text class="headline font-weight-bold">
                        {{publication.publicationText}}
                        </v-card-text>
                        <v-img
                        :src="publication.urlPost"
                        >
                        </v-img>
                        <v-card-actions>
                        <v-list-item class="grow">
                            <v-list-item-avatar color="grey darken-3">
                            <v-img
                                class="elevation-6"
                                :src="urlProfile"
                            ></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                            <v-list-item-title>{{name}}</v-list-item-title>
                            </v-list-item-content>

                            <v-layout
                            align-center
                            justify-end
                            >
                            <v-icon class="mr-1">mdi-heart</v-icon>
                            <span class="subheading mr-2">256</span>
                            </v-layout>
                            </v-list-item>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
            
        </v-container> 
    </v-app>
</template>
<script>
import UploadPublication from "../components/UploadPublication";
import firebase from "../utilities/firebase";
export default {
    data(){
        return {
            publicationData:[],
            name:"",
            urlProfile:"", 
        };
        
    },
    components:{
        UploadPublication
    },
    methods:{
        removePost(index){
                        
            if(this.publicationData[index].urlPost!==""){
                firebase.storage().ref().child(this.$store.state.uid+'/' + this.publicationData[index].datePost +'/'+'publicationIMG/').delete().then(() => {
                    
                }).catch(function(error) {
                console.log(error)
                });
            }

            firebase.firestore().collection(this.$store.state.uid).doc(this.publicationData[index].datePost).delete().then(() => {
                this.publicationData.splice(index,1)
                
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

            firebase.firestore().collection("refPost").doc(this.$store.state.uid+'-'+this.publicationData[index].datePost).delete().then(() => {
                this.publicationData.splice(index,1)
                
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
            
            setTimeout(() => {
                console.log("to reload")
                location.reload();
            }, 2000);
            
        },
    },
    beforeMount(){
        this.name=this.$store.state.name;
            this.urlProfile=this.$store.state.urlProfile;
        firebase.firestore().collection(this.$store.state.uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let iData=doc.data();
                let iData2={publicationText:iData.publicationText,
                            datePost:iData.datePost,
                            urlPost:iData.url};
                this.publicationData.unshift(iData2); 
            });    
        });
        
    }
}
</script>
<style lang="">
    
</style>