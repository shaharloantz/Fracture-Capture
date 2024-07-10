import axios from 'axios'
import {createContext,useState,useEffect} from 'react'

export const userContext = createContext()

export function UserContextProvider({childern}){
    const [user,setUser] = useState(null);
    useEffect(() => {  // evrey time we go to another page we cam tell if there is a user and if not
        if (!user){
            axios.get('/profile').then(({data}) => {
                setUser(data)
            })
        }
    },[])
    return (
        <UserContext.Provider value={[user, setUser]}>
            {childern}
        </UserContext.Provider>
    )
}