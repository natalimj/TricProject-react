import { BeatLoader} from "react-spinners";

const WaitingPage = () => {
  return (
    <div style={{marginTop:"300px"}} data-cy="spinner">
      <BeatLoader color="#FFADCB" size={100} speedMultiplier={1}/>
      <h5> Please wait ...</h5>
    </div>
  )
}

export default WaitingPage