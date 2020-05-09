import React, { useState, useEffect } from 'react'
import axios from 'axios'


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


const Persons = ({ persons, filter }) => {
  const shownPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <>
      {shownPersons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat({ name: newName, number: newNumber }))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChange={event => setFilter(event.target.value)} />
      <h2>add a new</h2>
      <PersonForm handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App