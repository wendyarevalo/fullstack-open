import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { useState } from 'react'

const Button = (props) => {
    return (
        <button onClick={props.action}>
            {props.text}
        </button>
    )
}
const Header = (props) => {
    return (
        <h1>{props.title}</h1>
    )
}

const Anecdote = (props) => {
    return (
        <div>
            <p>{props.anecdote}</p>
            <p>Has {props.votes} votes</p>
        </div>
    )
}


const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
    ]
    const points = new Uint8Array(anecdotes.length)

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(points)
    const handleSelectRandom = () => setSelected(Math.floor(Math.random() * (anecdotes.length)))

    const handlePoints = () => {
        const copy = [...votes]
        copy[selected] += 1;
        setVotes(copy)
    }

    const highestVotesIndex = votes.indexOf(Math.max(...votes));

    return (
        <div>
            <Header title="Anecdote of the day"/>
            <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]}/>
            <Button action={handlePoints} text="vote"/>
            <Button action={handleSelectRandom} text="next anecdote"/>
            <Header title="Anecdote with most votes"/>
            <Anecdote anecdote={anecdotes[highestVotesIndex]} votes={votes[highestVotesIndex]}/>
        </div>
    )
}
const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(<App />);