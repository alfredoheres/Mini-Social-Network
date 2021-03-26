

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentComponent:"Loading",
    uid:"",
    name:"",
    urlProfile:"",
    firstTime:false,
  },
  mutations: {
    setLogIn (state) {
        state.currentComponent="LogIn";
    },
    setHome (state){
        state.currentComponent="Home";  
    },
    setFirstEdit (state){
        state.currentComponent="FirstEdit";  
    },
    setUID (state,iuid) {
        state.uid=iuid;
    },
    setFirstTimeTrue (state) {
        state.firstTime=true;
    },
    setFirstTimeFalse (state) {
        state.firstTime=false;
    },
    setName (state,name){
      state.name=name;
    },
    setUrlProfile (state,url){
      state.urlProfile=url;
    },
  }
})

export default store



