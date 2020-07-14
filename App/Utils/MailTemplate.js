
export const emailTemplate=(name,date,results,type)=>{
    return(
        `
        <html>
        <body>
        <div>
            <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:19px; text-align:left;">
                Respected Faculty ${name},
                <br/> 
                <br/>     
                PFA The results of ${type} on ${date} 
                <br/> 
                <br/>        
                <img src="https://quickchart.io/chart?c={type:'pie',data:{labels:['A','B', 'C','D'], datasets:[{data:[${results['A']},${results['B']},${results['C']},${results['D']}]}]}}" height=50% width = 50%>
            </p>    
        </div>	
        </body>
        </html>
        `
    )}
