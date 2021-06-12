import { AsyncStorage } from "react-native";

export const storeToken= async (user)=> {
    try {
       await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
}

export const getToken= async () =>{
    let data
    try {
        let userData = await AsyncStorage.getItem("userData");
        data = JSON.parse(userData);
        return data
    } catch (error) {
        return data
    }
}