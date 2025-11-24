import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";

const Saved = () => {
  const router = useRouter();

  //pass a query to fetchMovie() function, which we pass to useFetch() hook
  const { data: movies,
    loading: moviesLoading,
    error: moviesError } = useFetch(() => fetchMovies({ query: '' }));

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0"/>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ minHeight: '100%', paddingBottom: 10}}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading ? ( //check whether we're currently loading movies using an "<ActivityIndicator />" component
          <ActivityIndicator
            size="large"
            color="#0000FF"
            className='mt-10 self-center'
          />

          ) : moviesError ? ( //if there's an error, show the error message
          <Text>Error: {moviesError?.message}</Text>

          ) : ( //else, show search bar & rest of content
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push('/search')}
              placeholder="Search for a movie"
            />

            <>
              <Text className='text-lg text-white font-bold mt-5 mb-3'>Latest Movies</Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => ( //use () to automatically return contents
                  <MovieCard
                    {...item}
                  />
                )}

                //helps React Native determine how many elements and where they're positioned
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'flex-start', gap: 20, paddingRight: 5, marginBottom: 10 }}
                showsVerticalScrollIndicator={false}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>


        )}

      </ScrollView>
    </View>
  );
}

export default Saved