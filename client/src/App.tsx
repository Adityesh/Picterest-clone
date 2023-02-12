import { trpc } from './trpc'
let state = 1;

function App() {
  const addPinMutation = trpc.pin.addPin.useMutation()
  const loginMutation = trpc.user.loginUser.useMutation()
  const getPinsMutation = trpc.pin.getPins.useMutation()
  const handleAddPin = () => {
    addPinMutation.mutate({
      authorId : 1,
      image : "https://cdn.pixabay.com/photo/2017/09/12/11/56/universe-2742113__340.jpg",
      title : "Test Title" + state++
    })
  }

  const handleLogin = () => {
    loginMutation.mutate({
      name : "Name",
      password : "Test@123"
    })
  }

  const handleGetPins = () => {
    getPinsMutation.mutate({
      limit : 4,
      cursor : getPinsMutation.data?.cursor
    })
  }


  return (
    <div className="App">
      <button onClick={handleLogin}>Login User</button>
      <button onClick={handleAddPin}>Add Pin</button>
      <button onClick={handleGetPins}>Get Pins</button>
    </div>
  )
}

export default App
