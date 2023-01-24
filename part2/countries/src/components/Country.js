import axios from "axios";
import {useEffect, useState} from "react";
const Country = ({ country }) => {

    const [weather, setWeather] = useState(null)

    useEffect(() => {
        axios({
            method: 'get',
            baseURL: process.env.REACT_APP_BASE_URL,
            url: '/weather' +
                '?q=' + country.capital +
                '&units=metric'+
                '&appid=' + process.env.REACT_APP_API_KEY
            })
            .then(response => {
                console.log(response.data)
                setWeather(response.data)
            })
    }, [])

    return <>
        <h1>{country.name}</h1>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <h2>Languages</h2>
        <ul>
            {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.name + " flag"}/>
        {weather &&
            <div>
                <h2>Weather in {country.capital}</h2>
                <p>temperature {weather.main.temp} Celsius</p>
                <img src={process.env.REACT_APP_IMAGE_URL + weather.weather[0].icon + ".png"} alt={weather.weather[0].description}/>
                <p>wind {weather.wind.speed} m/s</p>
            </div>
        } </>
}

export default Country