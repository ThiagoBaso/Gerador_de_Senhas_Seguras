//import { useState } from 'react'
import './App.css'

function App() {

  type PasswordOptions = {
    useLower: boolean
    useUpper: boolean
    useNumbers: boolean
    useSymbols: boolean
  }

  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const options: PasswordOptions = {
  useLower: true,
  useUpper: false,
  useNumbers: true,
  useSymbols: false
  }
  
  function getRandonInt( max: number): number {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
  }

  function geraPassword(length: number, options: PasswordOptions): string {
    const {useLower, useUpper, useNumbers, useSymbols} = options

    let charset = ""
    const password: string[] = []

    if(useLower) charset += lower
    if(useUpper) charset += upper
    if(useNumbers) charset += numbers
    if(useSymbols) charset += symbols

    if(!charset || length <= 0) return ""

    if(useLower) password.push(lower[getRandonInt(lower.length)])
    if(useNumbers) password.push(numbers[getRandonInt(numbers.length)])
    if(useSymbols) password.push(symbols[getRandonInt(symbols.length)])
    if(useUpper) password.push(upper[getRandonInt(upper.length)])

    while (password.length < length) {
      password.push(charset[getRandonInt(charset.length)])
    }

    for(let i = password.length - 1; i>0; i--) {
      const j = getRandonInt(i + 1)
      ;[password[i], password[j]] = [password[j], password[i]]
    }

    return password.join("")
  }

  console.log(geraPassword(16, options))

  return (
    <div className='main'>
      <p>pass</p>
    </div>
  )
}

export default App
