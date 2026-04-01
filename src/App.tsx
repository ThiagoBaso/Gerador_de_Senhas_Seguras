import { Checkbox, Label, Button, ClipboardWithIconText, TextInput, ListGroupItem, ListGroup } from "flowbite-react";
import { useState } from "react";

import { TabItem, Tabs } from "flowbite-react";

function App() {

  const [pass, setPass] = useState('')
  const [passLength, setPassLength] = useState(16)
  const [checkedItems, setCheckedItems] = useState({ useLower: true, useUpper: false, useNumbers: true, useSymbols: false });
  const [passHistory, setPassHistory] = useState<string[]>([])
  const [copiedItem, setCopiedItem] = useState<string | null>(null)


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

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
    setCopiedItem(text)
    window.setTimeout(() => {
      setCopiedItem((current) => current === text ? null : current)
    }, 900)
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

  function History() {
    return (
      <div className="h-[calc(70vh-8rem)] max-h-[calc(720px-8rem)] w-full overflow-y-auto">

        <ListGroup className="w-full rounded-none">
          {passHistory.map((item, index) =>
            <ListGroupItem key={`${item}-${index}`} className="group text-lg bg-gray-800">
              <div className="flex w-full items-center justify-between gap-3">
                <p className="truncate">{item}</p>
                <div className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button
                    size="xs"
                    color={copiedItem === item ? "success" : "gray"}
                    className={`transition-all duration-200 ${copiedItem === item ? "scale-105" : "scale-100"}`}
                    onClick={() => copyToClipboard(item)}
                  >
                    {copiedItem === item ? "Copiado!" : "Copy"}
                  </Button>
                </div>
              </div>
            </ListGroupItem>
          )}
        </ListGroup>

      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-800">

      <div className="w-[90vw] max-w-[500px] h-[720px] max-h-[70vh] rounded-xl flex flex-col overflow-hidden border-green-700 border-4">

        <Tabs aria-label="Default tabs" variant="default" className="h-24 w-full border-green-700 dark:border-green-700 ">
          <TabItem active title="Gerar Senhas" >

            <div className="w-auto h-auto rounded-xl flex items-center flex-col gap-4 p-10 pt-0">

              <h1 className="text-2xl font-bold text-white">Gerador de Senha</h1>
              <div className="flex items-center gap-2">
                <Checkbox id="lower" name="useLower" onChange={handleChange} checked={checkedItems.useLower} />
                <Label htmlFor="lower">Lower</Label>
                <Checkbox id="upper" name="useUpper" onChange={handleChange} checked={checkedItems.useUpper} />
                <Label htmlFor="upper">Upper</Label>
                <Checkbox id="numbers" name="useNumbers" onChange={handleChange} checked={checkedItems.useNumbers} />
                <Label htmlFor="numbers">Numbers</Label>
                <Checkbox id="symbols" name="useSymbols" onChange={handleChange} checked={checkedItems.useSymbols} />
                <Label htmlFor="symbols">Symbols</Label>
              </div>

              <Label htmlFor="passLength" color="white" className="text-white text-lg">
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
                  className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-base font-semibold text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
          </TabItem>
          <TabItem title="Historico">
            <div className="w-full p-0">
              <History />
            </div>
          </TabItem>
        </Tabs>
      </div>
    </div>
  )
}



export default App
