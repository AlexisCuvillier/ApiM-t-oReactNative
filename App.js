import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import * as Location from "expo-location";
import { useEffect, useState } from "react";
import axios from "axios";
import CurrentWeather from "./components/CurrentWeather";

const API_URL = (lat, lon) =>
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0f6a550169f000ed4ff3bdb220b4f8a0&lang=fr&units=metric`;

export default function App() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const getCoordinate = async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }
            const userLocation = await Location.getCurrentPositionAsync();
            getWeather(userLocation);
        };

        getCoordinate();
    }, []);

    const getWeather = async (location) => {
        try {
            const response = await axios.get(
                API_URL(location.coords.latitude, location.coords.longitude)
            );
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.log("Erreur dans getWeather");
        }
    };

    if (loading) {
        return (
            <View style={style.container}>
                <ActivityIndicator/>
            </View>
        );
    }
    return (
        <View style={style.container}>
            <CurrentWeather data={data}/>
        </View>

    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 8,
        alignItems: "center",
    },
});
