const messagesContainer = document.querySelector("#messages-container")

export function createChatMessage(request) {
  const message = request?.message
  const time = request?.time
  const side = request?.side
  const type = request?.type

  setTimeout(() => {
    let chatMessageCard = document.createElement("div")
    chatMessageCard.classList.add("chat-message-container")

    if (side == "right") {
      chatMessageCard.classList.add("chat-message-container-right")
    }

    if (message.includes("http://") || message.includes("https://")) {
      chatMessageCard.innerHTML = `<div class="chat-message"><p><a href="${message}" target="_blank">${message}</a></p></div>`
    } else {
      if (type) {
        typeWriter(message, messagesContainer)
      } else {
        chatMessageCard.innerHTML = message
      }
    }

    messagesContainer.prepend(chatMessageCard)

    function typeWriter(message, messagesContainer) {
      const typeArray = message.split("")
      message = ""
      typeArray.forEach((letter, i) => {
        setTimeout(() => {
          verifyMessagesContainerHeight(messagesContainer)
          message += letter
          chatMessageCard.innerHTML = `
          <div class="chat-logo">
          <img src="logo.svg" alt="Imagem de perfil do chat." />
          </div>
          <div class="chat-message">
          <p>${message}</p>
          </div>
          `
        }, 20 * i)
      })
    }

    setTimeout(() => {
      chatMessageCard.style.opacity = "1"
      chatMessageCard.style.transform = "translateY(0)"
    }, 100)
  }, time)
}

function verifyMessagesContainerHeight(messagesContainer) {
  const messagesContainerHeight = messagesContainer.clientHeight
  const messageContainerContentHeight = messagesContainer.scrollHeight

  if (messageContainerContentHeight > messagesContainerHeight) {
    return (messagesContainer.style.paddingRight = "10px")
  }
}
