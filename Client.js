const url = 'http://localhost:3000/'

document.getElementById('search_box').oninput = function ()
{
    let searchBox = document.getElementById('search_box')
    let results = document.getElementById('results')
    let wordRequest = searchBox.value

    if(wordRequest === null || wordRequest === undefined ||wordRequest === '')
    {
        results.innerHTML= null
        results.style.display = 'none'
        return
    }


    let xhr = new XMLHttpRequest()
    let data = JSON.stringify({
        type: 'suggest',
        data: wordRequest
    })

    xhr.open('POST', url )
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.send(data)

    xhr.onload = ()=>{
        results.innerHTML = null
        if(JSON.parse(xhr.response).length !==0) {
            results.style.display = 'flex'
            JSON.parse(xhr.response).forEach(child => {
                let newChild = document.createElement('li')
                newChild.innerHTML = child.data
                results.append(newChild)
            })
        }
    }
}

function sendRequest()
{
    let xhr = new XMLHttpRequest()
    let searchBoxMessage = document.getElementById('search_box').value

    if(searchBoxMessage === null || searchBoxMessage === undefined ||searchBoxMessage === '')
        return;

    let data = JSON.stringify({
        type:'findRequest',
        data:searchBoxMessage
    })

    xhr.open('POST',url)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(data)
    xhr.onload = ()=>{


    }
}



