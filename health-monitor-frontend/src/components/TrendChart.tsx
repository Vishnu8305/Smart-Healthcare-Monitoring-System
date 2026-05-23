import { Line } from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend
)

function TrendChart({history}:any){

const labels = history.hr.map((_:any,i:number)=>i)

const data = {

labels,

datasets:[

{
label:"Heart Rate",
data:history.hr,
borderColor:"#ff3b3b",
borderWidth:2,
pointRadius:0,
tension:0.35
},

{
label:"SpO2",
data:history.spo2,
borderColor:"#0077ff",
borderWidth:2,
pointRadius:0,
tension:0.35
},

{
label:"Temperature",
data:history.temp,
borderColor:"#ff9800",
borderWidth:2,
pointRadius:0,
tension:0.35
},

{
label:"Pulse",
data:history.pulse,
borderColor:"#00c853",
borderWidth:2,
pointRadius:0,
tension:0.35
}

]

}

const options:any={

responsive:true,
maintainAspectRatio:false,

animation:{
duration:800,
easing:"easeInOutQuad"
},

plugins:{
legend:{
position:"top",
labels:{
color:"#2c3e50"
}
}
},

scales:{

x:{
grid:{
color:"rgba(0,255,166,0.08)"
}
},

y:{
min:0,
max:200,
grid:{
color:"rgba(0,255,166,0.08)"
}
}

}

}

return(

<div className="trend-monitor">

<Line data={data} options={options}/>

</div>

)

}

export default TrendChart