import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div>Hello</div>
      <Link to="/login2"> go to login page</Link>
    </>
  );
}
