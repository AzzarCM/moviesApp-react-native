import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {IconButton} from "react-native-paper"

import Home from "../screens/Home"
import Movie from "../screens/Movie"
import News from "../screens/News"
import Popular from "../screens/Popular"
import Search from "../screens/Search"



const Stack = createStackNavigator();

export default function StackNavigation(props){
    //console.log(props);
    const {navigation} = props;
    const buttonLeft = () =>{
        return(
            <IconButton
                icon="menu"
                onPress={()=> {navigation.openDrawer()}}
            />
        );
    };
    const buttonRight = () =>{
        return(
            <IconButton
                icon="magnify"
                onPress={()=> navigation.navigate("search")}
            />
        )
    }
    return(
        <Stack.Navigator>
        <Stack.Screen 
        name="home" 
        component={Home}
        options={{
            title: 'The Movie app',
            headerLeft: ()=>buttonLeft(),
            headerRight: ()=>buttonRight(),
        }}/>
        <Stack.Screen 
        name="movie" 
        component={Movie}
        options={{
            title: '',
            headerLeft: ()=>buttonLeft(),
            headerRight: ()=>buttonRight(),
            headerTransparent: true,
            }}/>
        <Stack.Screen 
        name="news" 
        component={News}
        options={{
            title: 'Nuevas peliculas',
            headerLeft: ()=>buttonLeft(),
            headerRight: ()=>buttonRight(),
            }}/>
        <Stack.Screen 
        name="popular" 
        component={Popular}
        options={{
            title: 'Peliculas populares',
            headerLeft: ()=>buttonLeft(),
            headerRight: ()=>buttonRight(),
            }}/>
        <Stack.Screen 
        name="search" 
        component={Search}
        options={{title: ''}}/>
        </Stack.Navigator>
    )
 
}