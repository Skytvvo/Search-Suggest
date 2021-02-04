const http = require('http')
const fs = require('fs')

const PORT = 3000

let dbData
    fs.readFile('DB.json',(err,fileData)=>{
        dbData = JSON.parse(fileData)
    });

http.createServer(((req, res) => {

    if(req.method === 'GET')
    {

        res.end('GET response')
    }

   if(req.method === "OPTIONS")
     {
         res.writeHead(200, {
             'Content-Type': 'text/json',
             'Access-Control-Allow-Origin' : '*',
             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
             'Access-Control-Allow-Headers':  'Content-Type'
         })

         res.end();
     }

    if(req.method === 'POST')
    {
        res.writeHead(200, {
            'Content-Type': 'text/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        })

        let body = '';

        req.on('data',(chunk) => {
            body += chunk.toString()
        })

        req.on('end',()=>{



            let obj = JSON.parse(body)

                if(obj.type === 'suggest')
                {
                    let suitableData = dbData.filter((item=>item.data.startsWith(obj.data)))
                    suitableData.sort((A,B)=>{
                        if(A.chart > B.chart)
                            return 1
                        else if(A.chart < B.chart)
                            return  -1
                        return 0
                    })
                    suitableData.reverse((item)=>item.chart)

                    if(suitableData.length>10)
                    {
                        suitableData = suitableData.slice(0,10)
                    }

                    res.end(JSON.stringify(suitableData))
                }

                if(obj.type === 'findRequest')
                {

                    let flag = false

                    dbData = dbData.map(item =>{
                        if(item.data === obj.data)
                        {
                            item.chart++
                            flag = true
                        }
                        return item
                    })

                    if(!flag)
                        dbData.push({
                            data:obj.data,
                            chart:1
                        })

                    fs.writeFileSync('DB.json', JSON.stringify(dbData))

                }


            res.end('OK')
        })
    }

})).listen(PORT)