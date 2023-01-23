import {useState} from "react";


export  function useInput(initialState:string | number){
    const [value, setValue] = useState(initialState)

    const onChange = (e) => {
        setValue(e.target.value)
    }
    const onPredict = (e) => {
        setValue(e)
    }


    return {
        value,
        onChange,
        onPredict
    }

}
