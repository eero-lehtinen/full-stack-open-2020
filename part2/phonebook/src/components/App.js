import React, { useState, useEffect } from 'react'
import personService from '../services/personService'


const Filter = ({ handleChange }) => (
	<div>filter shown with<input onChange={handleChange} /></div>
)

const PersonForm = ({ handleNameChange, handleNumberChange, addPerson }) => (
	<form>
		<div>name: <input onChange={handleNameChange} /></div>
		<div>number: <input onChange={handleNumberChange} /></div>
		<div><button type='submit' onClick={addPerson}>add</button></div>
	</form>
)

const Persons = ({ persons, filter, deleteHandler }) => {
	const shownPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
	return (
		<div>
			{shownPersons.map(person =>
				<div key={person.id}>
					<span>{person.name} {person.number} </span>
					<button onClick={() => deleteHandler(person.id)}>delete</button>
				</div>
			)}
		</div>
	)
}

const Notification = ({ notification }) => {
	if (notification.message === undefined) {
		return null
	}

	return (
		<div className={notification.isError ? 'error' : 'info'}>
			{notification.message}
		</div>
	)
}


const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')
	const [notification, setNotification] = useState({})


	useEffect(() => {
		personService.getAll().then(returnedPersons => setPersons(returnedPersons))
	}, [])

	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const showNotification = (message, isError) => {
		setNotification({ message: message, isError: isError })
		setTimeout(() => {
			setNotification({})
		}, 5000)
	}

	const addPerson = (event) => {
		event.preventDefault()
		if (persons.some(person => person.name === newName)) {
			const result = window.confirm(`${newName} is already added to phonebook, `
				+ 'replace the old number with a new one?')

			if (result) {
				let id = persons.find(person => person.name === newName).id
				personService.update(id, { name: newName, number: newNumber }).then(returnedPerson => {
					setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
					showNotification(`Replaced ${returnedPerson.name}`, false)
				}).catch(error => {
					setPersons(persons.filter(person => person.id !== id))
					showNotification(`Information of ${newName} doesn't exist in server`, true)
				})
			}
			return
		}

		let newPerson = { name: newName, number: newNumber }
		personService.create(newPerson).then(returnedPerson => {
			setPersons(persons.concat(returnedPerson))
			showNotification(`Added ${returnedPerson.name}`, false)
		}).catch(error => {
			showNotification(`Couldn't add ${newPerson.name} to database`, true)
		})
	}

	const deletePerson = (id) => {
		const personName = persons.find(person => person.id === id).name
		const result = window.confirm(`Delete ${personName}?`)

		if (result) {
			personService.del(id).then(() => {
				setPersons(persons.filter(person => person.id !== id))
				showNotification(`Deleted ${personName}`, false)
			}).catch(error => {
				setPersons(persons.filter(person => person.id !== id))
				showNotification(`Information of ${personName} has already been removed from server`, true)
			})
		}
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification notification={notification} />
			<Filter handleChange={event => setFilter(event.target.value)} />
			<h2>add a new</h2>
			<PersonForm handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange} addPerson={addPerson} />
			<h2>Numbers</h2>
			<Persons persons={persons} filter={filter} deleteHandler={deletePerson} />
		</div>
	)

}

export default App