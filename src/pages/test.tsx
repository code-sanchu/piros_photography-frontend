import { toast } from "react-toastify";

// import Toast from "~/components/Toast";

const Test = () => {
  return (
    <div className="min-h-screen">
      <button onClick={() => toast("HELLO")}>
        {/* <button onClick={() => toast(<Toast text="HELLO" type="alert" />)}> */}
        Toast!
      </button>
    </div>
  );
};

export default Test;
