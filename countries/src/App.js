import React, {useState, useEffect} from 'react';
import axios from 'axios';
const App = () => {
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState([]);
    useEffect(()=>{
        axios.get('https://restcountries.eu/rest/v2/all').then((response)=>{
            setCountries(response.data);
            setFilteredCountries(response.data);
            console.log(response.data);
        })
    }, []);
    const findCountry = (event) => {
        setCountry(event.target.value);
        setFilteredCountries(countries.filter((country) => country.name.trim().toLowerCase().includes(event.target.value.trim().toLowerCase())));
    }
    const show = (name) => {
        return () => {
            setCountry(name);
            setFilteredCountries(countries.filter((country) => country.name.trim().toLowerCase().includes(name.trim().toLowerCase())));
        }
    }
    if(filteredCountries.length > 10){
        return(
            <div>find countries
                <input value={country} onChange={findCountry}></input>
                <p>Too many matches, specify another filter</p>
            </div>
            
        )
    }
    else if(filteredCountries.length <= 10 && filteredCountries.length > 1){
        return (
        <div>find countries
            <input value={country} onChange={findCountry}></input>
            {filteredCountries.map((country)=> 
                <div>
                    <p key={country.id}>{country.name}<button onClick={show(country.name)}>show</button></p>
                </div>
            )}
        </div>
        )
    }
    else{
        return(
            <div>find countries
                <input value={country} onChange={findCountry}></input>
                {filteredCountries.map((country)=> 
                <div>
                    <h2 key={country.id}>{country.name}</h2>
                    <p></p>
                    <p>capital {country.capital}</p>
                    <h2>languages</h2>
                    <ul>
                        {country.languages.map((language)=><li key={language.id}>{language.name}</li>)}
                    </ul>
                    <img src={country.flag}></img>
                </div>
                )}
            </div>
        )
    }
    
}
export default App