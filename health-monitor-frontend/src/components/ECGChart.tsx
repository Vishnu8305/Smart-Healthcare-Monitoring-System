import { Line } from "react-chartjs-2"
import { useState,useEffect } from "react"
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement } from "chart.js"

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement)

function ECGChart({heartRate}:any){

const [data,setData]=useState<number[]>([])

/* heartbeat interval based on HR */

useEffect(()=>{

const interval = 60000 / (heartRate || 70)

const timer=setInterval(()=>{

setData(prev=>{

const beat=[0,1,4,-1,0]

const newData=[...prev,...beat]

if(newData.length>120)
newData.splice(0,newData.length-120)

return newData

})

},interval)

return ()=>clearInterval(timer)

},[heartRate])

const chartData={
labels:data.map((_,i)=>i),
datasets:[{
data:data,
borderColor:"#00ffa6",
borderWidth:3,
pointRadius:0,
tension:0.3
}]
}

const options={
plugins:{legend:{display:false}},
scales:{x:{display:false},y:{display:false}}
} as any

return(

<div className="ecg-panel">

<h4 className="ecg-title">
ECG Monitor
</h4>

<div className="ecg-chart">

<Line data={chartData} options={options}/>

</div>

</div>

)

}

export default ECGChart