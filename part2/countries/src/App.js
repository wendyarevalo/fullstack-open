import {useEffect, useState} from "react";
import axios from "axios";
import Filter from "./components/Filter";
import Countries from "./components/Countries";

function App() {
  const [countries, setCountries] = useState([])
  const [filterCountry, setFilterCountry] = useState('')

  useEffect(() => {
    axios
        .get('https://restcountries.com/v2/all')
        .then(response => {
          setCountries(response.data)
        })
  }, [])

  const handleFilterCountry = (event) => {
      setFilterCountry(event.target.value);
  }

    const countriesToShow = () => {
        if(filterCountry !== ""){
            const toShow = countries.filter(country => country.name.toLocaleLowerCase().includes(filterCountry.toLocaleLowerCase()))
            if (toShow.length > 10){
                return "To many matches, specify another filter"
            }
            return toShow
        }
        return []
    }

  return (
    <div>
        <Filter
            filterCountry={filterCountry}
            handleFilterCountry={handleFilterCountry}
        />
        <Countries countries={countriesToShow()}
            setFilterCountry={setFilterCountry}
        />
    </div>
  );
}

export default App;
