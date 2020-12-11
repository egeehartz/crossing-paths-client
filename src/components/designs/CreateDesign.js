import React, { useEffect, useRef } from "react"
import { Line, Layer, Rect } from "konva";
import { Stage } from 'react-konva';
import "./CreateDesign.css"

export const CreateDesign = () => {

    const stageRef = useRef(null)
    const titleRef = useRef(null)

    //create layer to make the grid
    const gridLayer = new Layer({id:"grid"})

    //create a new layer to hold shapes
    const shapeLayer = new Layer({id:"shapes"})

    useEffect(() => {
      //creates the grid
        const blockSnapSize = 30;
        const padding = blockSnapSize;
        const width = window.innerWidth;
        const height = window.innerHeight;
    
        gridLayer.add(new Line({
            points: [900, 0, 900, 900], 
            stroke: '#f00',
            strokeWidth: 4
          }));


        // vertical lines
        for (let i = 0; i < width / padding; i++) {
            gridLayer.add(new Line({
                // x1, y1, x2, y2
              points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
              stroke: '#222',
              strokeWidth: 1,
            }));
          }
          
    
          // horizontal lines
          for (let j = 0; j < height / padding; j++) {
            gridLayer.add(new Line({
              points: [0, Math.round(j * padding), width, Math.round(j * padding)],
              stroke: '#222',
              strokeWidth: 0.75,
            }));
          }

        stageRef.current.add(gridLayer)
        stageRef.current.draw()
    },[])
    


    const drawRectangle = () => {
        const blockSnapSize = 30;

        //get the x, y positions of the click
        const coordinates = stageRef.current.getPointerPosition()
        console.log(coordinates)

        let arr = []
        let arr2 = []
        const clickX = coordinates.x
        const clickY = coordinates.y

        //finds the closest x coordinate (without going over)
        for(let i = 0; i < clickX ; i += 30){
          if (i > clickX) {
            break;
          } else {
            arr.push(i)
          }
        }

        //finds the closest y coordinate (without going over)
        for(let i = 0; i < clickY ; i += 30){
          if (i > clickY) {
            break;
          } else {
            arr2.push(i)
          }
        }

        //together, they make the top left corner of the Konva Rect
        const newX = arr.slice(-1)
        const newY = arr2.slice(-1)
        

        //create a rectangle 
        const rectangle = new Rect({
            //if an x, y property gets defined, subtract that from the coordinate
            x: (newX[0] - 60),
            y: (newY[0] - 60),
            height: blockSnapSize,
            width: blockSnapSize,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            draggable: true
        })

        //add the rectangle to the layer then draw
        shapeLayer.add(rectangle)
        shapeLayer.draw()

        //add the layer to the stage
        stageRef.current.add(shapeLayer)
    }

    const constructPattern = () => {
      if(titleRef.current.value === "") {
        window.alert("give your design a title!")
      } else {
        // var image_data = stageRef.current.toDataURL();
        // addPattern({
        //   title: titleRef.current.value,
        //   image: image_data
        // })
      }
 
    }
    return (
      <>
        <input type="text" placeholder="name your design!" ref={titleRef}></input>
        <button onClick={constructPattern} >save pattern</button>
        <Stage 
          className="stage"
          width={900}
          height={900}
          x={60}
          y={60}
          onClick={() => drawRectangle()} ref={stageRef}
          style={{cursor:"crosshair"}}>
        </Stage>
        </>
    );
}