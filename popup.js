const form = document.getElementById('form')
const urlInput = document.getElementById('url-to-remove')
const outputMessage = document.getElementById('output-msg')

// initial state
urlInput.value = 'meet.google.com'
urlInput.focus()

const errorTypes = {
  noResults: {
    msg: 'No tabs found with that address!'
  }
}

form.addEventListener('submit', function(event) {
  event.preventDefault()
  const urlToRemove = urlInput.value

  chrome.tabs.query({url: urlStringFormatter(urlToRemove)}, (tabs) => {
    if (!tabs || !tabs.length) {
      handleError(errorTypes.noResults)
    } else {
      handleSuccess()
    }

    chrome.tabs.remove(tabs.map(t => t.id))

    if (tabs && tabs.length) {
      handleSuccess(tabs.length)
    }
  })
});

const urlStringFormatter = urlString => {
  let url = urlString.includes('https://') ? urlString : `https://${urlString}`
  url[url.length - 1] === '/' 
    ? url = url + '*' 
    : url = url + '/*'

  return url
}

const handleError = errorType => {
  modifyOutputMsgElement({
    classesToRemove: ['popup__output-msg--success'],
    classesToAdd: ['popup__output-msg--error'],
    hidden: false,
    messageString: errorType.msg
  })
}

const handleSuccess = removedTabsCount => {
  modifyOutputMsgElement({
    classesToRemove: ['popup__output-msg--error'],
    classesToAdd: ['popup__output-msg--success'],
    hidden: false,
    messageString: `Deleted ${removedTabsCount} ${removedTabsCount === 1 ? 'tab' : 'tabs'}`
  })
}

const modifyOutputMsgElement = ({ classesToRemove, classesToAdd, messageString, hidden }) => {
  outputMessage.classList.remove(classesToRemove)
  outputMessage.classList.add(classesToAdd)
  hidden 
    ? outputMessage.classList.add('hidden') 
    : outputMessage.classList.remove('hidden')

  outputMessage.innerHTML = messageString
}