import React, {useEffect, useState} from 'react'
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback } from 'react-native'
import { getPopularMovieApi } from "../api/movies"
import { Text, Title, Button } from "react-native-paper"
import { map } from "lodash"
import { BASE_PATH_IMG } from "../utils/constants"
import defaultImage from "../assets/png/default-imgage.png"
import {Rating} from "react-native-ratings"
import starDark from "../assets/png/starDark.png";
import starLight from "../assets/png/starLight.png";
import usePreferences from "../hooks/usePreferences";
export default function Popular(props) {

   
    const { navigation } = props;
    const [movies, setMovies] = useState(null);
    const {theme} = usePreferences();
    const [showBtnMore, setShowBtnMore] = useState(true);
    const [page, setPage] = useState(1)
    useEffect(() => {
       getPopularMovieApi(page)
        .then((res)=>{
            const totalPages = res.total_pages;
            if(page<totalPages){
                if(!movies){
                    setMovies(res.results)
                }else{
                    setMovies([...movies, ...res.results]);
                }
            }else{
                setShowBtnMore(false);
            }
        });
    }, [page]);
    return (
        <ScrollView>
            {map(movies, (movie, index)=>(
                <Movie key={index} movie={movie} theme={theme} navigation={navigation}/>
            ))}
            
            {showBtnMore && (
                <Button
                    mode="contained"
                    contentStyle={styles.loadMoreContainer}
                    style={styles.loadMore}
                    labelStyle={{color: theme === "dark" ? "#fff" : "#000"}}
                    onPress={()=> setPage(page + 1)}
                >
                    Cargar Mas...
                </Button>
            )}
        </ScrollView>
    )
}

function Movie(props) {
    const { movie, theme, navigation } = props;
    const {
        poster_path, 
        title, 
        release_date,
        vote_count,
        vote_average,
        id,
    } = movie;

    const goMovie = () =>{
        navigation.navigate("movie", {id});
    }
    

    return(
        <TouchableWithoutFeedback onPress={goMovie}>
        <View style={styles.movie}>
            <View style={styles.left}>
                <Image 
                    style={styles.image}
                    source={poster_path ? { uri: `${BASE_PATH_IMG}/w500${poster_path}`} : {defaultImage}}
                    />
            </View>
            <View style={styles.right}>
                <Title>{title}</Title>
                <Text>{release_date}</Text>
                <MovieRating theme={theme} vote_count={vote_count} vote_average={vote_average}/>
    
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

function MovieRating(props) {
    const {theme, vote_average, vote_count} = props
    const media = vote_average/2;


    return(
        <View style={styles.viewRating}>
            <Rating
                type="custom"
                ratingImage={theme === "dark" ? starDark : starLight}
                ratingColor="#ffc205"
                ratingBackgroundColor={theme ==="dark"?"#192734":"#f0f0f0"}
                startingValue={media}
                imageSize={20}
                style={{marginRight: 15}}
            />
            <Text style={{fontSize: 12, color: "#8697a5", marginTop: 5}}>
                {vote_count} votos
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    movie:{
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    left:{
        marginRight: 20,

    },
    viewRating:{
        alignItems:"flex-start",
        justifyContent: "flex-start",
        marginTop: 10,
    },
    image:{
        width: 100,
        height: 150,
    },
    loadMoreContainer:{
        paddingTop: 10,
        paddingBottom: 20,
    },
    loadMore:{
        backgroundColor: "transparent"
    }   
})
