import { useState, useEffect } from 'react'
import notificationAudio from './assets/notification.mp3'

function App() {

  const [time, setTime] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [notice, setNotice] = useState('')
  const notification = new Audio(notificationAudio)

  //CHECK IF LOCALSTORAGE HAS TIME
  useEffect(() => {

    const ls_time = localStorage.getItem('time')

    if (ls_time && validate(ls_time)) {
      setTime(ls_time)
      setIsRunning(true)
    }

  }, [])

  // HANDLING COUNTDOWN TIME
  useEffect(() => {

    let intervalId

    if (isRunning) {

      const currentTime = new Date()
      const selectedTime = new Date(time)

      localStorage.setItem('time', time)

      let diff = selectedTime.getTime() - currentTime.getTime()

      intervalId = setInterval(() => {

        diff = diff - 1000
        const formattedTime = formatTime(diff)

        if (formattedTime.days <= 0 && formattedTime.hours <= 0 && formattedTime.minutes <= 0 && formattedTime.seconds <= 0) {
          clearInterval(intervalId)
          setIsRunning(false)
          setTime('')
          setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          setNotice(`🎉The countdown is over! What's next on your adventure? 🎉`)
          notification.play()
          localStorage.removeItem('time')
        }

        setRemainingTime(formattedTime)

      }, 1000)
    }

    return () => clearInterval(intervalId)

  }, [isRunning])

  // HANDLING FORM SUBMITION
  const handleSubmit = (e) => {
    e.preventDefault()

    if (isRunning) {
      setIsRunning(prevState => !prevState)
      setTime('')
      setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      localStorage.removeItem('time')
    }
    else if (validate(time)) {

      setIsRunning(true)

    }

  }

  // FORMATING DATE TIME
  const formatTime = (diff) => {

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const total_hours = Math.floor(diff / (1000 * 60 * 60))
    const total_minutes = Math.floor(diff / (1000 * 60))
    const total_seconds = Math.floor(diff / 1000)

    return { days: days, hours: total_hours % 24, minutes: total_minutes % 60, seconds: total_seconds % 60 }
  }

  // VALIDATE SELECTED TIME
  const validate = (datetime) => {
    const selectedTime = new Date(datetime)

    if (selectedTime == 'Invalid Date') {
      return false
    }

    const currentTime = new Date()
    const diff = selectedTime.getTime() - currentTime.getTime()

    if (diff <= 0) {
      setNotice('Kindly choose a date and time from the future')
      return false
    }

    if (formatTime(diff).days > 99) {
      setNotice('Selected time is more than 100 days')
      return false
    }

    setNotice('')
    return true

  }

  return (
    <div className='container'>
      <h1>Countdown <span>Timer</span></h1>
      <form onSubmit={handleSubmit}>
        <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} disabled={isRunning} required />
        <button type="submit">{!isRunning ? 'Start Timer' : 'Cancel Timer'}</button>
      </form>

      {notice && <p className='notification'>{notice}</p>}

      {!notice && (
        <div className='count-wrapper'>

          <div>
            <h3>{remainingTime.days}</h3>
            <p>Days</p>
          </div>

          <div>
            <h3>{remainingTime.hours}</h3>
            <p>Hours</p>
          </div>

          <div>
            <h3>{remainingTime.minutes}</h3>
            <p>Minutes</p>
          </div>

          <div>
            <h3>{remainingTime.seconds}</h3>
            <p>Seconds</p>
          </div>

        </div>
      )}

    </div>
  );
}

export default App;