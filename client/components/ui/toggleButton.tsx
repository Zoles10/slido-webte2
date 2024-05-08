"use client";
import styled from "styled-components";
import { useState, ChangeEvent } from "react";

interface StyledLabelProps {
  checked: boolean;
}


const StyledLabel = styled.label<{ checked: boolean }>`  
cursor: pointer;  
text-indent: -9999px;  
width: 40px;  
height: 20px;  
background: ${({ checked }) => (checked ? "#F97316" :  "gray")};  
display: block;  
border-radius: 50px;  
position: relative;
&:after {    
content: "";    
position: absolute;    
left: ${({ checked }) => (checked ? "22px" : "2px")};
top: 2px; 
width: 16px;  // Fixed size for the toggle circle
height: 16px; // Fixed size for the toggle circle  
background: #fff;    
border-radius: 50%;  
transition: 0.3s;  
}`;
interface ToggleSwitchProps {
  onChange?: (checked: boolean) => void;
}
export default function ToggleSwitch({ onChange }: ToggleSwitchProps) { 
  const [switchState, setSwitchState] = useState(true);  
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setSwitchState(e.target.checked);
    if (onChange) {
      onChange(e.target.checked);
    }
  }
  return (    
    <StyledLabel htmlFor="checkbox" checked={switchState}> 
      <input 
        id="checkbox" 
        type="checkbox" 
        checked={switchState}
        onChange={handleOnChange} />    
    </StyledLabel>
  );
}
