import {useEffect, useRef, useState } from "react";
import "./style/AnimatedMessages.css";

const PADDING = 50; // Ensures messages stay within bounds
const MAX_LINE_WIDTH = 600; 
const LINE_HEIGHT = 40; 

const DynamicSVGMessages = ({messagesList = []}) => {
    const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 700, height: 350 });
    const [activeMessages, setActiveMessages] = useState([]);
  
    useEffect(() => {
      const updateCanvasSize = () => {
        if (canvasRef.current) {
          const parent = canvasRef.current.parentElement;
          setCanvasSize({
            width: parent.clientWidth - 5,
            height: (parent.clientHeight / 2) - 2 ,
          });
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        }
      };
  
      updateCanvasSize();
      window.addEventListener("resize", updateCanvasSize);
      return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);
  
    const drawMessageAnimated = (ctx, text, x, y, opacity) => {
        let index = 0;
        const tiltAngle = (Math.random() * 20 - 10) * (Math.PI / 180); // Random tilt (-10 to +10 degrees)
      
        const drawFrame = () => {
          ctx.clearRect(x - MAX_LINE_WIDTH / 2, y - LINE_HEIGHT, MAX_LINE_WIDTH, LINE_HEIGHT * 2); // Clears only the text area
          ctx.save();
            
          ctx.globalAlpha = 1;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "normal 25px 'Rouge Script', cursive"; 
      
          ctx.translate(x, y);  // Move origin to message position
          ctx.rotate(tiltAngle); // Apply tilt rotation
      
          let words = text.split(" ");
          let lines = [];
          let line = "";
      
          words.forEach(word => {
            let testLine = line + word + " ";
            let testWidth = ctx.measureText(testLine).width;
            if (testWidth > MAX_LINE_WIDTH) {
              lines.push(line);
              line = word + " ";
            } else {
              line = testLine;
            }
          });
          lines.push(line);
      
          // Draw each character progressively with tilt
          lines.forEach((l, i) => {
            let visibleText = l.substring(0, index);
            ctx.fillStyle = "gray";
            ctx.fillText(visibleText, 0, i * LINE_HEIGHT); // Now relative to rotated origin
          });
      
          ctx.restore();
      
          if (index < text.length) {
            index++;
            setTimeout(drawFrame, 50); // Adjust speed for smoother writing animation
          }
        };
      
        drawFrame(); // Start animation
      };
      
      
      
  
    const getUniqueMessages = (messagesList, existingMessages = []) => {
        let availableMessages = messagesList.filter(msg => !existingMessages.includes(msg));
        let selectedMessages = [];
        
        while (selectedMessages.length < 3 && availableMessages.length > 0) {
          let randomIndex = Math.floor(Math.random() * availableMessages.length);
          selectedMessages.push(availableMessages[randomIndex]);
          availableMessages.splice(randomIndex, 1); // Remove used message to prevent duplication
        }
      
        return selectedMessages;
      };
  
      const findSafeSpot1 = () => {
        let x, y;
      
        x = 0.5 * (canvasSize.width - PADDING * 2) + PADDING;
        y = 0.167 * (canvasSize.height - PADDING * 2) + PADDING;
        return { x, y };
      };

      const findSafeSpot2 = () => {
        let x, y;
      
        x = 0.5 * (canvasSize.width - PADDING * 2) + PADDING;
        y = 0.5 * (canvasSize.height - PADDING * 2) + 2* PADDING;
        return { x, y };
      };

      const findSafeSpot3 = () => {
        let x, y;
      
        x = 0.5 * (canvasSize.width - PADDING * 2) + PADDING;
        y = 0.833 * (canvasSize.height - PADDING * 2) + 3 * PADDING;
        return { x, y };
      };
      
  
    useEffect(() => {

      if (messagesList){
      const updateMessages = () => {
        setActiveMessages((prev) => {
            const newMessages = getUniqueMessages(messagesList, prev.map(msg => msg.text));
            return newMessages.map((text, index) => ({
              text,
              ...findSafeSpot2(),
              opacity: 1
            }));
          });
  
        if (activeMessages.length < 3) {
          const [newMessage1, newMessage2, newMessage3] = getUniqueMessages(messagesList);
          setActiveMessages([
            { text: newMessage1, ...findSafeSpot1(), opacity: 1 },
            { text: newMessage2, ...findSafeSpot2(), opacity: 1 },
            { text: newMessage3, ...findSafeSpot3(), opacity: 1 },
          ]);
        }
      };
  
      const interval = setInterval(updateMessages, 7000);
      return () => clearInterval(interval);
    }}, [canvasSize, messagesList]);
  
    useEffect(() => {

        
         if (messagesList){ 
                const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");
            
              // Clear the canvas before drawing new messages
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              activeMessages.forEach(({ text, x, y, opacity }) => {
                drawMessageAnimated(ctx, text, x, y, opacity);
              });
}}, [activeMessages, messagesList]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", background: "transparent" }} />;
  };
    

export default DynamicSVGMessages;
