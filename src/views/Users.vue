<template lang="">
    <div>
        <v-layout justify-center row>
            <v-flex xs11>
            <v-card v-for="(user, index) in usersData" :key="index">
                <v-list two-line>

                        <v-list-item>
                        <v-list-item-avatar>
                            <v-img :src="user.url"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title >{{user.name}}</v-list-item-title>
                            <v-list-item-subtitle >{{user.gender}}</v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>
                </v-list>
            </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import firebase from "../utilities/firebase";
export default {
    data(){
        return {
            usersData:[],
        };
    },
    beforeMount(){
        
        firebase.firestore().collection("usersInformation").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data=doc.data()
                let toUserData={name:data.name,
                                url:data.url,
                                gender:data.gender};
                this.usersData.unshift(toUserData);
            });
        });

    },

}
</script>
<style lang="">
    
</style>