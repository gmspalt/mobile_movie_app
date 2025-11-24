import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'


  const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  //pass a query to fetchMovie() function, which we pass to useFetch() hook
  const { data: movies, 
    loading, 
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ 
    query: searchQuery
  }), false) //pass "false" to prevent automatic fetch on mount

  useEffect(() => {
    const timeoutId = setTimeout(async () => { //wrap in async function to use "await"
      if(searchQuery.trim()) {
        await loadMovies(); //fetch movies when searchQuery changes & is not empty
      } else {
        reset(); //clear movies when searchQuery is empty
      }
    }, 500); //delay of 500ms for debounce effect

    return () => clearTimeout(timeoutId); //cleanup timeout on unmount or before next effect
  }, [searchQuery]);


  return (
    <View className="flex-1 bg-primary">{/* change background color */}
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"/>{/* set background image */}

      <FlatList 
        data={movies} //if no movies, pass empty array
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()} // get unique key for each item
        className="px-5"
        numColumns={3} // display items in 3 columns
        columnWrapperStyle={{ justifyContent: 'center', gap: 16, marginVertical: 16 }} // style for each row
        contentContainerStyle={{ paddingBottom: 100 }} // style for the whole list
        ListHeaderComponent={ //make search bar displayed at the top of the list
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">{/* Logo at the top of list */}
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">{/* Search Bar btw/ Logo and list */}
              <SearchBar 
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && ( //If movies are being loaded: show loading indicator
              <ActivityIndicator size="large" color="#0000FF" className="my-3" />
            )}
            {error && ( //If there's an error: show error message
              <Text className="text-red-500 px-5 my-3">Error: {error.message}</Text>
            )}
            {!loading && !error && searchQuery.trim() && movies?.length > 0 && ( //If no movies found: show message
              <Text className="text-xl text-white font-bold">
                Search Results for{' '}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={ //if no movies found after search: display('No movies found.')
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? 'No movies found.' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />

    </View>
  )
}

export default Search