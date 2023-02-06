const Person = ({ person, deletePerson }) => {
    return(
        <>
            <li>{person.name}: {person.number} <button onClick={deletePerson.bind(this,person)}>delete</button>
            </li>
        </>
    )

}

export default Person