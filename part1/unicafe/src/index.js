import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
    return (
        <h1>{props.title}</h1>
    )
}

const Button = (props) => {
    return (
        <button onClick={props.action}>
            {props.text}
        </button>
    )
}

const Statistic = (props) => {
    return (
        <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
        </tr>
    )
}
const Statistics = (props) => {
    const {good, neutral, bad} = props.votes;
    const allVotes = good + neutral + bad;
    const average = (good * 1 + bad * -1 + neutral * 0)/allVotes;
    const positive = (good * 100) / allVotes;
    if (allVotes !== 0)
        return (
            <table>
                <tbody>
                    <Statistic text="good" value={good}/>
                    <Statistic text="neutral" value={neutral}/>
                    <Statistic text="bad" value={bad}/>
                    <Statistic text="all" value={allVotes}/>
                    <Statistic text="average" value={average}/>
                    <Statistic text="positive" value={positive + " %"}/>
                </tbody>
            </table>
        )
    return (
        <p>No feedback given</p>
    )
}

const App = () => {

    const [votes, setVotes] = useState({
        good:0,
        neutral:0,
        bad:0
    })
    const handleGoodVote = () => setVotes({...votes, good: votes.good + 1})
    const handleNeutralVote = () => setVotes({...votes, neutral: votes.neutral + 1})
    const handleBadVote = () => setVotes({...votes, bad: votes.bad + 1})

    return (
        <div>
            <Header title="give feedback"/>
            <Button action={handleGoodVote} text="good"/>
            <Button action={handleNeutralVote} text="neutral"/>
            <Button action={handleBadVote} text="bad"/>
            <Header title="statistics"/>
            <Statistics votes={votes}/>
        </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)