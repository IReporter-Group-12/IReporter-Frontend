import {
  GiFlyingFlag 
} from "react-icons/gi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaHouseUser, FaPeopleRoof } from "react-icons/fa6";
import {
  BiWorld,
} from "react-icons/bi";
import {  BsFillDoorOpenFill} from "react-icons/bs";

export const categories = [
  {
    label: "All Reports",
    icon: <BiWorld />,
  },
  {
    img: "assets/corruption.jpg",
    label: "Report a corruption",
    icon: <GiFlyingFlag />,
    description: "Report Corruption: Your Voice, Our Integrity!",
  },
  {
    img: "assets/intervention.jpg",
    label: "Public Petition",
    icon: <HiOutlineLocationMarker/>,
    description: "Public Petition: Your Voice, Our Change!",
  },
  
];

export const types = [
  {
    name: "An entire place",
    description: "Guests have the whole place to themselves",
    icon: <FaHouseUser />,
  },
  {
    name: "Room(s)",
    description:
      "Guests have their own room in a house, plus access to shared places",
    icon: <BsFillDoorOpenFill />,
  },
  {
    name: "A Shared Room",
    description:
      "Guests sleep in a room or common area that maybe shared with you or others",
    icon: <FaPeopleRoof />,
  },
];


