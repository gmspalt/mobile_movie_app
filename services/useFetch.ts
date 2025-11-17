import { useEffect, useState } from "react";



const useFetch = <T>(fetchFucntion: () => Promise<T>, autofetch = true) => {

    // State variables
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try { //try to fetch data

            //set loading to true and error to null
            setLoading(true);
            setError(null);

            const result = await fetchFucntion(); //call the fetch function

            setData(result); //set data state variable to result of fetch function

        } catch (err) {
            // @ts-ignore
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }finally { //after fetching is done, set loading to false
            setLoading(false);
        }
    }

    const reset = () => { //after fetching, reset state variables
        setData(null);
        setError(null);
        setLoading(false);
    }

    //"A useEffect hook" is called with you want to do something at the start of you component load
    useEffect(() => {

        //if autofetch is true, call fetchData function
        if (autofetch) {
            fetchData();
        }

    }, [])

    return { data, loading, error, refetch: fetchData, reset }; //return everything
}

export default useFetch;