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
        const blockSnapSize = 16;
        const padding = blockSnapSize;
        const width = 896
        const height = 896

    
        //last vertical line
        gridLayer.add(new Line({
            points: [896, 0, 896, 896], 
            stroke: '#222',
            strokeWidth: 1
          }));

          //last horizontal line
          gridLayer.add(new Line({
            points: [0, 896, 896, 896], 
            stroke: '#222',
            strokeWidth: 1
          }));


        // vertical lines
        for (let i = 0; i < width / padding; i++) {
          let lineWidth = 1
          if(i % 5 === 0) {
             lineWidth = 3
          } 
            gridLayer.add(new Line({
                // x1, y1, x2, y2
              points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
              stroke: '#222',
              strokeWidth: lineWidth,
            }));
          }
          
    
          // horizontal lines
          for (let j = 0; j < height / padding; j++) {
            let lineWidth = 0.75
          if(j % 5 === 0) {
             lineWidth = 2.75
          }
            gridLayer.add(new Line({
              points: [0, Math.round(j * padding), width, Math.round(j * padding)],
              stroke: '#222',
              strokeWidth: lineWidth,
            }));
          }

        stageRef.current.add(gridLayer)
        stageRef.current.draw()
    },[])
    


    const drawRectangle = () => {
        const blockSnapSize = 16;

        //get the x, y positions of the click
        const coordinates = stageRef.current.getPointerPosition()
        console.log(coordinates)

        let arr = []
        let arr2 = []
        const clickX = coordinates.x
        const clickY = coordinates.y

        //finds the closest x coordinate (without going over)
        for(let i = 0; i < clickX ; i += 16){
          if (i > clickX) {
            break;
          } else {
            arr.push(i)
          }
        }

        //finds the closest y coordinate (without going over)
        for(let i = 0; i < clickY ; i += 16){
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
            x: (newX[0]),
            y: (newY[0]),
            height: blockSnapSize,
            width: blockSnapSize,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 1,
            draggable: false
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
          width={896}
          height={896}
          x={0}
          y={0}
          onClick={() => drawRectangle()} ref={stageRef}
          style={{cursor:"crosshair", margin: "3rem"}}>
        </Stage>
        </>
    );
}