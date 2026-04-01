import { Link } from "react-router";
import "./Header/header.css";

const RegisterPrompt = ({ detail }) => {
  return (
    <>
      <div className="register-prompt">
  Please <Link to="/auth"><span className="spacer">Sign In</span></Link>
   or 
  <Link to="/auth"><span className="spacer">Register</span></Link> to {detail} informe
</div>
    </>
  );
};

export default RegisterPrompt;
