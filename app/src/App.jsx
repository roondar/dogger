import { useState, useEffect } from 'react'
import { Link, Image, Divider, Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { blake3 } from "hash-wasm";

import './App.css'
import reactLogo from './assets/react.svg'
import rustLogo from './assets/rust.svg'
import githubLogo from './assets/github.svg'
import Containers from './Containers';
import Images from './Images';
import Info from './Info';


function App() {
  const [selected, setSelected] = useState("containers");
  const [errorModal, setErrorModal] = useState("");
  const [noKeyWarning, setNoKeyWarning] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [initialized, setInitialized] = useState(false);

  async function initData() {
    setLoading(true);
    let apiKey = sessionStorage.getItem("dogger-key");
    if (!apiKey) {
      apiKey = key || "dogger"
      apiKey = await blake3(apiKey);
    };
    
    let res = await fetch("./api/ping", { headers: { "Authorization": `Bearer ${apiKey}` } });

    setLoading(false);
    if (res.status === 401) {
      setLoginModal(true);
      setIsKeyInvalid(true);
      sessionStorage.removeItem("dogger-key");
      return;
    }
    setLoginModal(false);
    let json = await res.json();
    if (json.error) {
      setErrorModal("❌ Cannot connect to the Docker Engine");
      return;
    }
    if (!json.hasKey) {
      setNoKeyWarning(true);
    }

    sessionStorage.setItem("dogger-key", apiKey);
    setInitialized(true);
  }

  useEffect(() => {
    initData();
  }, []);

  const onClose = () => {
    initData();
  }

  const onKeyChange = key => {
    setIsKeyInvalid(false);
    setKey(key);
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <nav className='w-full py-3 md:py-2 flex flex-row justify-center bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 shadow-lg'>
        <Tabs color='secondary' size="md" selectedKey={selected} onSelectionChange={setSelected} classNames={{
          tabList: "gap-2 md:gap-4 w-full relative rounded-none p-0 border-b border-divider",
          tab: "max-w-fit px-3 md:px-4 h-10 md:h-12",
          tabContent: "text-gray-800 group-data-[selected=true]:text-black font-medium"
        }}>
          <Tab key="containers" title={
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span className="text-sm md:text-base">Containers</span>
            </div>
          }></Tab>
          <Tab key="images" title={
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
              </svg>
              <span className="text-sm md:text-base">Images</span>
            </div>
          }></Tab>
          <Tab key="info" title={
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span className="text-sm md:text-base">Info</span>
            </div>
          }></Tab>
        </Tabs>
      </nav>
      <div className='w-full max-w-7xl flex flex-col flex-1 mx-auto p-3 md:p-4'>
        {noKeyWarning && <p className="p-3 md:p-4 bg-yellow-100 text-yellow-700 rounded-md shadow-small mb-4 text-sm md:text-base">⚠️ The <strong className="text-yellow-900">DOGGER_KEY</strong> has not been set. Please set <strong className="text-yellow-900">DOGGER_KEY</strong> as an environment variable when running Dogger for security.</p>}
        {(selected === "containers") && <Containers initialized={initialized} />}
        {selected === "images" && <Images />}
        {selected === "info" && <Info />}
      </div>

      <footer className='border-t p-2 md:p-4 text-center w-full'>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-center md:space-y-0 md:space-x-2 text-xs md:text-sm">
          <div className="flex items-center justify-center space-x-2">
            <span>Powered by</span>
            <Link href="https://www.rust-lang.org/" size="sm">
              <div className="flex items-center space-x-1">
                <Image width={12} src={rustLogo}></Image>
                <span>Rust</span>
              </div>
            </Link>
            <span>and</span>
            <Link href="https://react.dev/" size="sm">
              <div className="flex items-center space-x-1">
                <Image width={12} src={reactLogo}></Image>
                <span>React</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <Divider orientation="vertical" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Link href='https://github.com/wangyucode/dogger' size="sm">
              <Image width={12} src={githubLogo}></Image>
            </Link>
            <Divider orientation="vertical" />
            <span>Made with ❤️ by</span>
            <Link href="https://wycode.cn" size="sm">wycode.cn</Link>
          </div>
        </div>
      </footer>

      <Modal isOpen={!!errorModal} hideCloseButton>
        <ModalContent>
          <ModalHeader className="text-sm md:text-base">{errorModal}</ModalHeader>
        </ModalContent>
      </Modal>
      <Modal isOpen={!!loginModal} hideCloseButton size="sm">
        <ModalContent>
          <ModalHeader className="text-sm md:text-base">Input Key</ModalHeader>
          <ModalBody>
            <Input type="text"
              label="Dogger Key"
              isRequired
              isInvalid={isKeyInvalid}
              variant="bordered"
              errorMessage="⛔ Dogger Key is invalid"
              value={key}
              onValueChange={onKeyChange}
              size="sm" />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose} isLoading={loading} size="sm" className="w-full md:w-auto">
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default App
