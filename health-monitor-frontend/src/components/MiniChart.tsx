import { Line } from "react-chartjs-2"
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement } from "chart.js"

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement)

function MiniChart({values}:{values:number[]}){

const data={
labels:values.map((_,i)=>i),
datasets:[{
data:values,
borderColor:"#0077ff",
pointRadius:0,
tension:.4
}]
}

const options={
plugins:{legend:{display:false}},
scales:{x:{display:false},y:{display:false}}
} as any

return <Line data={data} options={options} height={40}/>
}

export default MiniChart