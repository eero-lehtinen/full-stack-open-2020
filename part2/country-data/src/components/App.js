import React, { useState, useEffect } from 'react'
import axios from 'axios'

const weather_api_key = process.env.REACT_APP_WEATHER_STACK_API_KEY

const Filter = ({ handleChange }) => (
	<div>find countries<input onChange={handleChange} /></div>
)

const Weather = ({ place }) => {
	const [weather, setWeather] = useState({})

	useEffect(() => {
		axios.get(`http://api.weatherstack.com/current?access_key=${weather_api_key}&query=${place}&units=m`)
			.then(response => {
				setWeather(response.data)
			})
	}, [place])

	console.log(weather)

	if (Object.keys(weather).length !== 0) {
		const curWeather = weather.current
		return (
			<>
				<h2>Weather in {place}</h2>
				<div><strong>temperature: </strong>{curWeather.temperature} Celsius</div>
				<img height={80} src={curWeather.weather_icons}
					alt={curWeather.weather_descriptions} />
				<div><strong>wind: </strong> {curWeather.wind_speed} km/h direction {curWeather.wind_dir}</div>
			</>
		)
	}
	else {
		return (<></>)
	}
}



const DetailedCountry = ({ country }) => (
	<div>
		<h1>{country.name}</h1>
		<div>capital {country.capital}</div>
		<div>population {country.population}</div>
		<h2>languages</h2>
		<ul>
			{country.languages.map(lang => <li key={lang.name}>{lang.name}</li>)}
		</ul>
		<img height={150} src={country.flag} alt={`flag of ${country.name}`} />
		<Weather place={country.capital} />
	</div>
)

const Country = ({ country, setFilter }) => (
	<div>
		<span>{country.name}</span>
		<button onClick={() => setFilter(country.name)}>show</button>
	</div>
)

const Countries = ({ countries, filter, setFilter }) => {
	let shownCountries = []

	if (filter !== '')
		shownCountries = countries.filter(person =>
			person.name.toLowerCase().includes(filter.toLowerCase()))

	if (shownCountries.length === 1) {
		return (
			<DetailedCountry country={shownCountries[0]} />
		)
	}
	else if (shownCountries.length <= 10) {
		return (
			<>
				{shownCountries.map(country =>
					<Country key={country.name} country={country} setFilter={setFilter} />)}
			</>
		)
	}
	else {
		return (
			<div>Too many matches specify another filter</div>
		)
	}
}


const App = () => {
	const [countries, setCountries] = useState([])
	const [filter, setFilter] = useState('')

	useEffect(() => {
		axios.get('https://restcountries.eu/rest/v2/all')
			.then(response => {
				setCountries(response.data)
			})
	}, [])

	return (
		<div>
			<Filter handleChange={event => setFilter(event.target.value)} />
			<Countries countries={countries} filter={filter} setFilter={setFilter} />
		</div>
	)

}

export default App