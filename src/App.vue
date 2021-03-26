<template lang="">
  <v-app>
    <component v-bind:is="this.$store.state.currentComponent"></component>
  </v-app>
</template>
<script>
import LogIn from "./components/LogIn";
import Home from "./components/Home";
import Loading from "./components/Loading";
import FirstEdit from "./components/FirstEdit";
import firebase from "./utilities/firebase";
export default {
  data(){
    return{
      // currentComponent:"LogIn",
    };
  },
  components:{
    LogIn,
    Home,
    FirstEdit,
    Loading,
  },
  
  created(){
      firebase.auth().onAuthStateChanged(async (user) =>{
        if (user) {
          
          this.$store.commit('setUID',user.uid);
           let docRef = firebase.firestore().collection("usersInformation").doc(this.$store.state.uid);

            docRef.get().then((doc) => {
                if (doc.exists) {
                  if(doc.data().name==undefined){
                    this.$store.commit('setFirstEdit');
                  }else{
                    this.$store.commit('setHome');
                  }
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
          
        } else {
          this.$store.commit('setLogIn')          
        }
      });
  },
}
</script>
<style scoped>
  
</style>