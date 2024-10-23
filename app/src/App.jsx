import { useState } from 'react'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import { Image } from '@nextui-org/image'
import { Divider } from "@nextui-org/divider";
import { Tabs, Tab } from "@nextui-org/tabs";

import './App.css'
import reactLogo from './assets/react.svg'
import rustLogo from './assets/rust.svg'
import githubLogo from './assets/github.svg'
import Containers from './Containers';
import Images from './Images';


function App() {
  const [selected, setSelected] = useState("containers");

  return (
    <div className="flex flex-col items-center h-screen">
      <nav className='w-full py-2 flex flex-row justify-center bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 shadow-lg'>
        <Tabs color='primary' size="lg" selectedKey={selected} onSelectionChange={setSelected}>
          <Tab key="containers" title={
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span>Containers</span>
            </div>
          }></Tab>
          <Tab key="images" title={
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
              </svg>
              <span>Images</span>
            </div>
          }></Tab>
        </Tabs>
      </nav>
      <div className='container flex flex-1 mx-auto p-4'>
        {selected === "containers" && <Containers />}
        {selected === "images" && <Images />}
      </div>
      <footer className='border-t p-4 text-center w-full flex items-center justify-center text-sm space-x-2'>
        <span>Powered by</span>
        <Link href="https://www.rust-lang.org/" size="sm"><Image width={16} src={rustLogo}></Image>Rust</Link>
        <span>and</span>
        <Link href="https://react.dev/" size="sm"><Image width={16} src={reactLogo}></Image>React</Link>
        <Divider orientation="vertical" />
        <Link href='https://github.com/wangyucode/dogger' size="sm"><Image width={16} src={githubLogo}></Image></Link>
        <Divider orientation="vertical" />
        <span>Made with ❤️ by</span>
        <Link href="https://wycode.cn" size="sm">wycode.cn</Link>
      </footer>
    </div>
  )
}

export default App
