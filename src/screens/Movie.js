import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import { getMovieById } from "../api/movies"
import {BASE_PATH_IMG} from "../utils/constants"
import ModalVideo from "../components/ModalVideo"
import { Rating } from "react-native-ratings";
import {Text, Title, IconButton} from "react-native-paper"
import starDark from "../assets/png/starDark.png";
import starLight from "../assets/png/starLight.png";
import usePreferences from "../hooks/usePreferences";

import {map} from "lodash"

export default function Movie(props) {
    
    const { route } = props;
    const { id } = route.params;
    const [movie, setMovie] = useState(null)

  
    const [showVideo, setshowVideo] = useState(false)
    
    useEffect(() => {
        getMovieById(id)
        .then((res)=>{
            setMovie(res);
        })
    }, []);

    if(!movie) return null //para que no nos de null poster_path
    
    return (
        <>
        <ScrollView>
            <MovieImage posterPath={movie.poster_path}/>
            <MovieTrailer setshowVideo={setshowVideo}/>
            <MovieTitle movie={movie}/>
            <MovieRating voteAverage={movie.vote_average} voteCount={movie.vote_count}/>
            <Text style={styles.overview}>{movie.overview}</Text>
            <Text style={[styles.overview, {marginBottom: 20}]}>
                Fecha de lanzamiento: {movie.release_date}
            </Text>
        </ScrollView>
        <ModalVideo show={showVideo} setShow={setshowVideo} idMovie={id}/>
       
        </>
    )
}

function MovieImage(props){
    const { posterPath } = props;
    return(
        <View style={styles.viewPoster}>
            <Image style={styles.poster} source={{uri: `${BASE_PATH_IMG}/w500${posterPath}`}} />
        </View>
    )
}

function MovieTrailer(props) {
    const { setshowVideo } = props;
    return(
        <View style={styles.viewPlay}>
            <IconButton
                icon="play"
                color="#000"
                size={30}
                style={styles.play}
                onPress={()=>setshowVideo(true)}
            />
        </View>
    )
}

function MovieTitle(props){
    const {movie} = props
    console.log(movie.genres);
    return (
        <View style={styles.viewInfo}>
            <Title>{movie.title}</Title>
            <View style={styles.viewGenres}>
                {map(movie.genres, (genero)=>(
                    <Text key={genero.id} style={styles.genre}>
                        {genero.name}
                    </Text>
                ))}
            </View>
        </View>
    )
}

function MovieRating(props) {
    const {voteCount, voteAverage} = props;
    const media = voteAverage/2;
    const { theme } = usePreferences();
    return (
        <View style={styles.viewRating}>
            <Rating
                type="custom"
                ratingImage={theme === "dark" ? starDark : starLight}
                ratingColor="#ffc205"
                ratingBackgroundColor={theme==="dark" ? "#192734" : "#f0f0f0"}
                startingValue={media}
                imageSize={20}
                style={{marginRight: 15}}
            />
            <Text style={{fontSize: 16, marginRight: 5,}}>{media}</Text>
            <Text style={{fontSize: 12, color: "#8697a5"}}>{voteCount} votos</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewPoster:{
        shadowColor: "#000",
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity:1,
        textShadowRadius: 10,
    },
    poster:{
        width: "100%",
        height: 500,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    viewPlay:{
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    play:{
        backgroundColor: "#fff",
        marginTop: -40,
        marginRight: 30,
        width: 60,
        height: 60,
        borderRadius: 100,
    },
    viewGenres:{
        flexDirection: "row",
    },
    genre:{
        marginRight: 10,
        color: "#8697a5"
    },
    viewInfo:{
        marginLeft: 20,
    },
    viewRating:{
        marginHorizontal: 30,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    overview:{
        marginHorizontal: 30,
        marginTop: 20,
        textAlign: "justify",
        color: "#8697a5"
    }
})
