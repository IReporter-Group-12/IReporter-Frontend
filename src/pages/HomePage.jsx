import Slide from "../components/Slide"
import Categories from "../components/Categories"

const HomePage = () => {
  if(localStorage.getItem("loggedIn") === "false" || null){
    localStorage.setItem('logged_in', false)
    localStorage.setItem("user_id", null)
    localStorage.setItem('username', null)
    localStorage.setItem("email", null)
    localStorage.setItem("role", null)
    localStorage.setItem("report_id", null)
  }

  return (
    <>
      <Slide />
      <Categories />
    </>
  )
}

export default HomePage