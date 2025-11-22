import { useState } from 'react'

const Header = () => <h1>give feedback</h1>
const Statistic = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
)
const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
)

const Contents = ({ good, neutral, bad }) => {
    const total = good + neutral + bad

    if (total === 0) {
        return (
            <div>
                <h2>statistics</h2>
                <p>No feedback given</p>
            </div>
        )
    }

    const average = (good - bad) / total
    const positive = (good / total) * 100

    return (
        <div>
            <h2>statistics</h2>
            <table>
                <tbody>
                    <Statistic text="good" value={good} />
                    <Statistic text="neutral" value={neutral} />
                    <Statistic text="bad" value={bad} />
                    <Statistic text="all" value={total} />
                    <Statistic text="average" value={average} />
                    <Statistic text="positive" value={positive + ' %'} />
                </tbody>
            </table>
        </div>
    )
}



const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [selected, setSelected] = useState(0)

    const handleAnecdote = () => {
        const randomIndex = Math.floor(Math.random() * anecdotes.length)
        setSelected(randomIndex)
    }


    return (
        <div>
            <Header />
            <div>
                <Button handleClick={() => setGood(good + 1) } text="good" />
                <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
                <Button handleClick={() => setBad(bad + 1)} text="bad" />
            </div>
            <br/>
            <br />
            <Contents good={good} neutral={neutral} bad={bad} />
            {anecdotes[selected]}
            <br />
            <Button handleClick={() => handleAnecdote()} text="Next Anecdote" />
        </div>
    )
}

export default App