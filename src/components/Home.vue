<template lang="">
    
    <v-app id="inspire">
        <!------------------------ NAVIGATION BAR ------------------------------>
        <v-app-bar
        app
        color="white"
        flat
        >
        
        <v-btn id="btndrawer" icon small @click="drawer=!drawer" >
            <v-icon>account_circle</v-icon>
        </v-btn>
        
        <v-tabs
            centered
            class="ml-n9"
            color="grey darken-1"
        >
            <v-tab
            v-for="(link,index) in links"
            :key="index"
            >
            <router-link :to="link.route">{{ link.name }}</router-link>
            </v-tab>
        </v-tabs>

        
        </v-app-bar>
        <!-------------------------------- NAVIGATION DRAWER------------------ -->
        <v-navigation-drawer
        v-model="drawer"
        app
        >
        <v-sheet
            color="grey lighten-4"
            class="pa-4"
        >
            <v-avatar
            class="mb-4"
            color="grey darken-1"
            size="128"
            >
            <v-img :src="url"></v-img>
            </v-avatar>

            
            <div>{{name}}</div>
            <div>{{age}}</div>
            <div>{{gender}}</div>
        </v-sheet>

        <v-divider></v-divider>
        <v-layout class="mt5" row wrap>
            <v-flex class="mt-5" xs12>
            <v-btn v-on:click="toLogOut"  color="error">Log out</v-btn>
            </v-flex>
            <v-flex class="mt-5" xs12>
            <v-btn @click="dialog = true"  color="error">Detele Account</v-btn>
            <v-dialog v-model="dialog" max-width="290">
                <v-card>
                    <v-flex xs12>
                        
                    
                    <v-alert
                    :value="true"
                    type="error"
                    >
                    Are you sure you want to delete your account?
                    <v-form @submit.prevent="deleteAccount">
                        <v-flex xs10 d-flex justify-center>
                            <v-flex xs10>
                                <v-text-field
                                    type="email"
                                    name="email"
                                    label="Mail"
                                    v-model="mailSignIn"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    type="password"
                                    name="password"
                                    label="Password"
                                    v-model="passwordSignIn"
                                    required
                                ></v-text-field>
                            </v-flex>
                        </v-flex>
                        <v-flex d-flex justify-center xs5>
                            <v-btn type="submit"  color="warning">Delete</v-btn>
                            <v-btn   text @click="dialog = false" color="teal">Cancel</v-btn>
                        </v-flex>
                    </v-form>
                    
                    </v-alert> 
                    </v-flex>                                       
                </v-card>
            </v-dialog>
            </v-flex>
            
        </v-layout>
        
        
        
        </v-navigation-drawer>

        <v-main>
            <v-container
                class="py-8 px-6"
                fluid
            >
                <v-row>
                <v-col
                    
                    cols="12"
                >
                    <v-card>
                    <v-container >
                        <v-layout row wrap>
                            <v-flex class="pt-2" 12 justify-center align-center>
                                <router-view></router-view>
                            </v-flex>
                        </v-layout>
                        
                    </v-container>
                    
                    
                    </v-card>
                </v-col>
                </v-row>
            </v-container>
        </v-main>
  </v-app>                                                     
        
    
</template>
<script>
import firebase from "../utilities/firebase";
export default {
    data: () => ({
      dialog: false,
      drawer: null,
      links: [
        {name:'News',route:'/'},
        {name:'My Posts',route:'/my-posts'},
        {name:'Users',route:'/users'},
      ],
      url:"",
      name:"",
      gender:"",
      age:"",

      mailSignIn:"",
      passwordSignIn:"",
    }),
     methods:{
         toLogOut(){
            firebase.auth().signOut().then(() => {
            console.log("Log out successful");
            }).catch((error) => {
            console.log(error);
            });
        },
        deleteAccount(){

            firebase.auth().signInWithEmailAndPassword(this.mailSignIn, this.passwordSignIn)
            .then((user) => {
                if(user){
                    this.mailSignIn="";
                    this.passwordSignIn="";

                    firebase.auth().currentUser.delete().then(function() {
                    // User deleted.
                    }).catch(function(error) {
                    console.log(error)
                    });
                }
                
            })
            .catch((error) => {
                this.errorMessageLogIn=error.message;
            });

            // firebase.firestore().collection("refPost").where("uid", "==", this.$store.state.uid)
            // .get()
            // .then((querySnapshot) => {
            //     querySnapshot.forEach((doc) => {
            //         let tempData=doc.data();
            //         console.log(doc.id, " => ", doc.data());
            //         firebase.firestore().collection("refPost").doc(tempData.uid +"-" + tempData.date).delete().then(() => {
                    
            //         }).catch((error) => {
            //             console.error("Error removing document: ", error);
            //         });
            //     });
            // })
            // .catch((error) => {
            //     console.log("Error getting documents: ", error);
            // });

            // firebase.firestore().collection("usersInformation").doc(this.$store.state.uid).delete()
            // .then(() => {
                    
            // }).catch((error) => {
            //     console.error("Error removing document: ", error);
            // });

              

            

        }
     },
     mounted(){

        firebase.firestore().collection("usersInformation").doc(this.$store.state.uid).get()
        .then((doc) => {
            if (doc.exists) {
                let information=doc.data();
                this.url=information.url;
                this.name=information.name;
                this.age=information.age;
                this.gender=information.gender;

                this.$store.commit('setName',information.name);
                this.$store.commit('setUrlProfile',information.url);

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

     },
}
</script>
<style >
    .v-tab a{
    width: 100%;
    height: 100%;
    text-decoration: none;
    padding: auto;

    }
    #btndrawer{
        position: relative;
        z-index: 1000;
    }
</style>