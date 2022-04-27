export const getJwtToken = () => {
    return localStorage.getItem("token")
}

export const  setJwtToken = (token : string) =>  {
    localStorage.setItem("token", token)
}