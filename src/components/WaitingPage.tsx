import { ClipLoader } from "react-spinners";

const WaitingPage = () => {
  return (
    <div>
      <h4>Submitted successfully! Please wait ....</h4>
      <ClipLoader color="#c73f3f" />
    </div>
  )
}

export default WaitingPage