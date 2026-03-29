import { Checkbox, Label, Button, ClipboardWithIconText, TextInput  } from "flowbite-react";
import { useState } from "react";

function App() {

  const [pass, setPass] = useState('')
  const [passLength, setPassLength] = useState(16)
  const [checkedItems, setCheckedItems] = useState({ useLower: true, useUpper: false, useNumbers: true, useSymbols: false });
  const [passHistory, setPassHistory] = useState<string[]>([])


  const handleChange = (event: any) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  

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
    useLower: checkedItems.useLower,
    useUpper: checkedItems.useUpper,
    useNumbers: checkedItems.useNumbers,
    useSymbols: checkedItems.useSymbols
  }

  function getRandonInt(max: number): number {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % max
  }

  function geraPassword(length: number, options: PasswordOptions) {
    const { useLower, useUpper, useNumbers, useSymbols } = options

    let charset = ""
    const password: string[] = []

    if (useLower) charset += lower
    if (useUpper) charset += upper
    if (useNumbers) charset += numbers
    if (useSymbols) charset += symbols

    if (useLower) password.push(lower[getRandonInt(lower.length)])
    if (useNumbers) password.push(numbers[getRandonInt(numbers.length)])
    if (useSymbols) password.push(symbols[getRandonInt(symbols.length)])
    if (useUpper) password.push(upper[getRandonInt(upper.length)])

    if (!charset || length <= 0 || password.length > length) {
      alert('Parametros Invalidos')
      return ""
    }

    while (password.length < length) {
      password.push(charset[getRandonInt(charset.length)])
    }

    for (let i = password.length - 1; i > 0; i--) {
      const j = getRandonInt(i + 1)
        ;[password[i], password[j]] = [password[j], password[i]]
    }

    setPass(password.join(''))
    setPassHistory(passHistory => [...passHistory, password.join('')])
  }

  console.log(passHistory)



  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-auto h-2/3 rounded-xl flex items-center flex-col gap-4 p-10 border-green-300 border-4">
        <h1 className="text-xl">Gerador de Senha</h1>
        <div className="flex items-center gap-2">
          <Checkbox id="lower" name="useLower" onChange={handleChange} checked={checkedItems.useLower}/>
          <Label htmlFor="lower">Lower</Label>
          <Checkbox id="upper" name="useUpper" onChange={handleChange} checked={checkedItems.useUpper}/>
          <Label htmlFor="upper">Upper</Label>
          <Checkbox id="numbers" name="useNumbers" onChange={handleChange} checked={checkedItems.useNumbers}/>
          <Label htmlFor="numbers">Numbers</Label>
          <Checkbox id="symbols" name="useSymbols" onChange={handleChange} checked={checkedItems.useSymbols}/>
          <Label htmlFor="symbols">Symbols</Label>
        </div>

          <Label htmlFor="passLength" color="gray">
            Tamanho da Senha
          </Label>
        <TextInput className="w-20" id="passLength" value={passLength} required color="gray" onChange={(e) => setPassLength(Number(e.target.value))} />

        <div className="relative w-full">
          <label htmlFor="pass" className="sr-only">
            Label
          </label>
          <input
            id="pass"
            type="text"
            className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={pass}
            disabled
            readOnly
          />
          <ClipboardWithIconText valueToCopy={pass} />
        </div>

        <Button color="green" outline onClick={() => geraPassword(passLength, options)}>
          Gerar
        </Button>

      </div>
    </div>
  )
}

export default App
