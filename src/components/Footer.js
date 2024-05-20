
/*import { LocationOn, LocalPhone, Email } from "@mui/icons-material"?*/
import "../styles/Footer.css"

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <a href="/"><img src="/assets/logo.png" alt="the represenation of the busimess " /></a>
      </div>

      <div className="footer_center">
        <h3>Useful Links</h3>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
          <li>Contact us</li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        
      </div>
    </div>
  )
}

export default Footer