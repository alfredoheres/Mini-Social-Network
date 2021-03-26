<template lang="">
    <div>
        <v-app>
            <v-container >
                <v-layout justify-center row wrap>
                    
                
                <v-flex xs11 sm8>
                    
                
                <h1 class="text-center font-weight-light font-italic">Custom your Profile</h1>
                <validation-observer
                    ref="observer"
                    v-slot="{ invalid }"
                >
                    <form @submit.prevent="submit">
                    <validation-provider
                        v-slot="{ errors }"
                        name="Name"
                        rules="required|max:35"
                    >
                        <v-text-field
                        v-model="name"
                        :counter="35"
                        :error-messages="errors"
                        label="Name"
                        required
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider
                        v-slot="{ errors }"
                        name="Age"
                        rules="required|max:2"
                    >
                        <v-text-field
                        v-model="age"
                        :counter="2"
                        :error-messages="errors"
                        label="Age"
                        required
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider
                        v-slot="{ errors }"
                        name="phoneNumber"
                        :rules="{
                        required: true,
                        digits: 10,
                        
                        }"
                    >
                        <v-text-field
                        v-model="phoneNumber"
                        :counter="10"
                        :error-messages="errors"
                        label="Phone Number"
                        required
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider
                        v-slot="{ errors }"
                        name="select"
                        rules="required"
                    >
                        <v-select
                        v-model="select"
                        :items="items"
                        :error-messages="errors"
                        label="Select"
                        data-vv-name="select"
                        required
                        ></v-select>
                    </validation-provider>


                    <validation-provider
                        v-slot="{ errors }"
                        name="select"
                        rules="required"
                    >
                    <v-file-input
                    
                        :error-messages="errors"
                        accept="image/png, image/jpeg"
                        placeholder="Pick an profile picture"
                        prepend-icon="mdi-camera"
                        label="Profile Picture"
                        v-model="files"
                        required
                    ></v-file-input>
                    </validation-provider>
                    <v-btn
                        text
                        color="success"
                        class="mr-4"
                        type="submit"
                        :disabled="invalid"
                    >
                        submit
                    </v-btn>
                    <v-btn @click="clear" text class="mr-4">
                        clear
                    </v-btn>
                    <v-btn v-on:click="toLogOut" text  color="error">Log Out</v-btn>
                    </form>
                </validation-observer>
                </v-flex>
                </v-layout>
            </v-container>
        </v-app>
        
        
    </div>
</template>
<script>
import firebase from "../utilities/firebase";
import { required, digits, max, regex } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

  setInteractionMode('eager')

  extend('digits', {
    ...digits,
    message: '{_field_} needs to be {length} digits. ({_value_})',
  })

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('regex', {
    ...regex,
    message: '{_field_} {_value_} does not match {regex}',
  })
import Vuex from 'vuex'
export default {
    // --------------------------COMPUTED---------------------------------
    computed:{
        ...Vuex.mapState(['uid']),
    },
    // --------------------------METHODS---------------------------------
    methods:{
        toLogOut(){
            firebase.auth().signOut().then(() => {
            console.log("Log out successful");
            }).catch((error) => {
            console.log(error);
            });
        },
        
        uploadImg(){

            let storageRef = firebase.storage().ref();
            let userUid = this.$store.state.uid;
            
            let  uploadTask = storageRef.child('usersPicture/' + userUid +'/').put(this.files);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
                    console.log(snapshot)
                    
                }, 
                function(error) {
                    console.log(error);
                    
                }, function() {

                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                        firebase.firestore().collection("usersInformation").doc(userUid).update({
                            url:downloadURL
                        })
                        .then(() => {
                            
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                            
                        });
                    });

                }   
            );
            
                        
            
            
        },
        uploadData (){
            firebase.firestore().collection("usersInformation").doc(this.$store.state.uid).update({
            name: this.name,
            age: this.age,
            phoneNumber: this.phoneNumber,
            gender: this.select
            })
            .then(() => {
                
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                
            });
        },
        submit () {

        this.$refs.observer.validate();

        this.uploadImg();
        this.uploadData();

        setTimeout(() => {
            this.$store.commit('setHome');
        }, 3000);

      },
      clear () {
        this.name = ''
        this.age = ''
        this.phoneNumber = ''
        this.select = null
        this.$refs.observer.reset()
      },
     },
     // --------------------------COMPONENTS---------------------------------
    components: {
    ValidationProvider,
    ValidationObserver,
    },
    // --------------------------DATA---------------------------------
    data: () => ({
      name: '',
      age:'',
      phoneNumber: '',
      select: null,
      items: [
        'Female',
        'Male',
      ],
      files: [],
      first: [],
    }),
}
</script>
<style lang="">
    
</style>