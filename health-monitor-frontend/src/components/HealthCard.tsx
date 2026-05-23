import { Card } from "react-bootstrap"
import { motion } from "framer-motion"
import MiniChart from "./MiniChart"

import {
FaHeartbeat,
FaTint,
FaTemperatureHigh,
FaRulerVertical,
FaStethoscope
} from "react-icons/fa"

function getIcon(icon:string){

switch(icon){

case "heart": return <FaHeartbeat/>
case "oxygen": return <FaTint/>
case "temp": return <FaTemperatureHigh/>
case "height": return <FaRulerVertical/>
case "bp": return <FaStethoscope/>
case "pulse": return <FaHeartbeat/>

default: return null
}

}

/* color logic */

function getColor(title:string,value:number){

if(title==="Heart Rate"){

if(value>=60 && value<=100) return "#00c853"
if(value>100) return "#ff9100"
return "#ff1744"

}

if(title==="SpO2"){

if(value>=95) return "#00c853"
if(value>=90) return "#ff9100"
return "#ff1744"

}

if(title==="Temperature"){

if(value<37.5) return "#00c853"
if(value<38.5) return "#ff9100"
return "#ff1744"

}

return "#0077ff"
}

function HealthCard({title,value,unit,icon,history}:any){

const color = getColor(title,value)

return(

<motion.div
whileHover={{scale:1.05,rotateX:6,rotateY:-6}}
style={{perspective:1000}}
>

<Card className="health-card">

<Card.Body>

<div className="icon" style={{color:color}}>
{getIcon(icon)}
</div>

<h6 className="parameter">{title}</h6>

<h2 className="value">
{value} <span>{unit}</span>
</h2>

{history.length>0 && <MiniChart values={history}/>}

</Card.Body>

</Card>

</motion.div>

)

}

export default HealthCard