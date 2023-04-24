export const haveHelloSarahInString = (text: string) => {
  return text.toLowerCase().includes('oi sara')
}

export const haveSarahEndInString = (text: string) => {
  return text.includes('CHAT_END')
}
