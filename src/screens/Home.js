import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { getNewsMoviesApi, getAllGenresApi, getGenreMoviesApi } from "../api/movies";
import { Title } from "react-native-paper"
import  { map } from "lodash"
import CarouselVertical from "../components/CarouselVertical"
import CarouselMulti from "../components/CarouselMulti";

export default function Home(props) {
    const [newMovies, setNewMovies] = useState(null);
    const [genreList, setGenreList] = useState([]);
    const [genreSelected, setgenreSelected] = useState(28)
    const [genreMovies, setGenreMovies] = useState(null)
    console.log(genreMovies);
    const {navigation} = props
    
    useEffect( () => {
        
       getNewsMoviesApi().then((res)=>{
           setNewMovies(res.results)
       })
       
    }, [])

    useEffect(() => {
        getAllGenresApi()
        .then((res)=>{
            setGenreList(res.genres);
        });
      
    }, []);

    useEffect(() => {
        getGenreMoviesApi(genreSelected)
        .then((res)=>{
            setGenreMovies(res.results)
        })
    }, [genreSelected]);
    const onChangeGenre = (newGenreId)=>{
        
        setgenreSelected(newGenreId);
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {newMovies && (
                <View style={styles.news}>
                    <Title style={styles.newsTitle}>Nuevas peliculas</Title>
                    <CarouselVertical navigation={navigation} data={newMovies}/>
                </View>
            )}
            
            <View style={styles.genres}>
                <Title style={styles.genresTitle}>Peliculas por genero</Title>
                <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.genresList}>
                    {map(genreList, (genero)=>(
                        <Text 
                        key={genero.id}
                        style={[styles.genre, {color: genero.id === genreSelected ? "#fff": "#8697a5"}]}
                        onPress={ () => onChangeGenre(genero.id)}
                        >
                            {genero.name}
                        </Text>
                    ))}
                </ScrollView>
                {genreMovies && (
                    <CarouselMulti data={genreMovies} navigation={navigation}/>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    news:{
        marginVertical: 10,
    },
    newsTitle:{
        marginBottom: 15,
        marginHorizontal: 20,
        fontWeight: "bold",
        fontSize: 24,
    },
    genres:{
        marginTop: 20,
        marginBottom: 50,

    },
    genresTitle:{
        marginHorizontal: 20,
        fontWeight: "bold",
        fontSize: 22,
    },
    genresList:{
        marginTop: 5,
        marginBottom: 15,
        padding: 10,
        paddingHorizontal: 20,
        
    },
    genre:{
        marginRight: 20,
        fontSize: 16,
    }
    
})
