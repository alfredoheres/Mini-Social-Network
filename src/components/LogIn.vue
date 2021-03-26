
<template lang="">
    <v-app>
        <v-container fill-height>
            <v-layout justify-space-around align-center row wrap fill-height>
                    
                
                    <v-card >
                        <v-card-title primary-title>
                        <div>
                            <h1 class="headline mb-0">Mini Social Network</h1>
                        </div>
                        </v-card-title>
                        <v-img
                        src="../assets/social-network.jpg"
                        aspect-ratio="1.75"
                        ></v-img>
                    </v-card>
                
                
                    <v-flex xs12 sm8 md6 justify-space-around align-center>
                        
                    
                    <h3 class="headline mb-0 text-center pa-5">Login to access</h3>
                    <v-form @submit.prevent="toLogIn">
                        <v-flex xs12 d-flex justify-center>
                            <v-flex xs10>
                                <v-text-field
                                    type="email"
                                    name="email"
                                    label="Mail"
                                    v-model="mailLogIn"
                                    required
                                ></v-text-field>
                                <v-text-field
                                    type="password"
                                    name="password"
                                    label="Password"
                                    v-model="passwordLogIn"
                                    required
                                ></v-text-field>
                            </v-flex>
                        </v-flex>
                        
                        <v-flex>
                            <v-layout class="pa-5" justify-center wrap>
                                <!------------------------- FIRST BTN LOG IN ----------------------->
                                <v-flex d-flex justify-center xs5>
                                    <v-btn  type="submit"  text large color="primary">Log In</v-btn>
                                </v-flex>
                                <!-------------------------- SECOND BTN SIGN UP --------------------->
                                <v-flex d-flex justify-center xs5>
                                    <v-btn @click="dialog = true" text large color="success">Sign Up</v-btn>
                                    <v-dialog v-model="dialog" max-width="290">
                                        <v-card>
                                            <v-card-title class="headline">Sign Up</v-card-title>
                                            <v-form @submit.prevent="toSignUp">
                                                <v-flex xs12 d-flex justify-center>
                                                    <v-flex xs10>
                                                        <v-text-field
                                                            type="email"
                                                            name="email"
                                                            label="Mail"
                                                            v-model="mailSignUp"
                                                            required
                                                        ></v-text-field>
                                                        <v-text-field
                                                            type="password"
                                                            name="password"
                                                            label="Password"
                                                            v-model="passwordSignUp"
                                                            required
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-flex>
                                                <v-flex d-flex justify-center xs5>
                                                    <v-btn class="ma-5"  type="submit" text large color="success">Sign Up</v-btn>
                                                </v-flex>
                                            </v-form>
                                            <v-alert
                                            :value="errorStateSignUp"
                                            color="error"
                                            icon="warning"
                                            outlined
                                            :dismissible="errorStateSignUp"
                                            >
                                            {{errorMessageSignUp}}
                                            </v-alert>
                                            
                                        </v-card>
                                    </v-dialog>
                                </v-flex>
                            </v-layout>
                            <v-alert
                            :value="errorStateLogIn"
                            color="error"
                            icon="warning"
                            outlined
                            :dismissible="errorStateLogIn"
                            >
                            {{errorMessageLogIn}}
                            </v-alert>
                        </v-flex>  
                    </v-form>
                    </v-flex>
                
                
            </v-layout>
        </v-container>  

    </v-app>
</template>

<script>
import firebase from "../utilities/firebase";
export default {
    data () {
      return{
          mailLogIn:"",
          passwordLogIn:"",
          mailSignUp:"",
          passwordSignUp:"",
          dialog: false,
          errorStateSignUp:false,
          errorStateLogIn:false,
          errorMessageSignUp:"",
          errorMessageLogIn:"",
      };
    },
    methods: {
        // ------------------------- LOG IN USER ---------------------------
        toLogIn(){
            this.errorStateLogIn=false;
            firebase.auth().signInWithEmailAndPassword(this.mailLogIn, this.passwordLogIn)
            .then((user) => {
                if(user){
                    this.mailLogIn="";
                    this.passwordLogIn="";
                }
                
            })
            .catch((error) => {
                this.errorStateLogIn=true;
                this.errorMessageLogIn=error.message;
            });

        },
        // ------------------------- SIGN UP USER ---------------------------
        toSignUp(){
            this.errorStateSignUp=false;
            firebase.auth().createUserWithEmailAndPassword(this.mailSignUp, this.passwordSignUp)
            .then(async (user) => {
                this.$store.commit('setFirstTimeTrue');
                this.$store.commit('setUID',user.user.uid); 
                console.log(firebase.auth().currentUser);
                // Add a USER in firebase
                firebase.firestore().collection("usersInformation").doc(this.$store.state.uid).set({
                    uid: this.$store.state.uid,
                })
                .then(() => {
                    
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
                this.dialog=false;
                this.mailSignUp="";
                this.passwordSignUp="";
            })
            .catch((error) => {   
                this.errorStateSignUp=true;
                this.errorMessageSignUp=error.message;
            });
        },
        
    },
}
</script>


<style scoped>
    
</style>

