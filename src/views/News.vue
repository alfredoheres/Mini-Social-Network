<template lang="">
    <v-app>
       <v-container >
           
            <v-layout row wrap justify-center align-center>
                <v-flex xs12>
                    <UploadPublication></UploadPublication>
                </v-flex>
                <v-flex xs12>
                    <v-card
                        class="mx-auto mt-2 mb-2"
                        color="#eeaa7b"
                        dark
                        v-for="(publication, index) in allPublicationData" :key="index"
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
                            </v-layout>
                            
                            
                        </v-card-title>

                        <v-card-text class="headline font-weight-bold">
                        {{publication.publicationText}}
                        </v-card-text>
                        <v-img
                        :src="publication.url"
                        >
                        </v-img>
                        <v-card-actions>
                        <v-list-item class="grow">
                            <v-list-item-avatar color="grey darken-3">
                            <v-img
                                class="elevation-6"
                                :src="publication.urlPro"
                            ></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                            <v-list-item-title>{{publication.name}}</v-list-item-title>
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
        return{
            publicationref:[],
            allPublicationData:[],
        };
    },
    components:{
        UploadPublication,
    },
    beforeMount(){
        let collectedRef=false;
        let collectedAllData=false;
        let docNames=[];
        let temData=[];
        let index=[];
        let tempallPublicationData=[];
        firebase.firestore().collection("refPost").get()
        .then((querySnapshot) => {
            let i=0;
            querySnapshot.forEach((doc) => {
                let temdata=doc.data();
                docNames[i]=doc.id;
                temData.unshift({date:temdata.date,
                                 uid:temdata.uid});
                index[i]=i;
                i++;
            });
           
            let randomIndex=[];
            let lengthIndex=index.length;
            for(let i=0;i<lengthIndex;i++){
                let aleatorio = Math.floor(Math.random()*(index.length));
                this.publicationref.unshift(temData[index[aleatorio]]);
                randomIndex[i]=index[aleatorio];
                index.splice(aleatorio,1);

            }
            collectedRef=true;
        })
        .catch((error)=>{
            console.log(error);
            collectedRef=true;
        })

        setTimeout(() => {
            if(collectedRef){
                
                for(let i=0;i<this.publicationref.length;i++){
                    firebase.firestore().collection(this.publicationref[i].uid).doc(this.publicationref[i].date).get()
                    .then((doc) => {
                        if (doc.exists) {
                            let temData=doc.data();
                            tempallPublicationData.unshift({publicationText:temData.publicationText,
                                                            url:temData.url,
                                                            name:temData.name,
                                                            urlPro:temData.urlPro});                            
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                }
                
                collectedAllData=true;
            }
        }, 1000);
        setTimeout(() => {
            this.allPublicationData=tempallPublicationData;
        }, 2000);
        if(collectedAllData){
            // console.log(collectedAllData)
        }
    }
}
</script>
<style lang="">
    
</style>