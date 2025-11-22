import { useState } from 'react'

const Header = () => <h1>give feedback</h1>
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

const Statistic = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
)

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <Header />
            <div>
                <Button handleClick={() => setGood(good + 1) } text="good" />
                <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
                <Button handleClick={() => setBad(bad + 1)} text="bad" />
            </div>
            <br/>
            <Statistic text="good" value={good} />
            <Statistic text="neutral" value={neutral} />
            <Statistic text="bad" value={bad} />

            <br />
            <Contents good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App