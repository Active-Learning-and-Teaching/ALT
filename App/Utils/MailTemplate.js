import React from 'react';

export const emailTemplate=(courseName,name,date,topics,results,type)=>{
    console.log(type)
    console.log(topics)
    avg_points = {}
    for (value in results){
        sum = 0
        n = 0
        for(let i = 1; i < 6; i++){ 
            sum += results[value][i]*i
            n += results[value][i]
        }
    avg = sum/n
    avg_points[value]=avg}
    return(
        type==="Feedback0"?
            `
            <html>
            <body>
            <div>
                <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                    
                    Following is the results of ${type} on ${date} for course ${courseName}
                    <br/> 
                    <br/>        
                </p>
            ${topics.map((value, i) => (
                `
                    <h3> ${i+1}. ${" "+value}<h3/>
                    <img src="https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%20%20type%3A%20%27pie%27%2C%0A%20%20%20%20data%3A%20%7B%0A%20%20%20%20%20%20%20%20labels%3A%20%5B%27${results[value][0]}%20Not%20Much%27%2C%20%27${results[value][1]}%20Somewhat%27%2C%20%27${results[value][2]}%20Completely%27%5D%2C%0A%20%20%20%20%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%5B${results[value][0]}%2C%20${results[value][1]}%2C%20${results[value][2]}%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20backgroundColor%3A%20%5B%27%23F3460A%27%2C%20%27orange%27%2C%20%27%2360CA24%27%5D%0A%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%7D%2C%0A%20%20%20%20options%3A%20%7B%0A%20%20%20%20%20%20%20%20legend%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20align%3A%20%27start%27%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20plugins%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20datalabels%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%27black%27%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20doughnutlabel%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20labels%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text%3A%20%27Donut%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size%3A%2020%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" height=40% width = 40%/>
                `
            ))}
            <br/><br/><br/><br/>
            <p>
                Regards,
                <br/>
                Team TLS
                <br/>
                <img src="https://i.ibb.co/ky4tJD8/Logo.png" alt="Logo" border="0" width="75px"/>
                
            </p> 
        </div>	
        </body>
        </html> 
            `
        :
        type==="Feedback1"?
            `
            <html>
            <body>
            <div>
                <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                    
                    Following is the results of ${type} on ${date} for course ${courseName}
                    <br/> 
                    <br/>        
                </p>
            ${topics.map((value, i) => (
                `
                    <h3> ${i+1}. ${" "+value}<h3/>
                    <h4> Average Points : ${avg_points[value]}<h4/>
                    <img src="https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%20%20type%3A%20%27pie%27%2C%0A%20%20%20%20data%3A%20%7B%0A%20%20%20%20%20%20%20%20labels%3A%20%5B%27${results[value][1]}%20One%20Point%27%2C%20%27${results[value][2]}%20Two%20Points%27%2C%20%27${results[value][3]}%20Three%20Points%27%2C%20%27${results[value][4]}%20Four%20Points%27%2C%20%27${results[value][5]}%20Five%20Points%27%5D%2C%0A%20%20%20%20%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%5B${results[value][1]}%2C%20${results[value][2]}%2C%20${results[value][3]}%2C%20${results[value][4]}%2C%20${results[value][5]}%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20backgroundColor%3A%20%5B%27%23F3460A%27%2C%20%27orange%27%2C%20%27pink%27%2C%20%27skyblue%27%2C%20%27%2360CA24%27%5D%0A%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%7D%2C%0A%20%20%20%20options%3A%20%7B%0A%20%20%20%20%20%20%20%20legend%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20align%3A%20%27start%27%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20plugins%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20datalabels%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%27black%27%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20doughnutlabel%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20labels%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text%3A%20%27Donut%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size%3A%2020%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" height=40% width = 40%/>
                `
            ))}
            <br/><br/><br/><br/>
            <p>
                Regards,
                <br/>
                Team TLS
                <br/>
                <img src="https://i.ibb.co/ky4tJD8/Logo.png" alt="Logo" border="0" width="75px"/>
                
            </p> 
        </div>	
        </body>
        </html> 
            `
        :
        type==="Single-correct"?
        `
        <html>
        <body>
        <div>
            <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                  
                Following are the results of ${type} quiz on ${date} for course ${courseName}
                <br/> 
                <br/>        
<!--                <img src="https://quickchart.io/chart?c={type:'pie',data:{labels:['${results['A']} A','${results['B']} B','${results['C']} C','${results['D']} D'], datasets:[{data:[${results['A']},${results['B']},${results['C']},${results['D']}]}]}}" height=50% width = 50%>-->
                <img src="https://quickchart.io/chart?bkg=white&c=%7B%0A%20%20%20%20type%3A%20%27pie%27%2C%0A%20%20%20%20data%3A%20%7B%0A%20%20%20%20%20%20%20%20labels%3A%20%5B%27${results['A']}%20A%27%2C%20%27${results['B']}%20B%27%2C%20%27${results['C']}%20C%27%2C%27${results['D']}%20D%27%5D%2C%0A%20%20%20%20%20%20%20%20datasets%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%5B${results['A']}%2C%20${results['B']}%2C%20${results['C']}%2C%20${results['D']}%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20backgroundColor%3A%20%5B%27%234d89f9%27%2C%20%27%2300b88a%27%2C%20%27%23ff9f40%27%2C%27%23ff6384%27%5D%0A%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%7D%2C%0A%20%20%20%20options%3A%20%7B%0A%20%20%20%20%20%20%20%20legend%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20align%3A%20%27start%27%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20plugins%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20datalabels%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%27%23fff%27%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20doughnutlabel%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20labels%3A%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20text%3A%20%27Donut%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20font%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20size%3A%2020%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D" height=50% width = 50%>
            </p>
            <br/><br/><br/><br/>
            PFA. The CSV of answers submitted by the students.
            <br/> 
            <br/>
            <p>
                Regards,
                <br/>
                Team TLS
                <br/>
                <img src="https://i.ibb.co/ky4tJD8/Logo.png" alt="Logo" border="0" width="75px"/>
                
            </p>    
        </div>	
        </body>
        </html>
        `
        :
        (type==="Alpha-numeric" || type==="Multi-correct")?
        `
        <html>
            <head>
            <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
            }
            .column{
             padding-left: 10%;
             padding-right: 10%;
             margin: 3%;
            }
            .card {
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
              padding: 16px;
              text-align: center;
              background-color: #f1f1f1;
            }
            </style>
            </head>
            <body>
            <div>
            <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                   
                Following are the results of ${type} quiz on ${date} for course ${courseName}
                <br/> 
                <br/>
            </p>
            <div>
                ${results.map((value, i) => (
                `
                    <div class="column">
                        <div class="card">
                          <h3>${i+1}. Answer- ${value[0]}</h3>
                          <p>${value[1]} Students</p>
                        </div>
                    </div> 
                    <br/> 
                `
                ))}
            </div>
            <br/><br/><br/><br/>
            PFA. The CSV of answers submitted by the students.
            <br/> 
            <br/>
            <p>
                Regards,
                <br/>
                Team TLS
                <br/>
                <img src="https://i.ibb.co/ky4tJD8/Logo.png" alt="Logo" border="0" width="75px"/>
                
            </p>    
        </div>
        </body>
        </html>
        `
        :
        type==="StudentList"?
        `
        <html>
        <head>
        </head>
        <body>
            <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                    Respected Professor ${name},
                    <br/> 
                    <br/>    
                    <br/>
                    <br/> 
                    PFA. List of Students registered for course ${courseName}
                    <br/> 
                    <br/>
            </p>     
            <br/><br/><br/><br/>
            <p>
                Regards,
                <br/>
                Team TLS
                <br/>
                <img src="https://i.ibb.co/ky4tJD8/Logo.png" alt="Logo" border="0" width="75px"/>
                
            </p>    
        </body>
        </html>
        `
        :
        ``
    )}

export const deleteCourseTemplate=(courseName,name,feedbackCount,quizCount,passCode)=>{
    return(
        `
        <html>
        <head>
        </head>
        <body>
            <p style="color:#222222; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:19px; text-align:left;">
                    Respected Professor ${name},
                    <br/> 
                    <br/>    
                    Following are the details of the course ${courseName} :-
                    <br/>
                    <br/>
                    The course pass code on the app - ${passCode}
                    <br/>
                    Total Number of Quizzes - ${quizCount}
                    <br/>
                    Total Number of Feedbacks - ${feedbackCount}
                    <br/>
                    <br/>
                    <br/>
                    PFA. List of Students registered, List of Announcements made
                    <br/> 
                    <br/>
            </p>     
            <br/><br/><br/><br/>
            <p>
                Regards,
                <br/>
                Team TLS
                <br/>
                <img src="https://i.ibb.co/ky4tJD8/Logo.png" alt="Logo" border="0" width="75px"/>
                
            </p>    
        </body>
        </html>
        `
    )
}
