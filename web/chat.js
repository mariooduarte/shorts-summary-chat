import { server } from "./server.js"
import { createChatMessage } from "./message.js"

const formElement = document.querySelector("#form")
const inputFromFormElement = document.querySelector("#url")
const buttonFromFormElement = document.querySelector("#form-button")
const loadingFromFormElement = document.querySelector("#form-loading")

createChatMessage(
  {
    message: `
    <img src="logo.svg" alt="Imagem de perfil do chat." />
    <div class="chat-message">
      <h1>Shorts Summary Chat</h1>
      <p>
        Olá! Posso te ajudar resumindo shorts do YouTube.
        <br />
        <br />
        É só me enviar a URL do shorts que eu te mando o resumo, ok?
      </p>
    </div>`,
    time: 100,
    type: false,
  },
  100
)

inputFromFormElement.addEventListener("input", () => {
  if (inputFromFormElement.value != "") {
    buttonFromFormElement.style.color = "var(--colors-purple-mid)"
  } else {
    buttonFromFormElement.style.color = "var(--colors-gray-low)"
  }
})

buttonFromFormElement.addEventListener("mouseenter", () => {
  if (buttonFromFormElement.style.color == "var(--colors-purple-mid)") {
    buttonFromFormElement.style.color = "var(--colors-purple-light)"
  }
})

buttonFromFormElement.addEventListener("mouseleave", () => {
  if (buttonFromFormElement.style.color == "var(--colors-purple-light)") {
    buttonFromFormElement.style.color = "var(--colors-purple-mid)"
  }
})

formElement.addEventListener("submit", async (event) => {
  event.preventDefault()

  updateFormButton(buttonFromFormElement, "disable")

  const videoURL = inputFromFormElement.value

  if (videoURL == "") {
    updateFormButton(buttonFromFormElement, "enable")
    return
  }

  inputFromFormElement.value = ""

  createChatMessage({
    message: videoURL,
    time: 200,
    side: "right",
  })

  if (!videoURL.includes("/shorts/")) {
    createChatMessage({
      message: "O link informado não é de um shorts. :(",
      type: true,
      time: 1000,
    })
    updateFormButton(buttonFromFormElement, "enable")
    return
  }

  const [_, urlParams] = videoURL.split("/shorts/")

  if (urlParams == "") {
    createChatMessage({
      message: "O link informado não é de um shorts. :(",
      type: true,
      time: 1000,
    })
    updateFormButton(buttonFromFormElement, "enable")
    return
  }

  const [videoID] = urlParams.split("?")

  createChatMessage({
    message:
      "Excelente! Aguarde um momento enquanto eu faço o resumo para você! :)",
    time: 1000,
    type: true,
  })

  try {
    const transcription = await server.get("/summary/" + videoID)

    const summary = await server.post("/summary", {
      text: transcription.data.result,
    })

    createChatMessage({
      message: summary.data.result,
      type: true,
    })

    updateFormButton(buttonFromFormElement, "enable")
  } catch (error) {
    createChatMessage({
      message:
        "Ocorreu um erro inesperado! :(</br>Verifique se a URL está correta e tente enviá-la novamente.",
      time: 1000,
      type: true,
    })

    updateFormButton(buttonFromFormElement, "enable")
    return
  }
})

function updateFormButton(buttonFromFormElement, status) {
  switch (status) {
    case "enable":
      buttonFromFormElement.disabled = false
      buttonFromFormElement.classList.remove("hidden")
      loadingFromFormElement.classList.add("hidden")
      break
    case "disable":
      buttonFromFormElement.disabled = true
      buttonFromFormElement.classList.add("hidden")
      loadingFromFormElement.classList.remove("hidden")
      break
    default:
      break
  }
}
