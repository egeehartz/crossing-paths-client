import React, { useContext, useEffect, useRef, useState } from "react"
import { Line, Layer, Rect } from "konva";
import { Stage } from 'react-konva';
import "./CreateDesign.css"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { CategoryContext } from "./CategoryProvider";
import { Button } from "reactstrap";
import { DesignContext } from "./DesignProvider";
import { useHistory } from "react-router-dom";
import { TwitterPicker } from 'react-color';
import { ColorContext } from "./ColorProvider";

export const CreateDesign = () => {
    const {getCategories, categories} = useContext(CategoryContext)
    const {colors, getColors} = useContext(ColorContext)
    const {addDesign} = useContext(DesignContext)
    const history = useHistory()

    const [designObj, setDesignObj] = useState({})
    const [color, setColor] = useState("#000000")
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const stageRef = useRef(null)

    //create layer to make the grid
    const gridLayer = new Layer({id:"grid"})

    useEffect(() => {
      if (searchTerm !== "") {
          const results = colors.filter(c => c.floss_number.includes(searchTerm))
          setSearchResults(results);
      }
  }, [searchTerm])

  const [gridObj, setGridObj] = useState({width: 896, height: 896})

  const handleChange = event => {
    if (event.target.name === "deleteMode") {
      if (deleteMode) {
        setDeleteMode(false)
      } else {
        setDeleteMode(true)
        setColor('#FFFFFF')
      }
    } else if (event.target.name === "dmc_search") {
      const userInput = event.target.value.toLowerCase()
      setSearchTerm(userInput);
    } 
};

    useEffect(() => {
      getCategories()
      getColors()
    },[])

    useEffect(() => {
      //creates the grid
        const blockSnapSize = 16;
        const padding = blockSnapSize;
        let width = parseInt(gridObj.width) * 224
        let height = parseInt(gridObj.height) * 224
    
        //last vertical line
        gridLayer.add(new Line({
            points: [896, 0, 896, 896], 
            stroke: '#222',
            strokeWidth: 2
          }));

          //last horizontal line
          gridLayer.add(new Line({
            points: [0, 896, 896, 896], 
            stroke: '#222',
            strokeWidth: 2
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
    


    const drawRectangle = (e) => {
        const blockSnapSize = 16;

        //get the x, y positions of the click
        const coordinates = stageRef.current.getPointerPosition()

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

        const idValue = [newX, newY].join(",")

          //create a rectangle 
          const rectangle = new Rect({
              //if an x, y property gets defined, subtract that from the coordinate
              id: idValue,
              x: (newX[0]),
              y: (newY[0]),
              height: blockSnapSize,
              width: blockSnapSize,
              fill: color,
              stroke: 'black',
              strokeWidth: 0.5,
              draggable: false
          })
  
          //add the rectangle to the layer then draw
          gridLayer.add(rectangle)
          gridLayer.draw()
  
          //add the layer to the stage
          stageRef.current.add(gridLayer)
    }

    const onChange = (e) => {
      const newDesign = Object.assign({}, designObj)
      if (e.target.name === "public") {
          newDesign[e.target.name] = e.target.checked
      } else {
          newDesign[e.target.name] = e.target.value
      }
      setDesignObj(newDesign)
  }

  const onGridChange = (e) => {
    const newDimensions = Object.assign({}, gridObj)
    newDimensions[e.target.name] = parseInt(e.target.value) * 224
    setGridObj(newDimensions)
  }


    const constructPattern = () => {
        const canvas = stageRef.current.toCanvas()
        const img = canvas.toDataURL()

        addDesign({
            title: designObj.title,
            link: "",
            design_img: img,
            category_id: designObj.category_id,
            public: designObj.public
        })
        .then(() => {
          toggle()
          history.push('/homepage')
        })
 
    }

    const userColor = (e) => {
      setColor(e.hex)
    }

    console.log(gridObj)


    return (
      <>
        <button onClick={toggle} >save pattern</button>
        <form>
          <h4>Project Height</h4>
          <input type="text" name="height" placeholder="height in inches" value={gridObj.height}  onChange={onGridChange} />
          <h4>Project Width</h4>
          <input type="text" name="width" placeholder="width in inches" value={gridObj.width} onChange={onGridChange} />
          <button onClick={(e) => {
            e.preventDefault()
            console.log(e)}}>Create Project Grid</button>
        </form>
        <div>
        <h4>Change Square Color</h4>
          <TwitterPicker onChange={userColor} />
        </div>
        <br />
        <div>
          <h4>DMC to HEX Converter</h4>
          <input type="text" name="dmc_search" placeholder="enter floss color here" value={searchTerm} onChange={handleChange} />
          {searchTerm !== "" ?
                        searchResults.map(result => {
                            return <> <li>#{result.rgb_code}, {result.description}</li> </>})
                             : ""}
          {/* onChange would search floss table to find the row that matches the floss number and return the hex number
              kinda like how the friend search is set up
          */}
        </div>
        <br />
        <div>
          <h4>Delete Mode</h4>
          {deleteMode ? "on" : "off"}
          <input type="checkbox" name="deleteMode" onChange={handleChange}/>

        </div>

        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader>Save Your Creation!</ModalHeader>
          <ModalBody>
            <input type="text" name="title" placeholder="design name" onChange={onChange}/>
            <select name="category_id" onChange={onChange}>
                <option value="0">Select a Category</option>
                {
                    categories.map(c => <option value={c.id}>{c.label}</option>)
                }

            </select>
            <label className="publicLabel">Make Design Public</label>
                        <input
                        onChange={onChange}
                            type="checkbox"
                            name="public"
                        />
          </ModalBody>
          <ModalFooter>
            <Button onClick={toggle}>Keep Working</Button>
            <Button onClick={constructPattern}>Save</Button>
          </ModalFooter>
        </Modal>
        <div style={{width: "900px", overflow:"scroll"}}>
        <Stage 
          className="stage"
          opacity={0.9}
          width={gridObj.width}
          height={gridObj.height}
          x={0}
          y={0}
          onClick={e => drawRectangle(e)} 
          ref={stageRef}
          style={{cursor:"crosshair", margin: "3rem"}}>
        </Stage>
        </div>
        </>
    );
}