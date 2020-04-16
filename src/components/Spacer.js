import React,{useState} from 'react'
import {View,Text,StyleSheet,ScrollView} from 'react-native'

const Spacer = ({children})=>{
    

    return( 
    <View style= {styles.spacer}>
        {children}        
    </View>);
}


 const styles = StyleSheet.create({
     spacer:{
         margin:15
     }
 });

 export default Spacer;