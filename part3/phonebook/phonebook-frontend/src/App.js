import {useEffect, useState} from 'react'
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from './services/persons'
import Notification from "./components/Notification";

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setFilterName] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const clearMessageAfterSeconds = () => setTimeout(() => {
        setNotificationMessage(null)
    }, 5000)

    useEffect(() => {
        personService.getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])
    const personsToShow = () => {
        if(filterName !== ""){
            return persons.filter(person => person.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase()))
        }
        return persons
    }
    const addName = (event) => {
        event.preventDefault()

        if (persons.filter(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase()).length !== 0){
            updateNumber()
        }else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            personService.create(personObject).then(returnedPerson => {
                personService.create(personObject)
                    .then(returnedPerson => {
                        setPersons(persons.concat(returnedPerson))
                        setNotificationMessage(`Added ${returnedPerson.name}`)
                        clearMessageAfterSeconds()
                    })
            }).catch(error => {
                setNotificationMessage(error.response.data.error)
                clearMessageAfterSeconds()
            })
        }
        setNewName('')
        setNewNumber('')

    }
    const updateNumber = () => {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
            const person = persons.find(person => person.name.toLocaleLowerCase() === newName.toLocaleLowerCase())
            const changedPerson = { ...person, number: newNumber }
            personService.update(person.id,changedPerson)
                .then(returnedPerson => {
                    setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
                    setNotificationMessage(`Updated number of ${returnedPerson.name} to ${returnedPerson.number}`)
                    clearMessageAfterSeconds()
                }).catch(error => {
                setNotificationMessage(`Information of ${person.name} has been already removed from the server`)
                clearMessageAfterSeconds()
                setPersons(persons.filter(p => p.id !== person.id))
            })
        }
    }
    const deletePerson = person => {
        if(window.confirm(`Delete ${person.name} ?`)){
            personService.remove(person.id).then().catch(error => {
                setNotificationMessage(`Information of ${person.name} has been already removed from the server`)
                clearMessageAfterSeconds()
            })
            setPersons(persons.filter(p => p.id !== person.id))
        }
    }
    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)
    const handleFilterName = (event) => setFilterName(event.target.value);

    return (
        <div>
            <h1>Phonebook</h1>
            {notificationMessage &&
                <Notification message={notificationMessage} />}
            <Filter
                filterName = {filterName}
                handleFilterName = {handleFilterName}
            />

            <h3>Add a new</h3>
            <PersonForm
                addName={addName}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
                newName={newName}
                newNumber={newNumber}
            />

            <h2>Numbers</h2>
            <Persons persons={personsToShow()}
                     deletePerson = {deletePerson}
            />

        </div>
    )
}

export default App
